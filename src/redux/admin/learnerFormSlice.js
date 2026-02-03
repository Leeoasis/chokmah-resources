import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../redux/api/axiosInstance';

export const createLearner = createAsyncThunk(
  'learners/create',
  async (learnerData, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        '/api/v1/users/learners',
        { learner: learnerData }
      );
      return response.data;
    } catch (err) {
      // ✅ Pass Rails validation errors back cleanly
      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || ['Something went wrong']
      );
    }
  }
);

const initialState = {
  invitationToken: '',
  isLoading: false,
  error: null,
  success: false,
};

const learnerSlice = createSlice({
  name: 'learners',
  initialState,
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
        // ✅ Correct path: token is nested under learner
        state.invitationToken =
          action.payload.learner?.invitation_token || '';
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
