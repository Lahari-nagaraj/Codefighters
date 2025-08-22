const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async registerUser(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUserProfile(uid) {
    return this.request(`/auth/profile/${uid}`);
  }

  async updateUserProfile(uid, userData) {
    return this.request(`/auth/profile/${uid}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Crop endpoints
  async getCrops(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/crops?${params}`);
  }

  async getCrop(id) {
    return this.request(`/crops/${id}`);
  }

  async addCrop(cropData) {
    return this.request('/crops', {
      method: 'POST',
      body: JSON.stringify(cropData),
    });
  }

  async updateCrop(id, cropData) {
    return this.request(`/crops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cropData),
    });
  }

  async deleteCrop(id) {
    return this.request(`/crops/${id}`, {
      method: 'DELETE',
    });
  }

  async getFarmerCrops(farmerId) {
    return this.request(`/crops/farmer/${farmerId}`);
  }

  // Equipment endpoints
  async getEquipment(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/equipment?${params}`);
  }

  async addEquipment(equipmentData) {
    return this.request('/equipment', {
      method: 'POST',
      body: JSON.stringify(equipmentData),
    });
  }

  async rentEquipment(equipmentId, rentalData) {
    return this.request(`/equipment/${equipmentId}/rent`, {
      method: 'POST',
      body: JSON.stringify(rentalData),
    });
  }

  // Auction endpoints
  async getAuctions(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/auctions?${params}`);
  }

  async createAuction(auctionData) {
    return this.request('/auctions', {
      method: 'POST',
      body: JSON.stringify(auctionData),
    });
  }

  async placeBid(auctionId, bidData) {
    return this.request(`/auctions/${auctionId}/bid`, {
      method: 'POST',
      body: JSON.stringify(bidData),
    });
  }

  // Pricing endpoints
  async getMSP(crop = null) {
    return this.request(`/pricing/msp${crop ? `?crop=${crop}` : ''}`);
  }

  async getCropTrends(crop, period = '7d') {
    return this.request(`/pricing/trends/${crop}?period=${period}`);
  }

  async getWeather(location = '') {
    return this.request(`/pricing/weather${location ? `?location=${location}` : ''}`);
  }

  // Scheme endpoints
  async getSchemes() {
    return this.request('/schemes');
  }

  async addScheme(schemeData) {
    return this.request('/schemes', {
      method: 'POST',
      body: JSON.stringify(schemeData),
    });
  }

  async updateScheme(id, schemeData) {
    return this.request(`/schemes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(schemeData),
    });
  }

  // Gamification endpoints
  async getGamificationProfile(userId) {
    return this.request(`/gamification/profile/${userId}`);
  }

  async awardPoints(userId, action, points) {
    return this.request('/gamification/award-points', {
      method: 'POST',
      body: JSON.stringify({ userId, action, points }),
    });
  }

  async redeemItem(userId, itemId, cost) {
    return this.request('/gamification/redeem', {
      method: 'POST',
      body: JSON.stringify({ userId, itemId, cost }),
    });
  }

  async getShopItems() {
    return this.request('/gamification/shop');
  }

  // Chatbot endpoints
  async sendChatMessage(userId, message, language = 'en') {
    return this.request('/chatbot/chat', {
      method: 'POST',
      body: JSON.stringify({ userId, message, language }),
    });
  }

  async getChatHistory(userId, limit = 20) {
    return this.request(`/chatbot/history/${userId}?limitCount=${limit}`);
  }

  // Payment endpoints
  async createRazorpayOrder(amount, cropId, buyerId) {
    return this.request('/payments/razorpay/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount, cropId, buyerId }),
    });
  }

  async verifyRazorpayPayment(paymentData) {
    return this.request('/payments/razorpay/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async createStripePaymentIntent(amount, cropId, buyerId) {
    return this.request('/payments/stripe/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ amount, cropId, buyerId }),
    });
  }

  // Upload endpoints
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    return this.request('/upload/image', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  }

  async uploadImages(files) {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('images', file);
    });

    return this.request('/upload/images', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  }
}

export default new ApiService();