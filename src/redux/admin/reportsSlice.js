import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../redux/api/axiosInstance';

// =====================================================
// UPLOAD REPORT
// =====================================================
export const uploadReport = createAsyncThunk(
  'reports/upload',
  async (formData, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        '/api/v1/users/reports',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

// =====================================================
// FETCH REPORTS
// =====================================================
export const fetchReports = createAsyncThunk(
  'reports/fetch',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/api/v1/users/reports');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

// =====================================================
// SLICE
// =====================================================
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
      // UPLOAD
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

      // FETCH
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
