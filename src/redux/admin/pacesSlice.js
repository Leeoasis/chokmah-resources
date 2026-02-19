import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

// Upload PACE (admin)
export const uploadPace = createAsyncThunk(
  'paces/upload',
  async (file, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axiosInstance.post('/api/v1/admin/paces/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch PACE list (admin)
export const fetchAdminPaces = createAsyncThunk(
  'paces/fetchAdmin',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/api/v1/admin/paces');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Toggle active
export const togglePaceActive = createAsyncThunk(
  'paces/toggleActive',
  async (paceId, thunkAPI) => {
    try {
      const res = await axiosInstance.patch(`/api/v1/admin/paces/${paceId}/toggle_active`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch results
export const fetchPaceResults = createAsyncThunk(
  'paces/results',
  async (paceId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/api/v1/admin/paces/${paceId}/results`);
      return { paceId, data: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const pacesSlice = createSlice({
  name: 'adminPaces',
  initialState: {
    pacesByGrade: {},
    resultsByPace: {},
    isLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearPaceMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload
      .addCase(uploadPace.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(uploadPace.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload?.message || 'PACE uploaded successfully!';
      })
      .addCase(uploadPace.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      // Fetch list
      .addCase(fetchAdminPaces.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminPaces.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pacesByGrade = action.payload?.paces_by_grade || {};
      })
      .addCase(fetchAdminPaces.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      // Toggle active
      .addCase(togglePaceActive.fulfilled, (state, action) => {
        const updated = action.payload?.pace;
        if (updated) {
          // Find and update in grouped structure
          Object.keys(state.pacesByGrade).forEach(grade => {
            const idx = state.pacesByGrade[grade].findIndex((p) => p.id === updated.id);
            if (idx >= 0) {
              state.pacesByGrade[grade][idx].active = updated.active;
            }
          });
        }
      })
      .addCase(togglePaceActive.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Results
      .addCase(fetchPaceResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPaceResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resultsByPace[action.payload.paceId] = action.payload.data;
      })
      .addCase(fetchPaceResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearPaceMessage } = pacesSlice.actions;
export default pacesSlice.reducer;
