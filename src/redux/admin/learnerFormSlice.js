import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createLearner = createAsyncThunk(
  'learners/create',
  async (learnerData, thunkAPI) => {
    const response = await axios.post('https://chokmah-resources-backend.onrender.com/api/v1/users/learners', {
      learner: {
        ...learnerData,
        role: 'learner',
        password: Math.random().toString(36).slice(-8),
        password_confirmation: Math.random().toString(36).slice(-8),
      },
    });
    return response.data;
  }
);


const learnerSlice = createSlice({
  name: 'learners',
  initialState: {
    invitationToken: '',
    isLoading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearLearnerState: (state) => {
      state.invitationToken = '';
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLearner.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createLearner.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.invitationToken = action.payload.invitation_token;
      })
      .addCase(createLearner.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        state.success = false;
      });
  },
});

export const { clearLearnerState } = learnerSlice.actions;
export default learnerSlice.reducer;
