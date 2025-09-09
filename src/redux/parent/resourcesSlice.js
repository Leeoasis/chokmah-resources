import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ GET all resources (role-based filtering happens server-side)
export const fetchResources = createAsyncThunk(
  "resources/fetchResources",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/v1/users/resources");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to fetch resources");
    }
  }
);

// ✅ POST upload resource (admin only)
export const uploadResource = createAsyncThunk(
  "resources/uploadResource",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/users/resources", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data; // backend returns full resource JSON
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to upload resource");
    }
  }
);

const resourcesSlice = createSlice({
  name: "resources",
  initialState: {
    resources: [],
    isLoading: false,
    error: null,
    success: false,          // ✅ add success flag
    successMessage: null,
  },
  reducers: {
    clearResourceMessages: (state) => {
      state.successMessage = null;
      state.error = null;
      state.success = false; // ✅ reset success flag
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch resources
      .addCase(fetchResources.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resources = action.payload;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Upload resource
      .addCase(uploadResource.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(uploadResource.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resources.push(action.payload);
        state.success = true; // ✅ mark success
        state.successMessage = "Resource uploaded successfully!";
      })
      .addCase(uploadResource.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearResourceMessages } = resourcesSlice.actions;
export default resourcesSlice.reducer;
