import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk(
  'login/loginUser',
  async (userCredentials) => {
    const url = '/api/v1/users/login';
    const response = await axios.post(url, userCredentials, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Safely store the token only if it exists and is a reasonable size
    const authHeader =
      response.headers['authorization'] || response.headers['Authorization'];
    if (authHeader && typeof authHeader === 'string' && authHeader.length < 1000) {
      localStorage.setItem('token', authHeader);
    } else {
      localStorage.removeItem('token');
    }
    localStorage.setItem('user', JSON.stringify(response.data.data));
    return response.data.data;
  }
);

const initialState = {
  user: {},
  error: undefined,
  isLoading: false,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export default loginSlice.reducer;