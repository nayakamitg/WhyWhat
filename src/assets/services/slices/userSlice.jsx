import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

// Async thunks
export const createUser = createAsyncThunk(
  "user/createUser",
  async ({ data }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/Users`,
        data
      );
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      console.log(error);
      return rejectWithValue(msg);
    }
  }
);



export const login = createAsyncThunk(
  "user/login",
  async ({ handle, googleData }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/Users/${handle}`
      );

      // User exists, save to localStorage
      localStorage.setItem("userData", JSON.stringify(res.data));
      return res.data;
    } catch (error) {
      // User doesn't exist, create new user
      if (error.response?.status === 404 && googleData) {
        const newUserData = {
        
          mobile: "",
          bio: "",
          description: "",
          userName: googleData.email,
          handle: handle,
          name: googleData.name,
          email: googleData.email,
          profileImage: googleData.picture,
          comeFrom: "google",
        };

        // Dispatch createUser action
        return dispatch(createUser({ data: newUserData })).unwrap();
      }

      const msg = "Network not found"|| error.response?.data?.message || error.message;
      return rejectWithValue(msg);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: {},
    Q: [],
    A: [],
    Qloading: false,
    Qerror: null,
    loggedIn: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.userData = {};
      state.loggedIn = false;
      state.loading = false;
      state.error = null;
      // Clear localStorage
      localStorage.removeItem("userData");
      localStorage.removeItem("googleUserData");
    },
    setUserFromStorage: (state, action) => {
      state.userData = action.payload;
      state.loggedIn = true;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.loggedIn = false;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userData = action.payload;
        state.loggedIn = true;
        // Save to localStorage
        localStorage.setItem("userData", JSON.stringify(action.payload));
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.loggedIn = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userData = action.payload;
        state.loggedIn = true;
        // Data is already saved to localStorage in the thunk
      })
     
  },
});

export const { logout, setUserFromStorage, clearError } = userSlice.actions;
export default userSlice.reducer;
