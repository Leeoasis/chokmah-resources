import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from './api/axiosInstance';

export const fetchMyLearners = createAsyncThunk(
  'teacher/fetchMyLearners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/users/teachers/my_learners');
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

export const fetchLearnerDetails = createAsyncThunk(
  'teacher/fetchLearnerDetails',
  async (learnerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/users/learners/${learnerId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

const teacherSlice = createSlice({
  name: 'teacher',
  initialState: {
    learners: [],
    selectedLearner: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedLearner: (state) => {
      state.selectedLearner = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyLearners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyLearners.fulfilled, (state, action) => {
        state.learners = action.payload;
        state.loading = false;
      })
      .addCase(fetchMyLearners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLearnerDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLearnerDetails.fulfilled, (state, action) => {
        state.selectedLearner = action.payload;
        state.loading = false;
      })
      .addCase(fetchLearnerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedLearner } = teacherSlice.actions;
export default teacherSlice.reducer;