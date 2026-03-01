import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: BASE_URL,
});

// Request Interceptor
instance.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers["x-auth-token"] = token;
    }

    return req;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  },
);

// Response Interceptor
instance.interceptors.response.use(
  (response) => response,

  (error) => {
    console.error("Response error:", error);

    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

// Auth
export const registerUser = (formData) =>
  instance.post("/api/v1/user/register", formData);

export const loginUser = (data) => instance.post("/api/v1/user/login", data);

// Todos
export const getTodos = () => instance.get(`/api/v1/todo`);

export const createTodo = (data) => instance.post("/api/v1/todo", data);

export const updateTodo = (id, data) =>
  instance.put(`/api/v1/todo/${id}`, data);

export const deleteTodo = (id) => instance.delete(`/api/v1/todo/${id}`);
