const slugify = require('slugify');

// Generate a URL friendly slug from a title
const generateSlug = (title) => {
  return slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
};

// Generate a unique slug by appending a timestamp suffix
const generateUniqueSlug = (title) => {
  const base = generateSlug(title);
  const suffix = Date.now().toString(36);
  return `${base}-${suffix}`;
};

module.exports = {
  generateSlug,
  generateUniqueSlug,
};
