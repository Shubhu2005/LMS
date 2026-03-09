import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Button, Tabs, Tab, CircularProgress,
} from "@mui/material";
import {
  fetchPendingRequests, fetchAllBorrows,
  approveBorrowRequest, declineBorrowRequest, returnBorrowedBook,
} from "../../features/borrow/borrowSlice";

const STATUS_COLORS = {
  requested: { bg: "#fef3c7", color: "#92400e" },
  issued:    { bg: "#dcfce7", color: "#166534" },
  returned:  { bg: "#dbeafe", color: "#1e40af" },
  declined:  { bg: "#fee2e2", color: "#991b1b" },
};

export default function BorrowManagement() {
  const dispatch = useDispatch();
  const { borrows, loading } = useSelector((s) => s.borrow);
  const { user } = useSelector((s) => s.auth);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (tab === 0) dispatch(fetchPendingRequests());
    else if (tab === 1) dispatch(fetchAllBorrows());
    else if (tab === 2) dispatch(fetchAllBorrows());
  }, [dispatch, tab]);

  const filteredBorrows = tab === 1 
    ? borrows.filter(b => b.status === "issued")
    : borrows;

  const handleApprove = (id) => dispatch(approveBorrowRequest(id));
  const handleDecline = (id) => dispatch(declineBorrowRequest(id));
  const handleReturn  = (id) => dispatch(returnBorrowedBook(id));

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>Borrow Management</Typography>

      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, pt: 1 }}>
          <Tab label="Pending Requests" />
          <Tab label="Issued Books" />
          <Tab label="All Records" />
        </Tabs>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e5e7eb", borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f9fafb" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Book Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBorrows.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>{row.user?.firstName}</Typography>
                    <Typography variant="caption" color="text.secondary">{row.user?.email}</Typography>
                  </TableCell>
                  <TableCell>{row.book?.title}</TableCell>
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
                  <TableCell variant="caption">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    {row.status === "requested" && (
                      <Box display="flex" gap={1} justifyContent="flex-end">
                        <Button size="small" variant="contained" color="success" onClick={() => handleApprove(row._id)}>Approve</Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => handleDecline(row._id)}>Decline</Button>
                      </Box>
                    )}
                    {row.status === "issued" && (
                      <Button size="small" variant="contained" color="primary" onClick={() => handleReturn(row._id)}>Mark Returned</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredBorrows.length === 0 && (
                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}>No records found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
