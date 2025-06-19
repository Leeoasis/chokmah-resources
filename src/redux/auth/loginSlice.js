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

    localStorage.setItem('token', response.headers['Authorization']);
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
