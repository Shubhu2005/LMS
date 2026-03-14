import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Button, Card, CardContent, Typography, Grid,
  TextField, MenuItem, Select, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Rating, IconButton, Chip, Pagination, CircularProgress,
  InputAdornment, CardMedia,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import {
  fetchBooks, addBook, deleteBook,
  updateBookRating, setGenre, setSearch, setPage,
} from '../../features/books/booksSlice';
import { requestBook, fetchMyBorrows } from '../../features/borrow/borrowSlice';

const GENRES = ['All', 'Fiction', 'Tech', 'Sci-Fi', 'Biography', 'Classic', 'Dystopian', 'Fantasy', 'Education', 'Thriller', 'Self-Help'];

const GENRE_COLORS = {
  Fiction:   { bg: '#eff6ff', color: '#1e40af' },
  Tech:      { bg: '#fdf2f8', color: '#9d174d' },
  'Sci-Fi':  { bg: '#f5f3ff', color: '#5b21b6' },
  Education: { bg: '#ecfdf5', color: '#065f46' },
  'Self-Help': { bg: '#fff7ed', color: '#9a3412' },
};

export default function BooksPage() {
  const dispatch = useDispatch();
  const { books, loading, totalPages, currentPage, genre, search } = useSelector((s) => s.books);
  const { borrows } = useSelector((s) => s.borrow);
  const { user } = useSelector((s) => s.auth);

  const isAdmin   = user?.role === 'Admin';
  const isManager = user?.role === 'Manager' || isAdmin;
  const isStudent = user?.role === 'Student';

  const [modalOpen, setModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [form, setForm] = useState({ title: '', author: '', genre: 'Fiction', rating: 3 });

  useEffect(() => {
    dispatch(fetchBooks({ genre, search, page: currentPage, limit: 6 }));
    if (isStudent) dispatch(fetchMyBorrows());
  }, [dispatch, genre, search, currentPage, isStudent]);

  useEffect(() => {
    const timer = setTimeout(() => dispatch(setSearch(searchInput)), 500);
    return () => clearTimeout(timer);
  }, [searchInput, dispatch]);

  const handleBorrow = (bookId) => {
    dispatch(requestBook(bookId)).then(() => dispatch(fetchMyBorrows()));
  };

  const getBorrowStatus = (bookId) => {
    const b = borrows.find(b => b.book?._id === bookId && (b.status === 'requested' || b.status === 'issued'));
    return b ? b.status : null;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant='h4' fontWeight={800} sx={{ letterSpacing: -1 }}>Books Catalog</Typography>
          <Typography variant='body2' sx={{ color: '#64748b' }}>Browse and manage the library collection.</Typography>
        </Box>
        {isAdmin && (
          <Button variant='contained' disableElevation startIcon={<AddRoundedIcon />} onClick={() => setModalOpen(true)} sx={{ borderRadius: '12px', py: 1.2, px: 3, textTransform: 'none', fontWeight: 700 }}>Add New Volume</Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField
          placeholder='Search library...'
          size='small'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{ width: 320, '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#fff' } }}
          InputProps={{ startAdornment: <InputAdornment position='start'><SearchRoundedIcon sx={{ color: '#94a3b8' }} /></InputAdornment> }}
        />
        <FormControl size='small' sx={{ minWidth: 160 }}>
          <InputLabel><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><FilterListRoundedIcon fontSize='small' /> Genre</Box></InputLabel>
          <Select value={genre} label='Genre' onChange={(e) => dispatch(setGenre(e.target.value))} sx={{ borderRadius: '12px', bgcolor: '#fff' }}>
            {GENRES.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress size={32} thickness={5} sx={{ color: '#6366f1' }} /></Box>
      ) : (
        <Grid container spacing={3}>
          {books.map((book) => {
            const status = getBorrowStatus(book._id);
            return (
              <Grid item xs={12} sm={6} md={4} key={book._id}>
                <Card elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '24px', border: '1px solid #e2e8f0', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)' } }}>
                  <Box sx={{ p: 3, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Chip label={book.genre} size='small' sx={{ fontWeight: 700, fontSize: 10, bgcolor: GENRE_COLORS[book.genre]?.bg || '#f1f5f9', color: GENRE_COLORS[book.genre]?.color || '#475569' }} />
                      {isAdmin && (
                        <IconButton size='small' onClick={() => window.confirm('Delete?') && dispatch(deleteBook(book._id))} sx={{ color: '#94a3b8', '&:hover': { color: '#f43f5e', bgcolor: '#fff1f2' } }}><DeleteOutlineRoundedIcon fontSize='small' /></IconButton>
                      )}
                    </Box>
                    <Typography variant='h6' fontWeight={800} sx={{ lineHeight: 1.3, mb: 1, color: '#0f172a' }}>{book.title}</Typography>
                    <Typography variant='body2' sx={{ color: '#64748b', mb: 3 }}>by <span style={{ fontWeight: 600, color: '#334155' }}>{book.author}</span></Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={book.rating} readOnly={!isManager} onChange={(_, v) => isManager && dispatch(updateBookRating({ id: book._id, rating: v }))} size='small' sx={{ color: '#f59e0b' }} />
                      <Typography variant='caption' fontWeight={700} sx={{ color: '#94a3b8' }}>{book.rating}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 2, pt: 0 }}>
                    {isStudent && (
                      <Button
                        fullWidth
                        disableElevation
                        variant={status ? 'contained' : 'outlined'}
                        startIcon={status ? <CheckCircleRoundedIcon /> : <AutoStoriesRoundedIcon />}
                        disabled={!!status || !book.isAvailable}
                        onClick={() => handleBorrow(book._id)}
                        sx={{ 
                          borderRadius: '14px', py: 1.2, textTransform: 'none', fontWeight: 700,
                          ...(status === 'requested' && { bgcolor: '#fef3c7 !important', color: '#92400e !important', border: 'none' }),
                          ...(status === 'issued' && { bgcolor: '#dcfce7 !important', color: '#166534 !important', border: 'none' }),
                        }}
                      >
                        {status === 'requested' ? 'Pending' : status === 'issued' ? 'Issued' : book.isAvailable ? 'Request' : 'Unavailable'}
                      </Button>
                    )}
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Pagination count={totalPages} page={currentPage} onChange={(_, v) => dispatch(setPage(v))} sx={{ '& .MuiPaginationItem-root': { borderRadius: '10px', fontWeight: 700 } }} />
        </Box>
      )}

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} PaperProps={{ sx: { borderRadius: '28px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Add New Book</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2, minWidth: 400 }}>
          <TextField label='Book Title' fullWidth value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
          <TextField label='Author Name' fullWidth value={form.author} onChange={(e) => setForm({...form, author: e.target.value})} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
          <TextField select label='Genre' fullWidth value={form.genre} onChange={(e) => setForm({...form, genre: e.target.value})} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}>
            {GENRES.filter(g => g !== 'All').map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setModalOpen(false)} sx={{ fontWeight: 700, color: '#64748b' }}>Cancel</Button>
          <Button variant='contained' disableElevation onClick={() => dispatch(addBook(form)).then(() => { setModalOpen(false); dispatch(fetchBooks({ genre, search, page: 1 })); })} sx={{ borderRadius: '12px', px: 4, fontWeight: 700 }}>Catalog</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}