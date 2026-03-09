import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Button, Tabs, Tab, CircularProgress,
  IconButton, Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  fetchPendingRequests, fetchAllBorrows,
  approveBorrowRequest, declineBorrowRequest, returnBorrowedBook,
} from '../../features/borrow/borrowSlice';

const STATUS_COLORS = {
  requested: { bg: '#fef3c7', color: '#92400e' },
  issued:    { bg: '#dcfce7', color: '#166534' },
  returned:  { bg: '#dbeafe', color: '#1e40af' },
  declined:  { bg: '#fee2e2', color: '#991b1b' },
};

export default function BorrowManagement() {
  const dispatch = useDispatch();
  const { borrows, loading } = useSelector((s) => s.borrow);
  const [tab, setTab] = useState(0);

  const loadData = useCallback(() => { dispatch(fetchAllBorrows()); }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getFilteredBorrows = () => {
    const list = Array.isArray(borrows) ? borrows : [];
    if (tab === 0) return list.filter(b => b?.status === 'requested');
    if (tab === 1) return list.filter(b => b?.status === 'issued');
    return list; // tab 2: All Records
  };

  const filteredBorrows = getFilteredBorrows();

  const handleApprove = (id) => dispatch(approveBorrowRequest(id)).then(() => loadData());
  const handleDecline = (id) => dispatch(declineBorrowRequest(id)).then(() => loadData());
  const handleReturn  = (id) => dispatch(returnBorrowedBook(id)).then(() => loadData());

  return (
    <Box>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
        <Typography variant='h5' fontWeight={700}>Borrow Management</Typography>
        <Tooltip title='Refresh Data'>
          <IconButton onClick={loadData} disabled={loading} color='primary'>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, pt: 1 }}>
          <Tab label='Pending Requests' />
          <Tab label='Issued Books' />
          <Tab label='All Records' />
        </Tabs>
      </Paper>

      {loading ? (
        <Box display='flex' justifyContent='center' py={8}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f9fafb' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Book Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBorrows.map((row) => (
                <TableRow key={row._id} hover>
                  <TableCell>
                    <Typography variant='body2' fontWeight={600}>{row.user?.name ||row.user?.firstName || 'N/A'}</Typography>
                    <Typography variant='caption' color='text.secondary'>{row.user?.email || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='body2'>{row.book?.title || 'Unknown Book'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={(row.status || 'Unknown').toUpperCase()} 
                      size='small' 
                      sx={{ 
                        backgroundColor: STATUS_COLORS[row.status]?.bg || '#f3f4f6', 
                        color: STATUS_COLORS[row.status]?.color || '#374151',
                        fontWeight: 700, fontSize: 10
                      }} 
                    />
                  </TableCell>
                  <TableCell variant='caption'>
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell align='right'>
                    {row.status === 'requested' && (
                      <Box display='flex' gap={1} justifyContent='flex-end'>
                        <Button size='small' variant='contained' color='success' onClick={() => handleApprove(row._id)}>Approve</Button>
                        <Button size='small' variant='outlined' color='error' onClick={() => handleDecline(row._id)}>Decline</Button>
                      </Box>
                    )}
                    {row.status === 'issued' && (
                      <Button size='small' variant='contained' color='primary' onClick={() => handleReturn(row._id)}>Mark Returned</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredBorrows.length === 0 && (
                <TableRow><TableCell colSpan={5} align='center' sx={{ py: 6 }}>
                  <Typography color='text.secondary'>No records found in this category.</Typography>
                  <Button startIcon={<RefreshIcon />} size='small' onClick={loadData} sx={{ mt: 1 }}>Check again</Button>
                </TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
