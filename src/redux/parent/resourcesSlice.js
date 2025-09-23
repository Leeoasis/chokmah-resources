import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/**
 * GET /api/v1/users/resources
 * (parent -> child's resources, learner -> own, admin -> all)
 */
export const fetchResources = createAsyncThunk(
  'resources/fetchResources',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/v1/users/resources', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data || { error: 'Failed to fetch resources' }
      );
    }
  }
);

/**
 * POST /api/v1/users/resources
 * Body: FormData with resource[title], resource[file], resource[learner_id], (optional) resource[description], resource[subject], resource[grade]
 * (admin only)
 */
export const uploadResource = createAsyncThunk(
  'resources/uploadResource',
  async (formData, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/v1/users/resources', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });
      return res.data; // returns the created resource JSON
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data || { error: 'Failed to upload resource' }
      );
    }
  }
);

const resourcesSlice = createSlice({
  name: 'resources',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearResourcesSuccess(state) {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // fetchResources
    builder.addCase(fetchResources.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchResources.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload || [];
    });
    builder.addCase(fetchResources.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error.message;
    });

    // uploadResource
    builder.addCase(uploadResource.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(uploadResource.fulfilled, (state, action) => {
      state.isLoading = false;
      // Optimistically add the new resource to the list
      if (action.payload && typeof action.payload === 'object') {
        state.items = [action.payload, ...state.items];
      }
      state.successMessage = 'Resource uploaded successfully!';
    });
    builder.addCase(uploadResource.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || action.error.message;
    });
  },
});

export const { clearResourcesSuccess } = resourcesSlice.actions;
export default resourcesSlice.reducer;
