import { combineReducers, configureStore } from "@reduxjs/toolkit";
import locationReducer from "./locationSlice";

const rootReducer = combineReducers({
    location : locationReducer
});

const store = configureStore({
    reducer : rootReducer
});

export default store;