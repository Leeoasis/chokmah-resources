import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../redux/api/axiosInstance';

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    try {
      await axiosInstance.delete('/api/v1/users/logout');
    } catch (err) {
      // Logout should NEVER block client-side cleanup
      console.error('Logout error:', err);
    }

    // Always clear client-side state
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    return true;
  }
);

const initialState = {
  isLoggingOut: false,
};

const logoutSlice = createSlice({
  name: 'logout',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoggingOut = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggingOut = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoggingOut = false;
      });
  },
});

export default logoutSlice.reducer;
