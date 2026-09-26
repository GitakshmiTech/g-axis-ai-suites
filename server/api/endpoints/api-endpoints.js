// ==================================================================================================================
//    API Endpoints Registry  -  Contains central routing endpoints for all modules.
// ==================================================================================================================
module.exports = {

  // ==================================================================================================================
  //    Auth & Identity Module
  // ==================================================================================================================
  AUTH: {
    
    LOGIN: '/api/v1/auth/login',
    PASSWORD_RESET_REQUEST: '/api/v1/auth/password-reset/request',
    PASSWORD_RESET_CONFIRM: '/api/v1/auth/password-reset/confirm',
    SSO_GOOGLE_ACCOUNTS: '/api/v1/auth/sso/google/accounts'
  },

  // ==================================================================================================================
  //    Platform Governance Module
  // ==================================================================================================================
  ADMIN_DASHBOARD: {
    SUMMARY: '/api/v1/admin/dashboard/summary',
    REVENUE_CHART: '/api/v1/admin/dashboard/revenue-chart',
    PRODUCT_POPULARITY: '/api/v1/admin/dashboard/product-popularity',
    EXPORT: '/api/v1/admin/dashboard/export'
  }
};
