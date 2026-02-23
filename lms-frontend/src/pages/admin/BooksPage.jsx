import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Button, Card, CardContent, Typography, Grid,
  TextField, MenuItem, Select, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Rating, IconButton, Chip, Pagination, CircularProgress,
  InputAdornment,
} from "@mui/material";
import AddIcon        from "@mui/icons-material/Add";
import DeleteIcon     from "@mui/icons-material/Delete";
import SearchIcon     from "@mui/icons-material/Search";
import {
  fetchBooks, addBook, deleteBook,
  updateBookRating, setGenre, setSearch, setPage,
} from "../../features/books/booksSlice";

const GENRES = ["All", "Fiction", "Tech", "Sci-Fi", "Biography"];

const GENRE_COLORS = {
  Fiction:   { bg: "#fef3c7", color: "#92400e" },
  Tech:      { bg: "#dbeafe", color: "#1e40af" },
  "Sci-Fi":  { bg: "#f3e8ff", color: "#6b21a8" },
  Biography: { bg: "#dcfce7", color: "#166534" },
};

export default function BooksPage() {
  const dispatch = useDispatch();
  const { books, loading, totalPages, currentPage, genre, search } = useSelector((s) => s.books);
  const { user } = useSelector((s) => s.auth);

  const isAdmin   = user?.role === "Admin";
  const isManager = user?.role === "Manager" || isAdmin;

  const [modalOpen, setModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [form, setForm] = useState({ title: "", author: "", genre: "Fiction", rating: 3 });

  // Fetch books when filters/page change
  useEffect(() => {
    dispatch(fetchBooks({ genre, search, page: currentPage, limit: 6 }));
  }, [dispatch, genre, search, currentPage]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => dispatch(setSearch(searchInput)), 500);
    return () => clearTimeout(timer);
  }, [searchInput, dispatch]);

  const handleAddBook = () => {
    if (!form.title || !form.author) return;
    dispatch(addBook(form)).then(() => {
      setModalOpen(false);
      setForm({ title: "", author: "", genre: "Fiction", rating: 3 });
      dispatch(fetchBooks({ genre, search, page: currentPage, limit: 6 }));
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this book?")) dispatch(deleteBook(id));
  };

  const handleRating = (id, value) => {
    dispatch(updateBookRating({ id, rating: value }));
  };

  return (
    <Box>
      {/* Top Bar */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        {/* Search */}
        <TextField
          placeholder="Search by title or author..."
          size="small"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{ width: 280 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" color="action" /></InputAdornment>,
          }}
        />

        <Box display="flex" alignItems="center" gap={2}>
          {/* Genre Filter */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Genre</InputLabel>
            <Select
              value={genre}
              label="Genre"
              onChange={(e) => dispatch(setGenre(e.target.value))}
            >
              {GENRES.map((g) => <MenuItem key={g} value={g}>{g}</MenuItem>)}
            </Select>
          </FormControl>

          {/* Add Book — Admin only */}
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setModalOpen(true)}
              sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4f46e5" }, borderRadius: 2 }}
            >
              Add Book
            </Button>
          )}
        </Box>
      </Box>

      {/* Stats */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        {[
          { label: "Total Books", value: useSelector((s) => s.books.total) },
          { label: "Genre Filter", value: genre },
          { label: "Current Page", value: currentPage },
        ].map(({ label, value }) => (
          <Box key={label} sx={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 2, px: 2.5, py: 1.5, minWidth: 140 }}>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="h6" fontWeight={700} color="#111827">{value}</Typography>
          </Box>
        ))}
      </Box>

      {/* Books Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}>
          <CircularProgress sx={{ color: "#6366f1" }} />
        </Box>
      ) : books.length === 0 ? (
        <Box textAlign="center" mt={8}>
          <Typography color="text.secondary">No books found.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 3,
                  height: "100%",
                  transition: "box-shadow 0.2s",
                  "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                    <Chip
                      label={book.genre}
                      size="small"
                      sx={{
                        backgroundColor: GENRE_COLORS[book.genre]?.bg || "#f3f4f6",
                        color: GENRE_COLORS[book.genre]?.color || "#374151",
                        fontWeight: 600,
                        fontSize: 11,
                      }}
                    />
                    {isAdmin && (
                      <IconButton size="small" onClick={() => handleDelete(book.id)} sx={{ color: "#ef4444", "&:hover": { backgroundColor: "#fef2f2" } }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>

                  <Typography variant="h6" fontWeight={700} fontSize={15} color="#111827" mb={0.5} noWrap>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    by {book.author}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1}>
                    <Rating
                      value={book.rating}
                      onChange={(_, val) => isManager && handleRating(book.id, val)}
                      readOnly={!isManager}
                      size="small"
                      sx={{ color: "#f59e0b" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      ({book.rating}/5)
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, val) => dispatch(setPage(val))}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}

      {/* Add Book Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700}>Add New Book</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box display="grid" gap={2.5} mt={1}>
            <TextField
              label="Title" fullWidth
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <TextField
              label="Author" fullWidth
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
            />
            <TextField
              select label="Genre" fullWidth
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
            >
              {GENRES.filter((g) => g !== "All").map((g) => (
                <MenuItem key={g} value={g}>{g}</MenuItem>
              ))}
            </TextField>
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>Rating</Typography>
              <Rating
                value={form.rating}
                onChange={(_, val) => setForm({ ...form, rating: val })}
                sx={{ color: "#f59e0b" }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setModalOpen(false)} color="inherit">Cancel</Button>
          <Button
            variant="contained" onClick={handleAddBook}
            sx={{ backgroundColor: "#6366f1", "&:hover": { backgroundColor: "#4f46e5" } }}
          >
            Add Book
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}