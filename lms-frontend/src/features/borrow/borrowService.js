import axiosInstance from "../../api/axios";

const requestBook = async (bookId) => {
  const { data } = await axiosInstance.post(`/borrow/${bookId}`);
  return data;
};

const getMyBorrows = async () => {
  const { data } = await axiosInstance.get("/borrow/my");
  return data;
};

const getPendingRequests = async () => {
  const { data } = await axiosInstance.get("/borrow/pending");
  return data;
};

const approveRequest = async (id) => {
  const { data } = await axiosInstance.patch(`/borrow/${id}/approve`);
  return data;
};

const declineRequest = async (id) => {
  const { data } = await axiosInstance.patch(`/borrow/${id}/decline`);
  return data;
};

const returnBook = async (id) => {
  const { data } = await axiosInstance.patch(`/borrow/${id}/return`);
  return data;
};

const getAllBorrows = async () => {
  const { data } = await axiosInstance.get("/borrow");
  return data;
};

const borrowService = {
  requestBook,
  getMyBorrows,
  getPendingRequests,
  approveRequest,
  declineRequest,
  returnBook,
  getAllBorrows,
};

export default borrowService;
