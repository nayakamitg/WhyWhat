import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

// Fetch posts dynamically at runtime
export const fetchPosts = createAsyncThunk(
  "post/fetchPosts",
  async (filter, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      if (filter?.search) {
        params.append("QuestionText", filter.search);
      }

      if (filter?.nicheId) {
        params.append("NicheId", filter.nicheId);
      }

      const url = `${import.meta.env.VITE_API_BASE_URL}/QA/filter?${
        params.toString()
      }`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Network not available");

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue("Network not available");
    }
  }
);


export const addPost = createAsyncThunk(
  "post/addPosts",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Log the incoming data
      console.log('Request Data:', { id, data });

      if (!data.questionText || !data.description || !data.nicheId) {
        const missingFields = [];
        if (!data.questionText) missingFields.push('questionText');
        if (!data.description) missingFields.push('description');
        if (!data.nicheId) missingFields.push('nicheId');
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const formattedData = {
        questionText: data.questionText.trim(),
        description: data.description.trim(),
        nicheId: Number(data.nicheId),
        askTo: Number(data.askTo || 0),
        language: data.language || "English"
      };

      // Log the formatted data
      console.log('Formatted Data:', formattedData);
      console.log('API URL:', `${import.meta.env.VITE_API_BASE_URL}/Questions`);
      console.log('Headers:', {
        'Accept': "application/json",
        "Content-Type": "application/json",
        "X-User-Id": id?.toString()
      });

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/Questions`,
        formattedData,
        {
          headers: {
            'Accept': "application/json",
            "Content-Type": "application/json",
            "X-User-Id": parseInt(id)
          },
        }
      );

      // Log successful response
      console.log('API Response:', res.data);

      if (res.status === 200 || res.status === 201) {
        toast.success("Post successfully created");
        return res.data;
      } else {
        throw new Error(`Unexpected response status: ${res.status}`);
      }
    } catch (err) {
      // Log detailed error information
      console.error('API Error:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });

      const errorMsg = 
                      "Failed to add post";

      return rejectWithValue({
        message: errorMsg,
        details: err.response?.data
      });
    }
  }
);


export const addAnswer = createAsyncThunk(
  "post/addAnswer",
  async ({ id, data }, { rejectWithValue }) => {
    try {

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/Answers`,
        data,
        {
          headers: {
            'Accept': "application/json",
            "Content-Type": "application/json",
            "X-User-Id": parseInt(id)
          },
        }
      );

      // Log successful response
      console.log('API Response:', res.data);

      if (res.status === 200 || res.status === 201) {
        return res.data;
      } else {
        throw new Error(`Unexpected response status: ${res.status}`);
      }
    } catch (err) {
      // Log detailed error information
      console.error('API Error:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message
      });

      const errorMsg =
                      "Failed to add answer";

      return rejectWithValue({
        message: errorMsg,
        details: err.response?.data
      });
    }
  }
);



const postSlice = createSlice({
  name: "post",
  initialState: {
    loading: false,
    error: null,
    posts: [],
    isPosting: false,
  },
  reducers: {
   
    addStory: (state, action) => {
      const { postId, story } = action.payload;
      const postIndex = state.posts.findIndex((p) => p.id == postId);
      if (postIndex >= 0) {
        const post = state.posts[postIndex];
        if (!Array.isArray(post.stories)) post.stories = [];
        post.stories = [story, ...post.stories];
        state.posts[postIndex] = { ...post, stories: post.stories };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
    builder
      .addCase(addPost.pending, (state) => {
        state.isPosting = true;
        state.error = null;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.isPosting = false;
        state.posts = [action.payload, ...state.posts];
      })
      .addCase(addPost.rejected, (state, action) => {
        state.isPosting = false;
        state.error = action.error.message;
      });

    builder
      .addCase(addAnswer.pending, (state) => {
        state.isPosting = true;
        state.error = null;
      })
      .addCase(addAnswer.fulfilled, (state, action) => {
        state.isPosting = false;
        
      })
      .addCase(addAnswer.rejected, (state, action) => {
        state.isPosting = false;
        state.error = action.error.message;
      });
  },
});

export const { addStory } = postSlice.actions;
export default postSlice.reducer;

