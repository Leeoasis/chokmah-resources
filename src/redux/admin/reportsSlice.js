import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const uploadReport = createAsyncThunk(
  'reports/upload',
  async (reportData, thunkAPI) => {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:3000/api/v1/users/reports', reportData, {
      headers: {
        'Authorization': token,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

export const fetchLearners = createAsyncThunk(
  'reports/fetchLearners',
  async (_, thunkAPI) => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/api/v1/users/learners', {
      headers: { Authorization: token }
    });
    return response.data;
  }
);

export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async (_, thunkAPI) => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/api/v1/users/reports', {
      headers: { Authorization: token }
    });
    return response.data;
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState: {
    learners: [],
    reports: [],
    isLoading: false,
    success: false,
    error: null,
  },
  reducers: {
    clearReportState: (state) => {
      state.isLoading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadReport.pending, (state) => {
        state.isLoading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(uploadReport.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(uploadReport.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.error.message;
      })

      .addCase(fetchLearners.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLearners.fulfilled, (state, action) => {
        state.isLoading = false;
        state.learners = action.payload;
      })
      .addCase(fetchLearners.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
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
        state.error = action.error.message;
      });
  },
});

export const { clearReportState } = reportsSlice.actions;
export default reportsSlice.reducer;
