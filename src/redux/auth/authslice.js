import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../redux/api/axiosInstance';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userCredentials) => {
    const response = await axiosInstance.post(
      '/api/v1/users/login',
      userCredentials
    );

    // Extract token from header or body
    const authHeader =
      response.headers['authorization'] || response.headers['Authorization'];

    const token = authHeader?.split(' ')[1] || response.data?.token;

    if (token) {
      localStorage.setItem('token', token); // store raw token only
    }

    localStorage.setItem('user', JSON.stringify(response.data.data));
    return response.data.data;
  }
);

const initialState = {
  user: {},
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
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
