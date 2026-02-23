// src/features/books/booksService.js
// Real API — connects to NestJS backend
// Make sure your backend has a /books route (see note below)

import axiosInstance from "../../api/axios";

// GET /books?genre=Fiction&search=clean&page=1&limit=6
const getBooks = async ({ genre = "", search = "", page = 1, limit = 6 } = {}) => {
  const params = { page, limit };
  if (genre && genre !== "All") params.genre  = genre;
  if (search)                   params.search = search;

  const { data } = await axiosInstance.get("/books", { params });

  // NestJS should return: { data: [...], total, totalPages, page }
  return data;
};

// POST /books  (Admin only — JWT + Role guard on backend)
const addBook = async (book) => {
  const { data } = await axiosInstance.post("/books", book);
  return data;
};

// PATCH /books/:id/rating  (Manager + Admin)
const updateRating = async (id, rating) => {
  const { data } = await axiosInstance.patch(`/books/${id}/rating`, { rating });
  return data;
};

// DELETE /books/:id  (Admin only)
const deleteBook = async (id) => {
  await axiosInstance.delete(`/books/${id}`);
  return id;
};

const booksService = { getBooks, addBook, updateRating, deleteBook };
export default booksService;