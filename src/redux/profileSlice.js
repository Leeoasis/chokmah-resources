import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../redux/api/axiosInstance';

/**
 * GET /api/v1/users/profile
 * Expecting JSON with name fields, role, email, etc.
 * Authorization header is injected automatically by axiosInstance
 */
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/api/v1/users/profile');
      return res.data; // { parent_name, child_name, role, email, ... }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data || { error: 'Failed to fetch profile' }
      );
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearProfileError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload || null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error?.message;
      });
  },
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
