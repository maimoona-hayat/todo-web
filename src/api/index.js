import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: BASE_URL,
});

// Add token to every request
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers["x-auth-token"] = token;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

// Auth
export const registerUser = async (formData) => {
  // Use API instance instead of plain axios
  return API.post("/api/v1/user/register", formData);
};

export const loginUser = (data) => API.post("/api/v1/user/login", data);

// Todos
export const getTodos = (page = 1) => API.get(`/api/v1/todo?page=${page}`);
export const createTodo = (data) => API.post("/api/v1/todo", data);
export const updateTodo = (id, data) => API.put(`/api/v1/todo/${id}`, data);
export const deleteTodo = (id) => API.delete(`/api/v1/todo/${id}`);