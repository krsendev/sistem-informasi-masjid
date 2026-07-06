/* ============================================
   SIMM API Tester — Application Logic
   ============================================ */

(function () {
  "use strict";

  // ==========================================
  // State Management
  // ==========================================
  const state = {
    baseUrl: "http://103.150.116.43:4001",
    accessToken: null,
    refreshToken: null,
    currentUser: null,
    requestCount: 0,
    successCount: 0,
    history: [],
  };

  // ==========================================
  // DOM Helpers
  // ==========================================
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function getBaseUrl() {
    return $("#base-url").value.replace(/\/+$/, "");
  }

  // ==========================================
  // Toast Notifications
  // ==========================================
  function showToast(message, type = "info") {
    const container = $("#toast-container");
    const icons = { success: "✅", error: "❌", info: "ℹ️" };
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("removing");
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ==========================================
  // JSON Syntax Highlighting
  // ==========================================
  function highlightJSON(json) {
    if (typeof json !== "string") {
      json = JSON.stringify(json, null, 2);
    }
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?|\bnull\b)/g,
      (match) => {
        let cls = "json-number";
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? "json-key" : "json-string";
        } else if (/true|false/.test(match)) {
          cls = "json-boolean";
        } else if (/null/.test(match)) {
          cls = "json-null";
        }
        return `<span class="${cls}">${match}</span>`;
      },
    );
  }

  // ==========================================
  // Response Renderer
  // ==========================================
  function renderResponse(panelId, status, data, duration) {
    const panel = $(`#${panelId}`);
    const statusClass =
      status >= 200 && status < 300
        ? "success"
        : status >= 400 && status < 500
          ? "warning"
          : "error";
    const statusText =
      status >= 200 && status < 300
        ? "OK"
        : status >= 400 && status < 500
          ? "Client Error"
          : "Server Error";

    let jsonStr;
    try {
      jsonStr = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    } catch {
      jsonStr = String(data);
    }

    panel.innerHTML = `
      <div class="response-wrapper">
        <div class="response-header">
          <div class="response-status">
            <span class="status-code ${statusClass}">${status} ${statusText}</span>
          </div>
          <span class="response-time">${duration}ms</span>
        </div>
        <div class="response-body">${highlightJSON(jsonStr)}</div>
      </div>
    `;
  }

  function renderError(panelId, error, duration = 0) {
    const panel = $(`#${panelId}`);
    panel.innerHTML = `
      <div class="response-wrapper">
        <div class="response-header">
          <div class="response-status">
            <span class="status-code error">ERROR</span>
          </div>
          <span class="response-time">${duration}ms</span>
        </div>
        <div class="response-body" style="color: var(--delete-text);">${error}</div>
      </div>
    `;
  }

  // ==========================================
  // API Request Helper
  // ==========================================
  async function apiRequest(method, path, options = {}) {
    const url = new URL(path, getBaseUrl());
    const startTime = performance.now();

    // Add query parameters
    if (options.params) {
      Object.entries(options.params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          url.searchParams.append(key, val);
        }
      });
    }

    const fetchOptions = {
      method,
      headers: {},
      credentials: "include", // for cookies
    };

    // Set authorization header
    if (state.accessToken) {
      fetchOptions.headers["Authorization"] = `Bearer ${state.accessToken}`;
    }

    // Body handling
    if (options.body) {
      if (options.body instanceof FormData) {
        fetchOptions.body = options.body;
        // Don't set Content-Type for FormData; browser sets it with boundary
      } else {
        fetchOptions.headers["Content-Type"] = "application/json";
        fetchOptions.body = JSON.stringify(options.body);
      }
    }

    try {
      const response = await fetch(url.toString(), fetchOptions);
      const duration = Math.round(performance.now() - startTime);
      let data;
      try {
        data = await response.json();
      } catch {
        data = { message: "Response is not JSON" };
      }

      // Track stats
      state.requestCount++;
      if (response.ok) state.successCount++;
      updateStats();

      // Add to history
      addToHistory(method, path, response.status, duration, data);

      return { status: response.status, data, duration, ok: response.ok };
    } catch (error) {
      const duration = Math.round(performance.now() - startTime);
      state.requestCount++;
      updateStats();
      addToHistory(method, path, 0, duration, { error: error.message });
      throw { message: error.message, duration };
    }
  }

  // ==========================================
  // History Management
  // ==========================================
  function addToHistory(method, path, status, duration, data) {
    state.history.unshift({
      method,
      path,
      status,
      duration,
      data,
      timestamp: new Date(),
    });

    // Keep max 100 entries
    if (state.history.length > 100) state.history.pop();
    renderHistory();
  }

  function renderHistory() {
    const list = $("#history-list");
    const count = $("#history-count");
    count.textContent = `${state.history.length} requests`;

    if (state.history.length === 0) {
      list.innerHTML = `
        <div class="history-empty">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2" opacity="0.3"/>
            <path d="M24 14v10l7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
          </svg>
          <p>Belum ada request yang dilakukan</p>
        </div>
      `;
      return;
    }

    list.innerHTML = state.history
      .map(
        (item, idx) => `
      <div class="history-item" data-index="${idx}">
        <div class="history-item-header">
          <span class="method-badge ${item.method.toLowerCase()}">${item.method}</span>
          <span class="history-item-path">${item.path}</span>
          <span class="history-item-time">${formatTime(item.timestamp)}</span>
        </div>
        <div class="history-item-meta">
          <span class="status-code ${item.status >= 200 && item.status < 300 ? "success" : item.status >= 400 ? "warning" : "error"}">${item.status || "ERR"}</span>
          <span>${item.duration}ms</span>
        </div>
        <div class="history-item-expand">
          <pre>${highlightJSON(JSON.stringify(item.data, null, 2))}</pre>
        </div>
      </div>
    `,
      )
      .join("");

    // Add click handlers
    list.querySelectorAll(".history-item").forEach((el) => {
      el.addEventListener("click", () => el.classList.toggle("expanded"));
    });
  }

  function formatTime(date) {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  // ==========================================
  // Stats Update
  // ==========================================
  function updateStats() {
    $("#stat-requests-value").textContent = state.requestCount;
    if (state.requestCount > 0) {
      const rate = Math.round((state.successCount / state.requestCount) * 100);
      $("#stat-success-value").textContent = `${rate}%`;
    }
  }

  function updateAuthUI() {
    const indicator = $("#auth-indicator");
    const text = $("#auth-text");
    const statValue = $("#stat-auth-value");

    if (state.accessToken && state.currentUser) {
      indicator.className = "auth-indicator connected";
      text.textContent = state.currentUser.name || state.currentUser.email;
      statValue.textContent = `${state.currentUser.role}`;
      statValue.style.color = "var(--accent-green)";
    } else {
      indicator.className = "auth-indicator disconnected";
      text.textContent = "Not Authenticated";
      statValue.textContent = "Not Logged In";
      statValue.style.color = "";
    }
  }

  // ==========================================
  // Navigation
  // ==========================================
  function initNavigation() {
    $$(".nav-item").forEach((item) => {
      item.addEventListener("click", () => {
        const section = item.dataset.section;
        if (!section) return;

        // Update active nav item
        $$(".nav-item").forEach((n) => n.classList.remove("active"));
        item.classList.add("active");

        // Show corresponding section
        $$(".section").forEach((s) => s.classList.remove("active"));
        const target = $(`#section-${section}`);
        if (target) target.classList.add("active");
      });
    });
  }

  // ==========================================
  // Health Check
  // ==========================================
  async function healthCheck() {
    const statValue = $("#stat-health-value");
    try {
      const result = await apiRequest("GET", "/api/health");
      renderResponse(
        "auth-login-response",
        result.status,
        result.data,
        result.duration,
      );
      if (result.ok) {
        statValue.textContent = "Online ✓";
        statValue.style.color = "var(--accent-green)";
        showToast("Server is online and healthy!", "success");
      } else {
        statValue.textContent = "Error";
        statValue.style.color = "var(--accent-red)";
      }
    } catch (err) {
      statValue.textContent = "Offline ✗";
      statValue.style.color = "var(--accent-red)";
      showToast(`Server unreachable: ${err.message}`, "error");
    }
  }

  // ==========================================
  // Auth Actions
  // ==========================================
  async function doLogin(email, password) {
    const btn = event?.target?.closest?.(".btn-send") || null;
    if (btn) btn.classList.add("loading");
    try {
      const result = await apiRequest("POST", "/api/auth/login", {
        body: { email, password },
      });
      renderResponse(
        "auth-login-response",
        result.status,
        result.data,
        result.duration,
      );
      if (result.ok && result.data.data) {
        state.accessToken = result.data.data.accessToken;
        state.currentUser = result.data.data.user;
        if (result.data.data.refreshToken) {
          state.refreshToken = result.data.data.refreshToken;
        }
        updateAuthUI();
        showToast(
          `Login berhasil sebagai ${state.currentUser.name}`,
          "success",
        );
      } else {
        showToast(result.data.message || "Login gagal", "error");
      }
    } catch (err) {
      renderError("auth-login-response", err.message, err.duration);
      showToast(`Login error: ${err.message}`, "error");
    }
    if (btn) btn.classList.remove("loading");
  }

  // ==========================================
  // Initialize All Event Listeners
  // ==========================================
  function initEventListeners() {
    // Health Check
    $("#btn-health").addEventListener("click", healthCheck);

    // --- AUTH ---
    $("#btn-login").addEventListener("click", () => {
      doLogin($("#login-email").value, $("#login-password").value);
    });

    $("#btn-login-superadmin").addEventListener("click", () => {
      $("#login-email").value = "admin@masjid.com";
      $("#login-password").value = "password123";
      doLogin("admin@masjid.com", "password123");
    });

    $("#btn-login-admin").addEventListener("click", () => {
      $("#login-email").value = "admin2@masjid.com";
      $("#login-password").value = "password123";
      doLogin("admin2@masjid.com", "password123");
    });

    $("#btn-get-profile").addEventListener("click", async () => {
      try {
        const r = await apiRequest("GET", "/api/auth/profile");
        renderResponse("auth-profile-response", r.status, r.data, r.duration);
      } catch (err) {
        renderError("auth-profile-response", err.message, err.duration);
      }
    });

    $("#btn-update-profile").addEventListener("click", async () => {
      const body = {};
      const name = $("#update-profile-name").value;
      const phone = $("#update-profile-phone").value;
      if (name) body.name = name;
      if (phone) body.phone = phone;
      try {
        const r = await apiRequest("PUT", "/api/auth/profile", { body });
        renderResponse(
          "auth-update-profile-response",
          r.status,
          r.data,
          r.duration,
        );
        if (r.ok) showToast("Profile updated", "success");
      } catch (err) {
        renderError("auth-update-profile-response", err.message, err.duration);
      }
    });

    $("#btn-change-password").addEventListener("click", async () => {
      const body = {
        oldPassword: $("#change-pw-old").value,
        newPassword: $("#change-pw-new").value,
        confirmPassword: $("#change-pw-confirm").value,
      };
      try {
        const r = await apiRequest("PUT", "/api/auth/change-password", {
          body,
        });
        renderResponse("auth-change-pw-response", r.status, r.data, r.duration);
        if (r.ok) showToast("Password changed", "success");
      } catch (err) {
        renderError("auth-change-pw-response", err.message, err.duration);
      }
    });

    $("#btn-refresh-token").addEventListener("click", async () => {
      const body = {};
      if (state.refreshToken) body.refreshToken = state.refreshToken;
      try {
        const r = await apiRequest("POST", "/api/auth/refresh-token", { body });
        renderResponse("auth-refresh-response", r.status, r.data, r.duration);
        if (r.ok && r.data.data?.accessToken) {
          state.accessToken = r.data.data.accessToken;
          showToast("Token refreshed", "success");
        }
      } catch (err) {
        renderError("auth-refresh-response", err.message, err.duration);
      }
    });

    $("#btn-logout").addEventListener("click", async () => {
      try {
        const r = await apiRequest("POST", "/api/auth/logout");
        renderResponse("auth-logout-response", r.status, r.data, r.duration);
        state.accessToken = null;
        state.refreshToken = null;
        state.currentUser = null;
        updateAuthUI();
        showToast("Logout berhasil", "success");
      } catch (err) {
        renderError("auth-logout-response", err.message, err.duration);
        // Clear state anyway
        state.accessToken = null;
        state.refreshToken = null;
        state.currentUser = null;
        updateAuthUI();
      }
    });

    // --- USERS ---
    $("#btn-get-users").addEventListener("click", async () => {
      const params = {
        page: $("#users-page").value,
        limit: $("#users-limit").value,
        search: $("#users-search").value,
        role: $("#users-role").value,
      };
      try {
        const r = await apiRequest("GET", "/api/users", { params });
        renderResponse("users-list-response", r.status, r.data, r.duration);
      } catch (err) {
        renderError("users-list-response", err.message, err.duration);
      }
    });

    $("#btn-get-user").addEventListener("click", async () => {
      const id = $("#user-get-id").value;
      if (!id) return showToast("User ID diperlukan", "error");
      try {
        const r = await apiRequest("GET", `/api/users/${id}`);
        renderResponse("users-get-response", r.status, r.data, r.duration);
      } catch (err) {
        renderError("users-get-response", err.message, err.duration);
      }
    });

    $("#btn-create-user").addEventListener("click", async () => {
      const body = {
        name: $("#user-create-name").value,
        email: $("#user-create-email").value,
        password: $("#user-create-password").value,
      };
      const phone = $("#user-create-phone").value;
      const role = $("#user-create-role").value;
      if (phone) body.phone = phone;
      if (role) body.role = role;
      try {
        const r = await apiRequest("POST", "/api/users", { body });
        renderResponse("users-create-response", r.status, r.data, r.duration);
        if (r.ok) showToast("User created", "success");
      } catch (err) {
        renderError("users-create-response", err.message, err.duration);
      }
    });

    $("#btn-update-user").addEventListener("click", async () => {
      const id = $("#user-update-id").value;
      if (!id) return showToast("User ID diperlukan", "error");
      const body = {};
      const name = $("#user-update-name").value;
      const email = $("#user-update-email").value;
      const role = $("#user-update-role").value;
      const active = $("#user-update-active").value;
      if (name) body.name = name;
      if (email) body.email = email;
      if (role) body.role = role;
      if (active !== "") body.isActive = active === "true";
      try {
        const r = await apiRequest("PUT", `/api/users/${id}`, { body });
        renderResponse("users-update-response", r.status, r.data, r.duration);
        if (r.ok) showToast("User updated", "success");
      } catch (err) {
        renderError("users-update-response", err.message, err.duration);
      }
    });

    $("#btn-delete-user").addEventListener("click", async () => {
      const id = $("#user-delete-id").value;
      if (!id) return showToast("User ID diperlukan", "error");
      try {
        const r = await apiRequest("DELETE", `/api/users/${id}`);
        renderResponse("users-delete-response", r.status, r.data, r.duration);
        if (r.ok) showToast("User deleted", "success");
      } catch (err) {
        renderError("users-delete-response", err.message, err.duration);
      }
    });

    // --- ANNOUNCEMENTS ---
    $("#btn-get-announcements").addEventListener("click", async () => {
      const params = {
        page: $("#ann-page").value,
        limit: $("#ann-limit").value,
        search: $("#ann-search").value,
        status: $("#ann-status").value,
        category: $("#ann-category").value,
        sortBy: $("#ann-sort").value,
      };
      try {
        const r = await apiRequest("GET", "/api/announcements", { params });
        renderResponse("ann-list-response", r.status, r.data, r.duration);
      } catch (err) {
        renderError("ann-list-response", err.message, err.duration);
      }
    });

    $("#btn-get-announcement").addEventListener("click", async () => {
      const id = $("#ann-get-id").value;
      if (!id) return showToast("Announcement ID diperlukan", "error");
      try {
        const r = await apiRequest("GET", `/api/announcements/${id}`);
        renderResponse("ann-get-response", r.status, r.data, r.duration);
      } catch (err) {
        renderError("ann-get-response", err.message, err.duration);
      }
    });

    $("#btn-create-announcement").addEventListener("click", async () => {
      const formData = new FormData();
      formData.append("title", $("#ann-create-title").value);
      formData.append("content", $("#ann-create-content").value);
      formData.append("category", $("#ann-create-category").value);
      formData.append("status", $("#ann-create-status").value);
      const file = $("#ann-create-thumb").files[0];
      if (file) formData.append("thumbnail", file);
      try {
        const r = await apiRequest("POST", "/api/announcements", {
          body: formData,
        });
        renderResponse("ann-create-response", r.status, r.data, r.duration);
        if (r.ok) showToast("Announcement created", "success");
      } catch (err) {
        renderError("ann-create-response", err.message, err.duration);
      }
    });

    $("#btn-update-announcement").addEventListener("click", async () => {
      const id = $("#ann-update-id").value;
      if (!id) return showToast("Announcement ID diperlukan", "error");
      const formData = new FormData();
      const title = $("#ann-update-title").value;
      const content = $("#ann-update-content").value;
      const category = $("#ann-update-category").value;
      const status = $("#ann-update-status").value;
      if (title) formData.append("title", title);
      if (content) formData.append("content", content);
      if (category) formData.append("category", category);
      if (status) formData.append("status", status);
      try {
        const r = await apiRequest("PUT", `/api/announcements/${id}`, {
          body: formData,
        });
        renderResponse("ann-update-response", r.status, r.data, r.duration);
        if (r.ok) showToast("Announcement updated", "success");
      } catch (err) {
        renderError("ann-update-response", err.message, err.duration);
      }
    });

    $("#btn-delete-announcement").addEventListener("click", async () => {
      const id = $("#ann-delete-id").value;
      if (!id) return showToast("Announcement ID diperlukan", "error");
      try {
        const r = await apiRequest("DELETE", `/api/announcements/${id}`);
        renderResponse("ann-delete-response", r.status, r.data, r.duration);
        if (r.ok) showToast("Announcement deleted", "success");
      } catch (err) {
        renderError("ann-delete-response", err.message, err.duration);
      }
    });

    // --- EVENTS ---
    $("#btn-get-events").addEventListener("click", async () => {
      const params = {
        page: $("#evt-page").value,
        limit: $("#evt-limit").value,
        search: $("#evt-search").value,
        category: $("#evt-category").value,
        startDate: $("#evt-start-date").value,
        endDate: $("#evt-end-date").value,
        upcoming: $("#evt-upcoming").value,
        past: $("#evt-past").value,
      };
      try {
        const r = await apiRequest("GET", "/api/events", { params });
        renderResponse("evt-list-response", r.status, r.data, r.duration);
      } catch (err) {
        renderError("evt-list-response", err.message, err.duration);
      }
    });

    $("#btn-get-event").addEventListener("click", async () => {
      const id = $("#evt-get-id").value;
      if (!id) return showToast("Event ID diperlukan", "error");
      try {
        const r = await apiRequest("GET", `/api/events/${id}`);
        renderResponse("evt-get-response", r.status, r.data, r.duration);
      } catch (err) {
        renderError("evt-get-response", err.message, err.duration);
      }
    });

    $("#btn-create-event").addEventListener("click", async () => {
      const formData = new FormData();
      formData.append("title", $("#evt-create-title").value);
      formData.append("description", $("#evt-create-desc").value);
      formData.append("category", $("#evt-create-category").value);
      formData.append("location", $("#evt-create-location").value);
      formData.append("date", $("#evt-create-date").value);
      formData.append("startTime", $("#evt-create-start").value);
      formData.append("endTime", $("#evt-create-end").value);
      formData.append("isPublished", $("#evt-create-published").value);
      const ustadz = $("#evt-create-ustadz").value;
      if (ustadz) formData.append("ustadz", ustadz);
      const file = $("#evt-create-image").files[0];
      if (file) formData.append("image", file);
      try {
        const r = await apiRequest("POST", "/api/events", { body: formData });
        renderResponse("evt-create-response", r.status, r.data, r.duration);
        if (r.ok) showToast("Event created", "success");
      } catch (err) {
        renderError("evt-create-response", err.message, err.duration);
      }
    });

    $("#btn-update-event").addEventListener("click", async () => {
      const id = $("#evt-update-id").value;
      if (!id) return showToast("Event ID diperlukan", "error");
      const formData = new FormData();
      const title = $("#evt-update-title").value;
      const desc = $("#evt-update-desc").value;
      const date = $("#evt-update-date").value;
      const startTime = $("#evt-update-start").value;
      const endTime = $("#evt-update-end").value;
      if (title) formData.append("title", title);
      if (desc) formData.append("description", desc);
      if (date) formData.append("date", date);
      if (startTime) formData.append("startTime", startTime);
      if (endTime) formData.append("endTime", endTime);
      try {
        const r = await apiRequest("PUT", `/api/events/${id}`, {
          body: formData,
        });
        renderResponse("evt-update-response", r.status, r.data, r.duration);
        if (r.ok) showToast("Event updated", "success");
      } catch (err) {
        renderError("evt-update-response", err.message, err.duration);
      }
    });

    $("#btn-delete-event").addEventListener("click", async () => {
      const id = $("#evt-delete-id").value;
      if (!id) return showToast("Event ID diperlukan", "error");
      try {
        const r = await apiRequest("DELETE", `/api/events/${id}`);
        renderResponse("evt-delete-response", r.status, r.data, r.duration);
        if (r.ok) showToast("Event deleted", "success");
      } catch (err) {
        renderError("evt-delete-response", err.message, err.duration);
      }
    });

    // --- FINANCES ---
    $("#btn-get-finances").addEventListener("click", async () => {
      const params = {
        page: $("#fin-page").value,
        limit: $("#fin-limit").value,
        type: $("#fin-type").value,
        category: $("#fin-category").value,
        startDate: $("#fin-start-date").value,
        endDate: $("#fin-end-date").value,
        search: $("#fin-search").value,
      };
      try {
        const r = await apiRequest("GET", "/api/finances", { params });
        renderResponse("fin-list-response", r.status, r.data, r.duration);
      } catch (err) {
        renderError("fin-list-response", err.message, err.duration);
      }
    });

    $("#btn-get-finance-summary").addEventListener("click", async () => {
      const params = {
        startDate: $("#fin-sum-start").value,
        endDate: $("#fin-sum-end").value,
      };
      try {
        const r = await apiRequest("GET", "/api/finances/summary", { params });
        renderResponse("fin-summary-response", r.status, r.data, r.duration);
      } catch (err) {
        renderError("fin-summary-response", err.message, err.duration);
      }
    });

    $("#btn-get-finance-monthly").addEventListener("click", async () => {
      const params = { year: $("#fin-monthly-year").value };
      try {
        const r = await apiRequest("GET", "/api/finances/monthly", { params });
        renderResponse("fin-monthly-response", r.status, r.data, r.duration);
      } catch (err) {
        renderError("fin-monthly-response", err.message, err.duration);
      }
    });

    $("#btn-get-finance-yearly").addEventListener("click", async () => {
      try {
        const r = await apiRequest("GET", "/api/finances/yearly");
        renderResponse("fin-yearly-response", r.status, r.data, r.duration);
      } catch (err) {
        renderError("fin-yearly-response", err.message, err.duration);
      }
    });

    $("#btn-get-finance").addEventListener("click", async () => {
      const id = $("#fin-get-id").value;
      if (!id) return showToast("Finance ID diperlukan", "error");
      try {
        const r = await apiRequest("GET", `/api/finances/${id}`);
        renderResponse("fin-get-response", r.status, r.data, r.duration);
      } catch (err) {
        renderError("fin-get-response", err.message, err.duration);
      }
    });

    $("#btn-create-finance").addEventListener("click", async () => {
      const body = {
        type: $("#fin-create-type").value,
        category: $("#fin-create-category").value,
        amount: Number($("#fin-create-amount").value),
        date: $("#fin-create-date").value,
        description: $("#fin-create-desc").value,
      };
      try {
        const r = await apiRequest("POST", "/api/finances", { body });
        renderResponse("fin-create-response", r.status, r.data, r.duration);
        if (r.ok) showToast("Finance record created", "success");
      } catch (err) {
        renderError("fin-create-response", err.message, err.duration);
      }
    });

    $("#btn-delete-finance").addEventListener("click", async () => {
      const id = $("#fin-delete-id").value;
      if (!id) return showToast("Finance ID diperlukan", "error");
      try {
        const r = await apiRequest("DELETE", `/api/finances/${id}`);
        renderResponse("fin-delete-response", r.status, r.data, r.duration);
        if (r.ok) showToast("Finance record deleted", "success");
      } catch (err) {
        renderError("fin-delete-response", err.message, err.duration);
      }
    });

    // --- DONATIONS ---
    $("#btn-get-donations").addEventListener("click", async () => {
      const params = {
        page: $("#don-page").value,
        limit: $("#don-limit").value,
        search: $("#don-search").value,
        category: $("#don-category").value,
        startDate: $("#don-start-date").value,
        endDate: $("#don-end-date").value,
      };
      try {
        const r = await apiRequest("GET", "/api/donations", { params });
        renderResponse("don-list-response", r.status, r.data, r.duration);
      } catch (err) {
        renderError("don-list-response", err.message, err.duration);
      }
    });

    $("#btn-get-donation-summary").addEventListener("click", async () => {
      const params = {
        startDate: $("#don-sum-start").value,
        endDate: $("#don-sum-end").value,
      };
      try {
        const r = await apiRequest("GET", "/api/donations/summary", { params });
        renderResponse("don-summary-response", r.status, r.data, r.duration);
      } catch (err) {
        renderError("don-summary-response", err.message, err.duration);
      }
    });

    $("#btn-get-recent-donations").addEventListener("click", async () => {
      const params = { limit: $("#don-recent-limit").value };
      try {
        const r = await apiRequest("GET", "/api/donations/recent", { params });
        renderResponse("don-recent-response", r.status, r.data, r.duration);
      } catch (err) {
        renderError("don-recent-response", err.message, err.duration);
      }
    });

    $("#btn-get-donation").addEventListener("click", async () => {
      const id = $("#don-get-id").value;
      if (!id) return showToast("Donation ID diperlukan", "error");
      try {
        const r = await apiRequest("GET", `/api/donations/${id}`);
        renderResponse("don-get-response", r.status, r.data, r.duration);
      } catch (err) {
        renderError("don-get-response", err.message, err.duration);
      }
    });

    $("#btn-create-donation").addEventListener("click", async () => {
      const body = {
        donorName: $("#don-create-donor").value,
        amount: Number($("#don-create-amount").value),
        category: $("#don-create-category").value,
        date: $("#don-create-date").value,
      };
      const note = $("#don-create-note").value;
      if (note) body.note = note;
      try {
        const r = await apiRequest("POST", "/api/donations", { body });
        renderResponse("don-create-response", r.status, r.data, r.duration);
        if (r.ok) showToast("Donation created", "success");
      } catch (err) {
        renderError("don-create-response", err.message, err.duration);
      }
    });

    $("#btn-update-donation").addEventListener("click", async () => {
      const id = $("#don-update-id").value;
      if (!id) return showToast("Donation ID diperlukan", "error");
      const body = {};
      const donor = $("#don-update-donor").value;
      const amount = $("#don-update-amount").value;
      const category = $("#don-update-category").value;
      if (donor) body.donorName = donor;
      if (amount) body.amount = Number(amount);
      if (category) body.category = category;
      try {
        const r = await apiRequest("PUT", `/api/donations/${id}`, { body });
        renderResponse("don-update-response", r.status, r.data, r.duration);
        if (r.ok) showToast("Donation updated", "success");
      } catch (err) {
        renderError("don-update-response", err.message, err.duration);
      }
    });

    $("#btn-delete-donation").addEventListener("click", async () => {
      const id = $("#don-delete-id").value;
      if (!id) return showToast("Donation ID diperlukan", "error");
      try {
        const r = await apiRequest("DELETE", `/api/donations/${id}`);
        renderResponse("don-delete-response", r.status, r.data, r.duration);
        if (r.ok) showToast("Donation deleted", "success");
      } catch (err) {
        renderError("don-delete-response", err.message, err.duration);
      }
    });

    // --- HISTORY ---
    $("#btn-clear-history").addEventListener("click", () => {
      state.history = [];
      renderHistory();
      showToast("History cleared", "info");
    });
  }

  // ==========================================
  // Initialize Application
  // ==========================================
  function init() {
    initNavigation();
    initEventListeners();
    renderHistory();
    updateAuthUI();
    updateStats();

    // Auto health check on load
    setTimeout(healthCheck, 500);
  }

  // Boot
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
