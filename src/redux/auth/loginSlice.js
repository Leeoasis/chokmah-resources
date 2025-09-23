import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk(
  'login/loginUser',
  async (userCredentials) => {
    const url = 'https://chokmah-resources-backend.onrender.com/api/v1/users/login';
    const response = await axios.post(url, userCredentials, {
      headers: { Accept: 'application/json' },
    });

    const authHeader =
      response.headers['authorization'] || response.headers['Authorization'];
    const token = authHeader?.split(' ')[1] || response.data?.token;

    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    localStorage.setItem('user', JSON.stringify(response.data.data));
    return response.data.data;
  }
);

const initialState = { user: {}, error: null, isLoading: false };

const loginSlice = createSlice({
  name: 'login',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
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

export default loginSlice.reducer;
