// src/features/auth/authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import authService from "./authService";
import { clearStorage, getStoredToken, getStoredUser } from "../../utils/tokenUtils";

// ── Login ─────────────────────────────────────────────────────────────────
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      return await authService.login({ email, password });
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      return thunkAPI.rejectWithValue({ message: msg });
    }
  }
);

// ── Register ──────────────────────────────────────────────────────────────
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Registration failed.";
      return thunkAPI.rejectWithValue({ message: msg });
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading:         false,
    user:            getStoredUser(),
    userToken:       getStoredToken(),
    isAuthenticated: !!getStoredToken(), // ✅ FIX: reads from localStorage so back button is blocked
    error:           null,
    registerSuccess: false,
  },
  reducers: {
    logout(state) {
      authService.logout();
      state.user            = null;
      state.userToken       = null;
      state.isAuthenticated = false;
      state.error           = null;
    },
    clearError(state) {
      state.error = null;
    },
    clearRegisterSuccess(state) {
      state.registerSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Login ────────────────────────────────────────────────────────
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading         = false;
        state.isAuthenticated = true;
        state.user            = payload;
        state.userToken       = payload.token;
        state.error           = null;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading         = false;
        state.isAuthenticated = false;
        state.user            = null;
        state.userToken       = null;
        state.error           = payload?.message || "Login failed";
        message.error({ content: payload?.message || "Login failed.", duration: 4 });
      })

      // ── Register ─────────────────────────────────────────────────────
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading         = false;
        state.registerSuccess = true;
        message.success("Account created! Please login.");
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error   = payload?.message || "Registration failed";
        message.error({ content: payload?.message || "Registration failed.", duration: 4 });
      });
  },
});

export const { logout, clearError, clearRegisterSuccess } = authSlice.actions;
export default authSlice.reducer;