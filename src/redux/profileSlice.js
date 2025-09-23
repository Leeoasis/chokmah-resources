import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/**
 * GET /api/v1/users/profile
 * Expecting JSON with name fields, role, email, etc.
 * Sends Authorization: Bearer <token>
 */
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://chokmah-resources-backend.onrender.com/api/v1/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
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
    builder.addCase(fetchProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload || null;
    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error?.message;
    });
  },
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
