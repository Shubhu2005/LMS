import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import borrowService from "./borrowService";

export const requestBook = createAsyncThunk(
  "borrow/request",
  async (bookId, thunkAPI) => {
    try {
      const result = await borrowService.requestBook(bookId);
      message.success("Request submitted!");
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || "Request failed";
      message.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const fetchMyBorrows = createAsyncThunk(
  "borrow/fetchMy",
  async (_, thunkAPI) => {
    try {
      return await borrowService.getMyBorrows();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchAllBorrows = createAsyncThunk(
  "borrow/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await borrowService.getAllBorrows();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchPendingRequests = createAsyncThunk(
  "borrow/fetchPending",
  async (_, thunkAPI) => {
    try {
      return await borrowService.getPendingRequests();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const approveBorrowRequest = createAsyncThunk(
  "borrow/approve",
  async (id, thunkAPI) => {
    try {
      const result = await borrowService.approveRequest(id);
      message.success("Request approved!");
      return result.data;
    } catch (err) {
      message.error("Failed to approve");
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const declineBorrowRequest = createAsyncThunk(
  "borrow/decline",
  async (id, thunkAPI) => {
    try {
      const result = await borrowService.declineRequest(id);
      message.success("Request declined!");
      return result.data;
    } catch (err) {
      message.error("Failed to decline");
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const returnBorrowedBook = createAsyncThunk(
  "borrow/return",
  async (id, thunkAPI) => {
    try {
      const result = await borrowService.returnBook(id);
      message.success("Book returned!");
      return result.data;
    } catch (err) {
      message.error("Failed to return");
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    borrows: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBorrows.pending, (state) => { state.loading = true; })
      .addCase(fetchMyBorrows.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.borrows = payload;
      })
      .addCase(fetchAllBorrows.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.borrows = payload;
      })
      .addCase(fetchPendingRequests.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.borrows = payload;
      })
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled") && action.type.startsWith("borrow/approve"),
        (state, { payload }) => {
           const i = state.borrows.findIndex(b => b._id === payload._id);
           if(i !== -1) state.borrows[i] = payload;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled") && (action.type.startsWith("borrow/decline") || action.type.startsWith("borrow/return")),
        (state, { payload }) => {
           const i = state.borrows.findIndex(b => b._id === payload._id);
           if(i !== -1) state.borrows[i] = payload;
        }
      );
  },
});

export default borrowSlice.reducer;
