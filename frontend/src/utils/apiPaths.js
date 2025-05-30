export const BASE_URL = "http://localhost:8000";

// utils/apiPaths.js
export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
    UPDATE_PROFILE: "/api/auth/profile",
  },
  USERS: {
    GET_ALL_USERS: "/api/users",
    DELETE_USER: (id) => `/api/users/${id}`,
  },
  
  IMAGE: {
    UPLOAD_IMAGE: "api/auth/upload-image",
  },
  FEEDBACK: {
    SUBMIT: "/api/feedback/submit", 
  },
};
