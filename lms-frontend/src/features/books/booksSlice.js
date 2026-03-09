import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import booksService from "./booksService";

export const fetchBooks = createAsyncThunk(
  "books/fetchAll",
  async (params, thunkAPI) => {
    try {
      return await booksService.getBooks(params);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const addBook = createAsyncThunk(
  "books/add",
  async (book, thunkAPI) => {
    try {
      const result = await booksService.addBook(book);
      message.success("Book added successfully!");
      return result.data;
    } catch (err) {
      message.error("Failed to add book");
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateBookRating = createAsyncThunk(
  "books/updateRating",
  async ({ id, rating }, thunkAPI) => {
    try {
      const result = await booksService.updateRating(id, rating);
      message.success("Rating updated!");
      return result.data;
    } catch (err) {
      message.error("Failed to update rating");
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteBook = createAsyncThunk(
  "books/delete",
  async (id, thunkAPI) => {
    try {
      await booksService.deleteBook(id);
      message.success("Book deleted!");
      return id;
    } catch (err) {
      message.error("Failed to delete book");
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    total: 0,
    totalPages: 1,
    currentPage: 1,
    loading: false,
    error: null,
    genre: "All",
    search: "",
  },
  reducers: {
    setGenre(state, action)  { state.genre = action.payload; state.currentPage = 1; },  
    setSearch(state, action) { state.search = action.payload; state.currentPage = 1; }, 
    setPage(state, action)   { state.currentPage = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending,  (state) => { state.loading = true; })
      .addCase(fetchBooks.fulfilled,(state, { payload }) => {
        state.loading    = false;
        state.books      = payload.data;
        state.total      = payload.total;
        state.totalPages = payload.lastPage || 1;
      })
      .addCase(fetchBooks.rejected, (state, { payload }) => {
        state.loading = false;
        state.error   = payload;
      })
      .addCase(addBook.fulfilled, (state, { payload }) => {
        state.books.unshift(payload);
      })
      .addCase(deleteBook.fulfilled, (state, { payload }) => {
        state.books = state.books.filter((b) => b._id !== payload);
      })
      .addCase(updateBookRating.fulfilled, (state, { payload }) => {
        const i = state.books.findIndex((b) => b._id === payload._id);
        if (i !== -1) state.books[i] = payload;
      });
  },
});

export const { setGenre, setSearch, setPage } = booksSlice.actions;
export default booksSlice.reducer;
