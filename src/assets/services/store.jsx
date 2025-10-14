import { configureStore } from "@reduxjs/toolkit";
import postSlice from "../services/slices/postSlice"
import userSlice from "../services/slices/userSlice"
import otherSlice from "../services/slices/otherSlice"

const Store=configureStore({
    reducer:{
        post:postSlice,
        user:userSlice,
        other:otherSlice
    }
})

export default Store;