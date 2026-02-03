import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../redux/api/axiosInstance';

export const fetchreg = createAsyncThunk(
  'sign_up/fetchregistration',
  async (userFormData) => {
    const response = await axiosInstance.post(
      '/api/v1/users',
      userFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const authHeader =
      response.headers['authorization'] || response.headers['Authorization'];

    const token = authHeader?.split(' ')[1] || response.data?.token;

    if (token) {
      localStorage.setItem('token', token);
    }

    localStorage.setItem('user', JSON.stringify(response.data.data));
    return response.data.data;
  }
);

const initialState = {
  sign_up: {},
  error: null,
  isLoading: false,
};

const registrationSlice = createSlice({
  name: 'sign_up',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchreg.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchreg.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sign_up = action.payload;
      })
      .addCase(fetchreg.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default registrationSlice.reducer;
