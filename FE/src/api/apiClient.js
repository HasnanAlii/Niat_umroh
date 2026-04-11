import API_CONFIG from '@/config/api';

const { BASE_URL, ENDPOINTS } = API_CONFIG;

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Helper function to create headers
const createHeaders = (includeAuth = false, isFormData = false) => {
  const headers = {};
  
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
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
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API request failed' }));
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

  async getNotifications(limit = 10) {
    return apiCall(`/notifications?limit=${limit}`, {
      headers: createHeaders(true),
    });
  },

  // ============================================================================
  // PACKAGES (Travel Packages)
  // ============================================================================

  async getPackages() {
    try {
      const response = await fetch(`${BASE_URL}${ENDPOINTS.PACKAGES}`);
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching packages:', error);
      throw error;
    }
  },

  async getPackage(id) {
    try {
      const response = await fetch(`${BASE_URL}${ENDPOINTS.PACKAGES}/${id}`);
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching package:', error);
      throw error;
    }
  },

  // ============= JAMAAHS =============
  async getJamaahs() {
    try {
      const response = await fetch(`${BASE_URL}${ENDPOINTS.JAMAAHS}`, { headers: createHeaders(true) });
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching jamaahs:', error);
      throw error;
    }
  },

  async getJamaah(id) {
    try {
      const response = await fetch(`${BASE_URL}${ENDPOINTS.JAMAAHS}/${id}`, { headers: createHeaders(true) });
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching jamaah:', error);
      throw error;
    }
  },

  // ============= TABUNGANS =============
  async getTabungans(jamaahId = null) {
    try {
      const url = jamaahId 
        ? `${BASE_URL}${ENDPOINTS.TABUNGANS}?jamaah_id=${jamaahId}`
        : `${BASE_URL}${ENDPOINTS.TABUNGANS}`;
      const response = await fetch(url);
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching tabungans:', error);
      throw error;
    }
  },

  async getTabungan(id) {
    try {
      const response = await fetch(`${BASE_URL}${ENDPOINTS.TABUNGANS}/${id}`);
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching tabungan:', error);
      throw error;
    }
  },

  // ============= DOCUMENTS =============
  async getDocuments(jamaahId = null) {
    try {
      const url = jamaahId 
        ? `${BASE_URL}${ENDPOINTS.DOCUMENTS}?jamaah_id=${jamaahId}`
        : `${BASE_URL}${ENDPOINTS.DOCUMENTS}`;
      const response = await fetch(url, { headers: createHeaders(true) });
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  async getDocument(id) {
    try {
      const response = await fetch(`${BASE_URL}${ENDPOINTS.DOCUMENTS}/${id}`, { headers: createHeaders(true) });
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  },

  // ============= CONSULTATIONS =============
  async getConsultations(jamaahId = null) {
    try {
      const url = jamaahId 
        ? `${BASE_URL}${ENDPOINTS.CONSULTATIONS}?jamaah_id=${jamaahId}`
        : `${BASE_URL}${ENDPOINTS.CONSULTATIONS}`;
      const response = await fetch(url);
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching consultations:', error);
      throw error;
    }
  },

  async getConsultation(id) {
    try {
      const response = await fetch(`${BASE_URL}${ENDPOINTS.CONSULTATIONS}/${id}`);
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching consultation:', error);
      throw error;
    }
  },

  // ============= PAYMENTS =============
  async getPayments(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.jamaah_id) params.append('jamaah_id', filters.jamaah_id);
      if (filters.status) params.append('status', filters.status);
      const url = `${BASE_URL}${ENDPOINTS.PAYMENTS}?${params.toString()}`;
      const response = await fetch(url, { headers: createHeaders(true) });
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  async getPayment(id) {
    try {
      const response = await fetch(`${BASE_URL}${ENDPOINTS.PAYMENTS}/${id}`, { headers: createHeaders(true) });
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw error;
    }
  },

  async downloadPaymentProof(paymentId) {
    const url = `${BASE_URL}/payments/${paymentId}/download`;
    const response = await fetch(url, { headers: createHeaders(true) });
    if (!response.ok) throw new Error('Download failed');
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = `payment-proof-${paymentId}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(objectUrl);
    document.body.removeChild(a);
  },

  async downloadDocument(documentId) {
    const url = `${BASE_URL}/documents/${documentId}/download`;
    const response = await fetch(url, { headers: createHeaders(true) });
    if (!response.ok) throw new Error('Download failed');
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = `document-${documentId}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(objectUrl);
    document.body.removeChild(a);
  },

  // ============================================================================
  // CRUD OPERATIONS
  // ============================================================================

  // Packages CRUD
  async createPackage(data) {
    let options = { method: 'POST', headers: createHeaders(true) };
    // Jika ada file (photo), gunakan FormData
    if (data.photo) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      options.body = formData;
      // Hapus Content-Type agar browser set otomatis
      delete options.headers['Content-Type'];
    } else {
      options.body = JSON.stringify(data);
    }
    return apiCall(ENDPOINTS.PACKAGES, options);
  },

  async updatePackage(id, data) {
    let options = { method: 'POST', headers: createHeaders(true) };
    // Laravel biasanya PATCH/PUT, tapi FormData kadang perlu POST + _method
    if (data.photo) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      formData.append('_method', 'PUT');
      options.body = formData;
      delete options.headers['Content-Type'];
    } else {
      options.method = 'PUT';
      options.body = JSON.stringify(data);
    }
    return apiCall(`${ENDPOINTS.PACKAGES}/${id}`, options);
  },

  async deletePackage(id) {
    return apiCall(`${ENDPOINTS.PACKAGES}/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });
  },

  // Accommodations CRUD
  async getAccommodations(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${BASE_URL}${ENDPOINTS.ACCOMMODATIONS}?${params}`);
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching accommodations:', error);
      throw error;
    }
  },

  async getAccommodation(id) {
    try {
      const response = await fetch(`${BASE_URL}${ENDPOINTS.ACCOMMODATIONS}/${id}`);
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching accommodation:', error);
      throw error;
    }
  },

  async createAccommodation(data) {
    return apiCall(ENDPOINTS.ACCOMMODATIONS, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async updateAccommodation(id, data) {
    return apiCall(`${ENDPOINTS.ACCOMMODATIONS}/${id}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async deleteAccommodation(id) {
    return apiCall(`${ENDPOINTS.ACCOMMODATIONS}/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });
  },

  // Jamaahs CRUD
  async createJamaah(data) {
    return apiCall(ENDPOINTS.JAMAAHS, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async updateJamaah(id, data) {
    return apiCall(`${ENDPOINTS.JAMAAHS}/${id}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async deleteJamaah(id) {
    return apiCall(`${ENDPOINTS.JAMAAHS}/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });
  },

  // Tabungans CRUD
  async createTabungan(data) {
    return apiCall(ENDPOINTS.TABUNGANS, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async updateTabungan(id, data) {
    return apiCall(`${ENDPOINTS.TABUNGANS}/${id}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async deleteTabungan(id) {
    return apiCall(`${ENDPOINTS.TABUNGANS}/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });
  },

  // Documents CRUD
  async createDocument(data) {
    const response = await apiCall(ENDPOINTS.DOCUMENTS, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });

    return response?.data || response;
  },

  async updateDocument(id, data) {
    return apiCall(`${ENDPOINTS.DOCUMENTS}/${id}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async deleteDocument(id) {
    return apiCall(`${ENDPOINTS.DOCUMENTS}/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });
  },

  // Consultations CRUD
  async submitConsultation(data) {
    return apiCall(ENDPOINTS.CONSULTATIONS, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
  },

  async updateConsultation(id, data) {
    return apiCall(`${ENDPOINTS.CONSULTATIONS}/${id}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async deleteConsultation(id) {
    return apiCall(`${ENDPOINTS.CONSULTATIONS}/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });
  },

  async respondToConsultation(id, response) {
    return apiCall(`${ENDPOINTS.CONSULTATIONS}/${id}/respond`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify({ response }),
    });
  },

  async closeConsultation(id) {
    return apiCall(`${ENDPOINTS.CONSULTATIONS}/${id}/close`, {
      method: 'POST',
      headers: createHeaders(true),
    });
  },

  // Payments CRUD
  async createPayment(data) {
    return apiCall(ENDPOINTS.PAYMENTS, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async updatePayment(id, data) {
    return apiCall(`${ENDPOINTS.PAYMENTS}/${id}`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(data),
    });
  },

  async deletePayment(id) {
    return apiCall(`${ENDPOINTS.PAYMENTS}/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });
  },

  // ============================================================================
  // BOOKING & UPLOAD
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

  async uploadPaymentProof(formData) {
    return apiCall('/uploads/payment', {
      method: 'POST',
      headers: createHeaders(true, true),
      body: formData,
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

  async exportStatistics(type = 'jamaah') {
    const url = `${BASE_URL}/statistics/export?type=${type}`;
    const token = getAuthToken();

    const headers = {
      Accept: 'text/csv,*/*',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      headers,
    });
    if (!response.ok) throw new Error('Export failed');

    const blob = await response.blob();
    const disposition = response.headers.get('content-disposition') || '';
    const filenameMatch = disposition.match(/filename\*?=(?:UTF-8''|\")?([^\";]+)/i);
    const filenameFromHeader = filenameMatch?.[1]?.trim();
    const fallbackFilename = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;

    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = decodeURIComponent(filenameFromHeader || fallbackFilename);
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(objectUrl);
    document.body.removeChild(a);

    return blob;
  },

  // Manual deposit by admin
  async manualDeposit({ jamaah_id, amount, note }) {
    return apiCall('/payments', {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify({
        jamaah_id,
        amount,
        note,
        type: 'manual',
      }),
    });
  },
};

export default apiClient;
