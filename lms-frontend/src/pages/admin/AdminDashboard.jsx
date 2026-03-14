import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, Typography, Grid, Paper, Button, Avatar, Chip, 
  List, ListItem, ListItemAvatar, ListItemText 
} from '@mui/material';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import LibraryAddCheckRoundedIcon from '@mui/icons-material/LibraryAddCheckRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import { fetchAllBorrows } from '../../features/borrow/borrowSlice';
import { fetchBooks } from '../../features/books/booksSlice';

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6'];

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { borrows } = useSelector((s) => s.borrow);
  const { total: totalBooks } = useSelector((s) => s.books);

  useEffect(() => {
    dispatch(fetchAllBorrows());
    dispatch(fetchBooks({ limit: 10 }));
  }, [dispatch]);

  const stats = [
    { label: 'Total Books', value: totalBooks, color: '#6366f1', icon: <AutoStoriesRoundedIcon /> },
    { label: 'Active Requests', value: borrows.filter(b => b.status === 'requested').length, color: '#f59e0b', icon: <PendingActionsRoundedIcon /> },
    { label: 'Issued Books', value: borrows.filter(b => b.status === 'issued').length, color: '#10b981', icon: <LibraryAddCheckRoundedIcon /> },
    { label: 'Total Members', value: 124, color: '#ec4899', icon: <PeopleAltRoundedIcon /> },
  ];

  const chartData = [
    { name: 'Mon', issued: 4, returned: 2 },
    { name: 'Tue', issued: 7, returned: 4 },
    { name: 'Wed', issued: 5, returned: 6 },
    { name: 'Thu', issued: 12, returned: 8 },
    { name: 'Fri', issued: 9, returned: 10 },
    { name: 'Sat', issued: 15, returned: 12 },
    { name: 'Sun', issued: 10, returned: 9 },
  ];

  const genreData = [
    { name: 'Fiction', value: 40 },
    { name: 'Tech', value: 30 },
    { name: 'Sci-Fi', value: 20 },
    { name: 'Bio', value: 10 },
  ];

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant='h4' fontWeight={900} sx={{ color: '#0f172a', letterSpacing: '-0.04em' }}>
            System Intelligence
          </Typography>
          <Typography variant='body1' sx={{ color: '#64748b', fontWeight: 500 }}>
            Welcome back! Here is what's happening with your library today.
          </Typography>
        </Box>
        <Button 
          variant='contained' 
          disableElevation 
          startIcon={<AddRoundedIcon />} 
          onClick={() => navigate('/books')}
          sx={{ 
            borderRadius: '14px', py: 1.5, px: 3, 
            textTransform: 'none', fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
          }}
        >
          Add New Book
        </Button>
      </Box>

      <Grid container spacing={3} mb={4}>
        {stats.map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.label}>
            <Paper elevation={0} sx={{ 
              p: 3, borderRadius: '24px', border: '1px solid #e2e8f0', 
              background: '#fff', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <Box sx={{ display: 'flex', alignItems:'center', mb: 2 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '16px', bgcolor: `${s.color}10`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.icon}
                </Box>
                {/* <Chip 
                  label={s.trend} 
                  size='small' 
                  icon={<ArrowUpwardRoundedIcon style={{ fontSize: 14 }} />}
                  sx={{ bgcolor: '#f0fdf4', color: '#16a34a', fontWeight: 700, borderRadius: '8px', border: '1px solid #dcfce7' }}
                /> */}
              </Box>
              <Typography variant='h4' fontWeight={900} sx={{ color: '#1e293b' }}>{s.value}</Typography>
              <Typography variant='caption' sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} xl={8}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', background: '#fff', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant='h6' fontWeight={800} sx={{ color: '#0f172a' }}>Borrowing Velocity</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#6366f1' }} />
                  <Typography variant='caption' fontWeight={700} color='#64748b'>ISSUED</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                  <Typography variant='caption' fontWeight={700} color='#64748b'>RETURNED</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ height: 350 }}>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id='colorIssued' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#6366f1' stopOpacity={0.15}/>
                      <stop offset='95%' stopColor='#6366f1' stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id='colorReturned' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#10b981' stopOpacity={0.15}/>
                      <stop offset='95%' stopColor='#10b981' stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f1f5f9' />
                  <XAxis dataKey='name' axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                  <ChartTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }} />
                  <Area type='monotone' dataKey='issued' stroke='#6366f1' strokeWidth={4} fillOpacity={1} fill='url(#colorIssued)' />
                  <Area type='monotone' dataKey='returned' stroke='#10b981' strokeWidth={4} fillOpacity={1} fill='url(#colorReturned)' />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} xl={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', background: '#fff' }}>
                <Typography variant='h6' fontWeight={800} sx={{ mb: 2 }}>Genre Distribution</Typography>
                {/* Fixed Container for Pie Chart */}
                <Box sx={{ height: 240, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie 
                        data={genreData} 
                        cx='50%' 
                        cy='50%' 
                        innerRadius={60} 
                        outerRadius={85} 
                        paddingAngle={5} 
                        dataKey='value'
                        stroke='none'
                      >
                        {genreData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                {/* Custom Legend below chart to prevent squeezing */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mt: 2 }}>
                  {genreData.map((g, i) => (
                    <Box key={g.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: PIE_COLORS[i] }} />
                      <Typography variant='caption' fontWeight={700} color='#475569'>{g.name}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: '32px', border: '1px solid #e2e8f0', background: '#fff' }}>
                <Typography variant='h6' fontWeight={800} sx={{ mb: 3 }}>Recent Activity</Typography>
                <List disablePadding>
                  {borrows.slice(0, 3).map((b) => (
                    <ListItem key={b._id} disableGutters sx={{ mb: 2 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#f8fafc', color: '#6366f1', fontWeight: 800, border: '1px solid #e2e8f0' }}>{b.user?.firstName?.charAt(0)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={<Typography variant='body2' fontWeight={800}>{b.user?.firstName}</Typography>}
                        secondary={<Typography variant='caption' color='#64748b' noWrap display='block'>{b.book?.title}</Typography>}
                      />
                      <Chip label={b.status} size='small' sx={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', bgcolor: b.status === 'issued' ? '#dcfce7' : '#fef3c7', color: b.status === 'issued' ? '#166534' : '#92400e' }} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}