import { configureStore } from "@reduxjs/toolkit";
import authReducer  from "../features/auth/authSlice";
import booksReducer from "../features/books/booksSlice";

export default configureStore({
  reducer: {
    auth:  authReducer,
    books: booksReducer,
  },
});