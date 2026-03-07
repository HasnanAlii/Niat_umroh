export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  ENDPOINTS: {
    PACKAGES: '/packages',
    ACCOMMODATIONS: '/accommodations',
    JAMAAHS: '/jamaahs',
    TABUNGANS: '/tabungans',
    PAYMENTS: '/payments',
    DOCUMENTS: '/documents',
    CONSULTATIONS: '/consultations',
  }
};

export default API_CONFIG;
