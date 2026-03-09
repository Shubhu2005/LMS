import { configureStore } from "@reduxjs/toolkit";
import authReducer   from "../features/auth/authSlice";
import booksReducer  from "../features/books/booksSlice";
import borrowReducer from "../features/borrow/borrowSlice";

export default configureStore({
  reducer: {
    auth:   authReducer,
    books:  booksReducer,
    borrow: borrowReducer,
  },
});
