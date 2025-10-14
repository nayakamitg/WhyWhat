import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getCategories = createAsyncThunk(
  "other/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("https://api.dishaayein.com/api/Niches");
      return res.data;
    } catch (err) {
      console.error("Error fetching categories:", err);
      return rejectWithValue(
        "Failed to fetch categories"
      );
    }
  }
);

const otherSlice = createSlice({
  name: "other",
  initialState: {
    loading: false,
    error: null,
    categories: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default otherSlice.reducer;
