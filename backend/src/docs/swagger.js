/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication & authorization
 *   - name: Users
 *     description: User management (superadmin only)
 *   - name: Announcements
 *     description: Announcement management
 *   - name: Events
 *     description: Event management
 *   - name: Finances
 *     description: Finance management
 *   - name: Donations
 *     description: Donation management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         role:
 *           type: string
 *           enum: [superadmin, admin]
 *         isActive:
 *           type: boolean
 *         lastLogin:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Announcement:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         slug:
 *           type: string
 *         content:
 *           type: string
 *         category:
 *           type: string
 *         thumbnail:
 *           type: string
 *         status:
 *           type: string
 *           enum: [draft, published]
 *         author:
 *           $ref: '#/components/schemas/UserRef'
 *         publishedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Event:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         ustadz:
 *           type: string
 *         category:
 *           type: string
 *         location:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         startTime:
 *           type: string
 *           example: '08:00'
 *         endTime:
 *           type: string
 *           example: '10:00'
 *         image:
 *           type: string
 *         isPublished:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Finance:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         type:
 *           type: string
 *           enum: [income, expense]
 *         category:
 *           type: string
 *         amount:
 *           type: number
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         createdBy:
 *           $ref: '#/components/schemas/UserRef'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Donation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         donorName:
 *           type: string
 *         amount:
 *           type: number
 *         category:
 *           type: string
 *         note:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         createdBy:
 *           $ref: '#/components/schemas/UserRef'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     UserRef:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         data:
 *           type: object
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 *
 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             type: object
 *         pagination:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *             page:
 *               type: integer
 *             limit:
 *               type: integer
 *             totalPages:
 *               type: integer
 *             hasNextPage:
 *               type: boolean
 *             hasPrevPage:
 *               type: boolean
 *
 *     FinanceSummary:
 *       type: object
 *       properties:
 *         totalIncome:
 *           type: number
 *         totalExpense:
 *           type: number
 *         balance:
 *           type: number
 *         incomeCount:
 *           type: integer
 *         expenseCount:
 *           type: integer
 *         totalTransactions:
 *           type: integer
 *
 *     DonationSummary:
 *       type: object
 *       properties:
 *         totalDonations:
 *           type: number
 *         donorCount:
 *           type: integer
 *         averageDonation:
 *           type: number
 *         maxDonation:
 *           type: number
 *         minDonation:
 *           type: number
 *         categoryBreakdown:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *               total:
 *                 type: number
 *               count:
 *                 type: integer
 */
