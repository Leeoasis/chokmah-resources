import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete('http://localhost:3000/api/v1/users/logout', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.error('Logout error:', err);
  }

  // Always clear client-side state
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];

  return true;
});

const logoutSlice = createSlice({
  name: 'logout',
  initialState: { isLoggingOut: false },
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
