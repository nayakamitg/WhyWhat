import { configureStore } from "@reduxjs/toolkit";
import postSlice from "../services/slices/postSlice"

const Store=configureStore({
    reducer:{
        post:postSlice
    }
})

export default Store;