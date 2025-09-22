import { createSlice } from "@reduxjs/toolkit";
import { posts } from "../../posts";

const postSlice = createSlice({
  name: "post",
  initialState: {
    loading: false,
    error: null,
    posts: [],
  },
  reducers: {
    fetchPostsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPostsSuccess: (state, action) => {
      state.loading = false;
      state.posts = posts;
      state.error = null;
    },
    fetchPostsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ✅ add new post
    addPost: (state, action) => {
      state.posts = [action.payload, ...state.posts];
    },


    addStory: (state, action) => {
      const { postId, story } = action.payload;

      const postIndex = state.posts.findIndex((p) => p.id == postId);
      console.log("Slice Story",story)
      console.log("Post Index",postIndex)
      if (postIndex >= 0) {
        const post = state.posts[postIndex];
        // agar stories property missing hai to empty array set karo
        if (!Array.isArray(post.stories)) {
          post.stories = [];
        }

        // naya story sabse pehle daal do
        post.stories = [story, ...post.stories];

        // update karo post ko wapas
        state.posts[postIndex] = {
          ...post,
          stories: post.stories,
        };
      }
    },
  },
});

export const {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  addPost,
  addStory,
} = postSlice.actions;

export default postSlice.reducer;
