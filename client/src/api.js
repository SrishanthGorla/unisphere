import axios from "axios";

const localHosts = ["localhost", "127.0.0.1", "::1", "0.0.0.0"];
const defaultApiUrl = typeof window !== "undefined" && localHosts.includes(window.location.hostname)
  ? "http://localhost:5000/api"
  : "/api";
const baseURL = import.meta.env.VITE_API_URL || defaultApiUrl;
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000 // 10 second timeout
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection and try again.');
    }

    if (!error.response) {
      throw new Error('Network error. Please check your internet connection.');
    }

    const { status, data } = error.response;

    switch (status) {
      case 400:
        throw new Error(data.message || 'Bad request. Please check your input.');
      case 401:
        localStorage.removeItem("currentUser");
        localStorage.removeItem("token");
        window.location.reload(); // Redirect to login
        throw new Error('Session expired. Please login again.');
      case 403:
        throw new Error('Access denied. You do not have permission to perform this action.');
      case 404:
        throw new Error('Resource not found.');
      case 409:
        throw new Error('Conflict: This action cannot be completed at this time.');
      case 422:
        throw new Error('Validation error. Please check your input.');
      case 429:
        throw new Error('Too many requests. Please wait a moment and try again.');
      case 500:
        throw new Error('Server error. Please try again later.');
      default:
        throw new Error(data.message || `An error occurred (${status}). Please try again.`);
    }
  }
);

// Wrapper function for API calls with loading state
export const apiCall = async (apiFunction, setLoading, setError) => {
  try {
    if (setLoading) setLoading(true);
    if (setError) setError(null);

    const result = await apiFunction();

    if (setLoading) setLoading(false);
    return result;
  } catch (error) {
    if (setLoading) setLoading(false);
    if (setError) setError(error.message);

    // Re-throw for component-level error handling
    throw error;
  }
};

export const registerUser = (payload) => api.post("/auth/register", payload);
export const loginUser = (payload) => api.post("/auth/login", payload);
export const fetchCurrentUser = (id) => api.get(`/auth/me/${id}`);
export const updateProfile = (id, payload) => api.put(`/auth/profile/${id}`, payload);
export const fetchEvents = () => api.get("/events");
export const addEvent = (payload) => api.post("/events/create", payload);
export const updateEvent = (id, payload) => api.put(`/events/${id}`, payload);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const registerEvent = (payload) => api.post("/registrations", payload);
export const fetchRegistrations = (userId) => api.get(`/registrations/my/${userId}`);
export const fetchAllRegistrations = () => api.get("/registrations");
export const fetchUsers = () => api.get("/users");
export const blockUser = (id) => api.put(`/users/block/${id}`);
export const unblockUser = (id) => api.put(`/users/unblock/${id}`);
export const rateEvent = (registrationId, rating, review) =>
  api.post(`/registrations/rate/${registrationId}`, { rating, review });

// Payment related API functions
export const createPaymentSession = (payload) => api.post("/payments/create-session", payload);
export const processPayment = (payload) => api.post("/payments/process", payload);
export const getPaymentDetails = (transactionId) => api.get(`/payments/${transactionId}`);
export const getUserPayments = (userId) => api.get(`/payments/user/${userId}`);
export const refundPayment = (transactionId, reason) => api.post(`/payments/refund/${transactionId}`, { reason });
export const getPaymentStats = () => api.get("/payments/stats/overview");
