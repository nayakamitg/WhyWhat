import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";



const socialSlice=createSlice({
    name:"social",
    initialState:{
        likes:[],
        comments:[],
        loading:true,
        error:null
    },
    reducers:{}
})