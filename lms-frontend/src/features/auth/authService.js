// src/features/auth/authService.js
import axiosInstance from "../../api/axios";
import { setTokenStorage, clearStorage } from "../../utils/tokenUtils";

// ── Login ─────────────────────────────────────────────────────────────────
const login = async ({ email, password }) => {
  const { data } = await axiosInstance.post("/auth/login", { email, password });

  // NestJS returns: { message, user: { id, firstName, email, role }, access_token }
  const token = data.access_token;
  const user  = {
    ...data.user,
    // Normalize: backend sends "firstName", frontend uses "name"
    name: data.user.firstName,
    // Normalize: backend sends "student", frontend expects "Student"
    role: capitalize(data.user.role),
  };

  if (!token) throw new Error("No token received from server");

  setTokenStorage(token, user);
  return { ...user, token };
};

// ── Register ──────────────────────────────────────────────────────────────
const register = async ({ name, email, password, role }) => {
  const { data } = await axiosInstance.post("/auth/register", {
    firstName: name,           // frontend "name" → backend "firstName"
    email,
    password,
    role: role.toLowerCase(),  // frontend "Student" → backend "student"
  });

  return data; // { message: "Registration successful", user: {...}, access_token }
};

// ── Logout ────────────────────────────────────────────────────────────────
const logout = () => clearStorage();

// ── Helper ────────────────────────────────────────────────────────────────
const capitalize = (str = "") =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export default { login, register, logout };