import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'https://chokmah-resources-backend.onrender.com/api/v1';

// Upload report
export const uploadReport = createAsyncThunk(
  'reports/upload',
  async (formData, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE}/users/reports`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch reports
export const fetchReports = createAsyncThunk(
  'reports/fetch',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/users/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState: {
    reports: [],
    isLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadReport.fulfilled, (state) => {
        state.isLoading = false;
        state.successMessage = 'Report uploaded successfully!';
      })
      .addCase(uploadReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearSuccessMessage } = reportsSlice.actions;
export default reportsSlice.reducer;
