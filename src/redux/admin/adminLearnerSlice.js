import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../redux/api/axiosInstance';

// =====================================================
// FETCH ALL TEACHERS
// =====================================================
export const fetchTeachers = createAsyncThunk(
  'adminLearners/fetchTeachers',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/api/v1/users/teachers');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

// =====================================================
// FETCH ALL LEARNERS
// =====================================================
export const fetchLearners = createAsyncThunk(
  'adminLearners/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/api/v1/users/learners');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message
      );
    }
  }
);

// =====================================================
// UPDATE LEARNER
// =====================================================
export const updateLearner = createAsyncThunk(
  'adminLearners/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(
        `/api/v1/users/learners/${id}`,
        { learner: data }
      );
      return res.data.learner;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || 'Update failed'
      );
    }
  }
);

// =====================================================
// DELETE LEARNER
// =====================================================
export const deleteLearner = createAsyncThunk(
  'adminLearners/delete',
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/api/v1/users/learners/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || 'Delete failed'
      );
    }
  }
);

// =====================================================
// SLICE
// =====================================================
const adminLearnerSlice = createSlice({
  name: 'adminLearners',
  initialState: {
    learners: [],
    teachers: [],
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
      // FETCH
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

      // UPDATE
      .addCase(updateLearner.fulfilled, (state, action) => {
        state.learners = state.learners.map((learner) =>
          learner.id === action.payload.id ? action.payload : learner
        );
        state.successMessage = 'Learner updated successfully!';
      })

      // DELETE
      .addCase(deleteLearner.fulfilled, (state, action) => {
        state.learners = state.learners.filter(
          (learner) => learner.id !== action.payload
        );
        state.successMessage = 'Learner deleted successfully!';
      })

      // FETCH TEACHERS
      .addCase(fetchTeachers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teachers = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSuccessMessage } = adminLearnerSlice.actions;
export default adminLearnerSlice.reducer;
