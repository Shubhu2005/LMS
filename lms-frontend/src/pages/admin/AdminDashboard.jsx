import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Grid, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PeopleIcon from '@mui/icons-material/People';
import { fetchAllBorrows } from '../../features/borrow/borrowSlice';
import { fetchBooks } from '../../features/books/booksSlice';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { borrows } = useSelector((s) => s.borrow);
  const { total: totalBooks } = useSelector((s) => s.books);

  useEffect(() => {
    dispatch(fetchAllBorrows());
    dispatch(fetchBooks({ limit: 1 }));
  }, [dispatch]);

  const stats = [
    { label: 'Total Books', value: totalBooks, color: '#6366f1', icon: <ListAltIcon /> },
    { label: 'Pending Requests', value: borrows.filter(b => b.status === 'requested').length, color: '#f59e0b', icon: <PeopleIcon /> },
    { label: 'Books Issued', value: borrows.filter(b => b.status === 'issued').length, color: '#10b981', icon: <AddIcon /> },
    { label: 'Returned Books', value: borrows.filter(b => b.status === 'returned').length, color: '#3b82f6', icon: <ListAltIcon /> },
  ];

  const chartData = [
    { name: 'Issued', value: borrows.filter(b => b.status === 'issued').length },
    { name: 'Returned', value: borrows.filter(b => b.status === 'returned').length },
    { name: 'Pending', value: borrows.filter(b => b.status === 'requested').length },
    { name: 'Declined', value: borrows.filter(b => b.status === 'declined').length },
  ];

  return (
    <Box>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={4}>
        <Typography variant='h5' fontWeight={700}>System Overview</Typography>
        <Box display='flex' gap={2}>
           <Button variant='contained' startIcon={<AddIcon />} onClick={() => navigate('/books')} sx={{ borderRadius: 2, bgcolor: '#6366f1' }}>Add Book</Button>
           <Button variant='outlined' startIcon={<ListAltIcon />} onClick={() => navigate('/admin/borrows')} sx={{ borderRadius: 2 }}>Manage Requests</Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.label}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: `${s.color}15`, color: s.color, width: 48, height: 48 }}>{s.icon}</Avatar>
              <Box>
                <Typography variant='caption' color='text.secondary' fontWeight={600}>{s.label}</Typography>
                <Typography variant='h5' fontWeight={700}>{s.value}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e5e7eb', height: 400 }}>
            <Typography variant='h6' fontWeight={700} mb={3}>Borrow Statistics</Typography>
            <ResponsiveContainer width='100%' height='85%'>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f3f4f6' />
                <XAxis dataKey='name' axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <ChartTooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey='value' radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Activity Table */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e5e7eb', height: 400, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h6' fontWeight={700} mb={3}>Recent Activity</Typography>
            <TableContainer sx={{ flex: 1 }}>
              <Table stickyHeader size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, bgcolor: '#fff' }}>Student</TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: '#fff' }}>Book</TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: '#fff' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {borrows.slice(0, 6).map((b) => (
                    <TableRow key={b._id}>
                      <TableCell sx={{ py: 1.5 }}>{b.user?.name || b.user?.firstName}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>{b.book?.title}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography fontSize={11} fontWeight={700} sx={{ textTransform: 'uppercase', color: b.status === 'requested' ? '#f59e0b' : b.status === 'issued' ? '#10b981' : '#3b82f6' }}>
                          {b.status}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
