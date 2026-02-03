import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../redux/api/axiosInstance';

/**
 * GET /api/v1/users/resources
 * (parent -> child's resources, learner -> own, admin -> all)
 */
export const fetchResources = createAsyncThunk(
  'resources/fetchResources',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/api/v1/users/resources');
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
 * Body: FormData with
 * resource[title], resource[file], resource[teacher_id],
 * (optional) resource[description], resource[subject], resource[grade]
 * (admin only)
 */
export const uploadResource = createAsyncThunk(
  'resources/uploadResource',
  async (formData, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        '/api/v1/users/resources',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return res.data; // created resource JSON
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
    // ==============================
    // FETCH RESOURCES
    // ==============================
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

    // ==============================
    // UPLOAD RESOURCE
    // ==============================
    builder.addCase(uploadResource.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(uploadResource.fulfilled, (state, action) => {
      state.isLoading = false;

      // Optimistically prepend new resource
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
