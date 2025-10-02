import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'https://chokmah-resources-backend.onrender.com/api/v1';

// Fetch all learners
export const fetchLearners = createAsyncThunk(
  'adminLearners/fetchAll',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/users/learners`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update learner
export const updateLearner = createAsyncThunk(
  'adminLearners/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `${API_BASE}/users/learners/${id}`,
        { learner: data },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.learner;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.errors || 'Update failed');
    }
  }
);

// Delete learner
export const deleteLearner = createAsyncThunk(
  'adminLearners/delete',
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/users/learners/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.errors || 'Delete failed');
    }
  }
);

const adminLearnerSlice = createSlice({
  name: 'adminLearners',
  initialState: {
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
    builder
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
        state.error = action.payload || action.error.message;
      })
      .addCase(updateLearner.fulfilled, (state, action) => {
        state.learners = state.learners.map((l) =>
          l.id === action.payload.id ? action.payload : l
        );
        state.successMessage = 'Learner updated successfully!';
      })
      .addCase(deleteLearner.fulfilled, (state, action) => {
        state.learners = state.learners.filter((l) => l.id !== action.payload);
        state.successMessage = 'Learner deleted successfully!';
      });
  },
});

export const { clearSuccessMessage } = adminLearnerSlice.actions;
export default adminLearnerSlice.reducer;
