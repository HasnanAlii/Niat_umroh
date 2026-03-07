// apiClient.js - Updated Version with All New Endpoints
// Path: FE/src/api/apiClient.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Helper function to create headers
const createHeaders = (includeAuth = false, isFormData = false) => {
  const headers = {};
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
};

const apiClient = {
  // ============================================================================
  // AUTHENTICATION
  // ============================================================================
  
  async register(data) {
    return apiCall('/register', {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
  },

  async login(email, password) {
    return apiCall('/login', {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ email, password }),
    });
  },

  async logout() {
    return apiCall('/logout', {
      method: 'POST',
      headers: createHeaders(true),
    });
  },

  async getProfile() {
    return apiCall('/profile', {
      headers: createHeaders(true),
    });
  },

  async updateProfile(data) {
    return apiCall('/profile', {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
  },

  // ============================================================================
  // DASHBOARD
  // ============================================================================

  async getAdminDashboard() {
    return apiCall('/dashboard/admin', {
      headers: createHeaders(true),
    });
  },

  async getJamaahDashboard() {
    return apiCall('/dashboard/jamaah', {
      headers: createHeaders(true),
    });
  },

  // ============================================================================
  // PACKAGES (Travel Packages)
  // ============================================================================

  async getPackages() {
    return apiCall('/packages');
  },

  async getPackage(id) {
    return apiCall(`/packages/${id}`);
  },

  async createPackage(data) {
    return apiCall('/packages', {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async updatePackage(id, data) {
    return apiCall(`/packages/${id}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async deletePackage(id) {
    return apiCall(`/packages/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });
  },

  async getAvailablePackages() {
    return apiCall('/packages/available');
  },

  // ============================================================================
  // ACCOMMODATIONS
  // ============================================================================

  async getAccommodations() {
    return apiCall('/accommodations');
  },

  async getAccommodation(id) {
    return apiCall(`/accommodations/${id}`);
  },

  async createAccommodation(data) {
    return apiCall('/accommodations', {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async updateAccommodation(id, data) {
    return apiCall(`/accommodations/${id}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async deleteAccommodation(id) {
    return apiCall(`/accommodations/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });
  },

  // ============================================================================
  // JAMAAH
  // ============================================================================

  async getJamaahs() {
    return apiCall('/jamaahs');
  },

  async getJamaah(id) {
    return apiCall(`/jamaahs/${id}`);
  },

  async createJamaah(data) {
    return apiCall('/jamaahs', {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async updateJamaah(id, data) {
    return apiCall(`/jamaahs/${id}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async deleteJamaah(id) {
    return apiCall(`/jamaahs/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });
  },

  // ============================================================================
  // BOOKING
  // ============================================================================

  async bookPackage(jamaahId, travelPackageId, monthlyPayment) {
    return apiCall('/bookings', {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify({
        jamaah_id: jamaahId,
        travel_package_id: travelPackageId,
        monthly_payment: monthlyPayment,
      }),
    });
  },

  async cancelBooking(jamaahId) {
    return apiCall(`/bookings/${jamaahId}/cancel`, {
      method: 'POST',
      headers: createHeaders(true),
    });
  },

  async changePackage(jamaahId, newPackageId) {
    return apiCall(`/bookings/${jamaahId}/change`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify({ new_package_id: newPackageId }),
    });
  },

  // ============================================================================
  // TABUNGAN
  // ============================================================================

  async getTabungans(jamaahId = null) {
    const url = jamaahId ? `/tabungans?jamaah_id=${jamaahId}` : '/tabungans';
    return apiCall(url);
  },

  async getTabungan(id) {
    return apiCall(`/tabungans/${id}`);
  },

  async createTabungan(data) {
    return apiCall('/tabungans', {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async updateTabungan(id, data) {
    return apiCall(`/tabungans/${id}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async deleteTabungan(id) {
    return apiCall(`/tabungans/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });
  },

  // ============================================================================
  // PAYMENTS
  // ============================================================================

  async getPayments(filters = {}) {
    const params = new URLSearchParams();
    if (filters.jamaah_id) params.append('jamaah_id', filters.jamaah_id);
    if (filters.status) params.append('status', filters.status);
    
    const url = params.toString() ? `/payments?${params.toString()}` : '/payments';
    return apiCall(url);
  },

  async getPayment(id) {
    return apiCall(`/payments/${id}`);
  },

  async createPayment(data) {
    return apiCall('/payments', {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async uploadPaymentProof(data) {
    // data should be FormData object with: jamaah_id, tabungan_id, amount, payment_date, payment_method, file
    return apiCall('/uploads/payment', {
      method: 'POST',
      headers: createHeaders(true, true), // true for auth, true for form data
      body: data,
    });
  },

  async approvePayment(paymentId) {
    return apiCall(`/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: createHeaders(true),
    });
  },

  async rejectPayment(paymentId, reason) {
    return apiCall(`/payments/${paymentId}/reject`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify({ reason }),
    });
  },

  async downloadPaymentProof(paymentId) {
    const url = `${API_BASE_URL}/payments/${paymentId}/download`;
    const response = await fetch(url, {
      headers: createHeaders(true),
    });
    return response.blob();
  },

  // ============================================================================
  // DOCUMENTS
  // ============================================================================

  async getDocuments(jamaahId = null) {
    const url = jamaahId ? `/documents?jamaah_id=${jamaahId}` : '/documents';
    return apiCall(url);
  },

  async getDocument(id) {
    return apiCall(`/documents/${id}`);
  },

  async createDocument(data) {
    return apiCall('/documents', {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async uploadDocument(documentId, file) {
    const formData = new FormData();
    formData.append('document_id', documentId);
    formData.append('file', file);

    return apiCall('/uploads/document', {
      method: 'POST',
      headers: createHeaders(true, true),
      body: formData,
    });
  },

  async verifyDocument(documentId) {
    return apiCall(`/documents/${documentId}/verify`, {
      method: 'POST',
      headers: createHeaders(true),
    });
  },

  async rejectDocument(documentId, reason) {
    return apiCall(`/documents/${documentId}/reject`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify({ reason }),
    });
  },

  async downloadDocument(documentId) {
    const url = `${API_BASE_URL}/documents/${documentId}/download`;
    const response = await fetch(url, {
      headers: createHeaders(true),
    });
    return response.blob();
  },

  // ============================================================================
  // CONSULTATIONS
  // ============================================================================

  async getConsultations(filters = {}) {
    const params = new URLSearchParams();
    if (filters.jamaah_id) params.append('jamaah_id', filters.jamaah_id);
    if (filters.status) params.append('status', filters.status);
    
    const url = params.toString() ? `/consultations?${params.toString()}` : '/consultations';
    return apiCall(url);
  },

  async getConsultation(id) {
    return apiCall(`/consultations/${id}`);
  },

  async submitConsultation(data) {
    return apiCall('/consultations', {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
  },

  async respondToConsultation(consultationId, response) {
    return apiCall(`/consultations/${consultationId}/respond`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify({ response }),
    });
  },

  async closeConsultation(consultationId) {
    return apiCall(`/consultations/${consultationId}/close`, {
      method: 'POST',
      headers: createHeaders(true),
    });
  },

  async deleteConsultation(id) {
    return apiCall(`/consultations/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });
  },

  // ============================================================================
  // STATISTICS
  // ============================================================================

  async getStatisticsSummary() {
    return apiCall('/statistics/summary', {
      headers: createHeaders(true),
    });
  },

  async getRevenueStatistics(year = null) {
    const url = year ? `/statistics/revenue?year=${year}` : '/statistics/revenue';
    return apiCall(url, {
      headers: createHeaders(true),
    });
  },

  async getPackageStatistics() {
    return apiCall('/statistics/packages', {
      headers: createHeaders(true),
    });
  },

  async getTabunganStatistics() {
    return apiCall('/statistics/tabungan', {
      headers: createHeaders(true),
    });
  },

  async getDocumentStatistics() {
    return apiCall('/statistics/documents', {
      headers: createHeaders(true),
    });
  },

  async exportStatistics(type = 'jamaah') {
    const url = `${API_BASE_URL}/statistics/export?type=${type}`;
    const response = await fetch(url, {
      headers: createHeaders(true),
    });
    return response.blob();
  },
};

export default apiClient;

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*

// 1. AUTHENTICATION
// -----------------
// Register
const registerData = {
  name: "Ahmad Subarjo",
  email: "ahmad@example.com",
  password: "password123",
  password_confirmation: "password123",
  nik: "3201234567890123",
  phone: "081234567890",
  address: "Jl. Sudirman No. 123",
  travel_package_id: 1
};
const { token, user, jamaah } = await apiClient.register(registerData);
localStorage.setItem('auth_token', token);

// Login
const { token } = await apiClient.login('ahmad@example.com', 'password123');
localStorage.setItem('auth_token', token);

// Get Profile
const { user, jamaah } = await apiClient.getProfile();


// 2. DASHBOARD
// ------------
// Admin Dashboard
const dashboardData = await apiClient.getAdminDashboard();
// Use: stats, monthly_revenue, package_stats, recent_activities, pending_payments

// Jamaah Dashboard
const jamaahDash = await apiClient.getJamaahDashboard();
// Use: progress, recent_activities, upcoming_schedule, pending_documents, stats


// 3. BOOKING
// ----------
// Book a package
await apiClient.bookPackage(jamaahId, packageId, 2000000);

// Get available packages
const availablePackages = await apiClient.getAvailablePackages();


// 4. UPLOAD PAYMENT
// -----------------
const formData = new FormData();
formData.append('jamaah_id', 1);
formData.append('tabungan_id', 1);
formData.append('amount', 2000000);
formData.append('payment_date', '2024-03-07');
formData.append('payment_method', 'Transfer BCA');
formData.append('file', fileInput.files[0]);

const result = await apiClient.uploadPaymentProof(formData);


// 5. APPROVE PAYMENT (Admin)
// ---------------------------
await apiClient.approvePayment(paymentId);

// or reject
await apiClient.rejectPayment(paymentId, 'Bukti pembayaran tidak jelas');


// 6. UPLOAD DOCUMENT
// ------------------
await apiClient.uploadDocument(documentId, fileInput.files[0]);


// 7. SUBMIT CONSULTATION
// -----------------------
const consultationData = {
  name: "Ahmad",
  phone: "081234567890",
  email: "ahmad@example.com",
  subject: "Pertanyaan tentang visa",
  message: "Apakah pengurusan visa termasuk?",
  travel_package_id: 1,
  preferred_date: "2024-03-15"
};
await apiClient.submitConsultation(consultationData);


// 8. CRUD JAMAAH (Admin)
// ----------------------
const jamaahs = await apiClient.getJamaahs();
const newJamaah = await apiClient.createJamaah(data);
await apiClient.updateJamaah(id, updatedData);
await apiClient.deleteJamaah(id);


// 9. STATISTICS
// -------------
const summary = await apiClient.getStatisticsSummary();
const revenue = await apiClient.getRevenueStatistics(2024);

// Export to CSV
const blob = await apiClient.exportStatistics('jamaah');
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'jamaah_export.csv';
a.click();


// 10. DOWNLOAD FILES
// ------------------
// Download payment proof
const paymentBlob = await apiClient.downloadPaymentProof(paymentId);
const paymentUrl = window.URL.createObjectURL(paymentBlob);
window.open(paymentUrl);

// Download document
const docBlob = await apiClient.downloadDocument(documentId);

*/
