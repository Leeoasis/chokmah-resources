import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

// Fetch children (parent/learner)
export const fetchLearnerChildren = createAsyncThunk(
  'learnerPaces/children',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/api/v1/learners/children');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch PACE list (learner/parent)
export const fetchLearnerPaces = createAsyncThunk(
  'learnerPaces/fetch',
  async (learnerId, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/api/v1/learners/paces', {
        params: learnerId ? { learner_id: learnerId } : undefined,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Start PACE attempt
export const startPaceAttempt = createAsyncThunk(
  'learnerPaces/start',
  async ({ paceId, learnerId }, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/api/v1/learners/paces/${paceId}/start`, {
        learner_id: learnerId,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Submit PACE attempt
export const submitPaceAttempt = createAsyncThunk(
  'learnerPaces/submit',
  async ({ paceId, answers, learnerId }, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`/api/v1/learners/paces/${paceId}/submit`, {
        answers,
        learner_id: learnerId,
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const pacesSlice = createSlice({
  name: 'learnerPaces',
  initialState: {
    paces: [],
    children: [],
    selectedLearnerId: null,
    activeAttempt: null,
    activePace: null,
    questions: [],
    results: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    resetActivePace: (state) => {
      state.activeAttempt = null;
      state.activePace = null;
      state.questions = [];
      state.results = null;
    },
    setSelectedLearner: (state, action) => {
      state.selectedLearnerId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch children
      .addCase(fetchLearnerChildren.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLearnerChildren.fulfilled, (state, action) => {
        state.isLoading = false;
        state.children = action.payload?.children || [];
        if (!state.selectedLearnerId && state.children.length > 0) {
          state.selectedLearnerId = state.children[0].id;
        }
      })
      .addCase(fetchLearnerChildren.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      // Fetch list
      .addCase(fetchLearnerPaces.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLearnerPaces.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paces = action.payload?.paces || [];
      })
      .addCase(fetchLearnerPaces.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      // Start
      .addCase(startPaceAttempt.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.results = null;
      })
      .addCase(startPaceAttempt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeAttempt = action.payload?.attempt || null;
        state.activePace = action.payload?.pace || null;
        state.questions = action.payload?.questions || [];
      })
      .addCase(startPaceAttempt.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })

      // Submit
      .addCase(submitPaceAttempt.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitPaceAttempt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload || null;
      })
      .addCase(submitPaceAttempt.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetActivePace, setSelectedLearner } = pacesSlice.actions;
export default pacesSlice.reducer;
