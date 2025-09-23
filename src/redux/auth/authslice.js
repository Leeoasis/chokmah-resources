import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userCredentials) => {
    const url = 'https://chokmah-resources-backend.onrender.com/api/v1/users/login';
    const response = await axios.post(url, userCredentials, {
      headers: { Accept: 'application/json' },
    });

    // Extract token from header
    const authHeader =
      response.headers['authorization'] || response.headers['Authorization'];
    const token = authHeader?.split(' ')[1] || response.data?.token;

    if (token) {
      localStorage.setItem('token', token); // ✅ store raw token only
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    localStorage.setItem('user', JSON.stringify(response.data.data));
    return response.data.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: {}, isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default authSlice.reducer;
