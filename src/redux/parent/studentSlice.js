import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { notifySuccess, notifyError } from '../../utils/NotificationSystem';

export const fetchStudentById = createAsyncThunk(
  'student/fetchStudentById',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/students/${studentId}`);
      return response.data;
    } catch (err) {
      notifyError("Failed to fetch student data.");
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    student: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetStudent: (state) => {
      state.student = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.student = action.payload;
        state.loading = false;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetStudent } = studentSlice.actions;
export default studentSlice.reducer;
