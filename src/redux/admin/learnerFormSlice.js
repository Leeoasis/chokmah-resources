import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createLearner = createAsyncThunk(
  'learners/create',
  async (learnerData, thunkAPI) => {
    try {
      const response = await axios.post(
        'https://chokmah-resources-backend.onrender.com/api/v1/users/learners',
        { learner: learnerData }
      );
      return response.data;
    } catch (err) {
      // ✅ Pass Rails validation errors back
      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || ["Something went wrong"]
      );
    }
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
        // ✅ Correct path: token is inside action.payload.learner
        state.invitationToken = action.payload.learner?.invitation_token || '';
      })
      .addCase(createLearner.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // ✅ Rails validation errors
        state.success = false;
      });
  },
});

export const { clearLearnerState } = learnerSlice.actions;
export default learnerSlice.reducer;
