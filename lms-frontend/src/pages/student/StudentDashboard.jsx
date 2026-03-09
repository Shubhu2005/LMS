import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Typography, Grid, Card, CardContent, Chip, CircularProgress, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from "@mui/material";
import { fetchMyBorrows } from "../../features/borrow/borrowSlice";
import { fetchBooks } from "../../features/books/booksSlice";

const STATUS_COLORS = {
  requested: { bg: "#fef3c7", color: "#92400e" },
  issued:    { bg: "#dcfce7", color: "#166534" },
  returned:  { bg: "#dbeafe", color: "#1e40af" },
  declined:  { bg: "#fee2e2", color: "#991b1b" },
};

export default function StudentDashboard() {
  const dispatch = useDispatch();
  const { borrows, loading } = useSelector((s) => s.borrow);
  const { books } = useSelector((s) => s.books);

  useEffect(() => {
    dispatch(fetchMyBorrows());
    dispatch(fetchBooks({ limit: 4 })); // Show some featured books
  }, [dispatch]);

  const stats = [
    { label: "Active Requests", value: borrows.filter(b => b.status === "requested").length },
    { label: "Issued Books",   value: borrows.filter(b => b.status === "issued").length },
    { label: "Returned total", value: borrows.filter(b => b.status === "returned").length },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Student Dashboard</Typography>

      <Grid container spacing={2.5} mb={4}>
        {stats.map(({ label, value }) => (
          <Grid item xs={12} sm={4} key={label}>
            <Paper sx={{ p: 2, borderRadius: 3, border: "1px solid #e5e7eb" }} elevation={0}>
              <Typography variant="caption" color="text.secondary">{label}</Typography>
              <Typography variant="h5" fontWeight={700} color="#6366f1">{value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" fontWeight={700} mb={2}>My Borrow Status</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e5e7eb", borderRadius: 3, mb: 4 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f9fafb" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Book Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Author</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Update Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {borrows.map((row) => (
                <TableRow key={row._id}>
                  <TableCell fontWeight={600}>{row.book?.title}</TableCell>
                  <TableCell>{row.book?.author}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status.toUpperCase()} 
                      size="small" 
                      sx={{ 
                        backgroundColor: STATUS_COLORS[row.status]?.bg, 
                        color: STATUS_COLORS[row.status]?.color,
                        fontWeight: 700, fontSize: 10
                      }} 
                    />
                  </TableCell>
                  <TableCell variant="caption">{new Date(row.updatedAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {borrows.length === 0 && (
                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 4 }}>You haven"t requested any books yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
