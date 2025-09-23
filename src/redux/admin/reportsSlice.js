import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Upload a report (admin only)
export const uploadReport = createAsyncThunk(
  'reports/upload',
  async (reportData, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://chokmah-resources-backend.onrender.com/api/v1/users/reports',
        reportData,
        {
          headers: {
            'Authorization': `Bearer ${token}`, // ✅ fixed
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
        }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch reports (parent, learner, or admin)
export const fetchReports = createAsyncThunk(
  'reports/fetch',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://chokmah-resources-backend.onrender.com/api/v1/users/reports',
        {
          headers: {
            'Authorization': `Bearer ${token}`, // ✅ fixed
            'Accept': 'application/json',
          },
        }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch learners (admin only)
export const fetchLearners = createAsyncThunk(
  'reports/fetchLearners',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://chokmah-resources-backend.onrender.com/api/v1/users/learners',
        {
          headers: {
            'Authorization': `Bearer ${token}`, // ✅ fixed
            'Accept': 'application/json',
          },
        }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState: {
    reports: [],
    learners: [],
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
    // Upload report
    builder.addCase(uploadReport.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(uploadReport.fulfilled, (state, action) => {
      state.isLoading = false;
      state.successMessage = 'Report uploaded successfully!';
    });
    builder.addCase(uploadReport.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error.message;
    });

    // Fetch reports
    builder.addCase(fetchReports.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchReports.fulfilled, (state, action) => {
      state.isLoading = false;
      state.reports = action.payload;
    });
    builder.addCase(fetchReports.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error.message;
    });

    // Fetch learners
    builder.addCase(fetchLearners.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchLearners.fulfilled, (state, action) => {
      state.isLoading = false;
      state.learners = action.payload;
    });
    builder.addCase(fetchLearners.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error.message;
    });
  },
});

export const { clearSuccessMessage } = reportsSlice.actions;
export default reportsSlice.reducer;
