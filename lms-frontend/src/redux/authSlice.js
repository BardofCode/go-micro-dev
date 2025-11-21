import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";  // Axios interceptor
import jwtDecode from "jwt-decode";

const tokenFromStorage = localStorage.getItem("token");

export const loginUser = createAsyncThunk("auth/login", async (formData, thunkAPI) => {
  try {
    const res = await api.post("/auth/login", formData);
    return res.data.access_token;
  } catch (err) {
    return thunkAPI.rejectWithValue("Login failed");
  }
});

export const registerUser = createAsyncThunk("auth/register", async (formData, thunkAPI) => {
  try {
    await api.post("/auth/register", formData);
    return true;
  } catch {
    return thunkAPI.rejectWithValue("Register failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: tokenFromStorage || null,
    user: tokenFromStorage ? jwtDecode(tokenFromStorage) : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        state.user = jwtDecode(action.payload);
        localStorage.setItem("token", action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
