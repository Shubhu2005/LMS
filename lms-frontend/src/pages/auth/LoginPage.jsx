import { useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Typography, Paper, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser, clearError } from "../../features/auth/authSlice";

const validationSchema = Yup.object({
  email:    Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
});

export default function LoginPage() {
  const dispatch   = useDispatch();
    const isNonMobile = useMediaQuery("(min-width:600px)");
  const { loading, error } = useSelector((state) => state.auth);



  useEffect(() => () => dispatch(clearError()), [dispatch]);

  const handleSubmit = (values) => {
    dispatch(loginUser(values));
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ backgroundColor: "#f0f2f5" }}
    >
      <Paper elevation={4} sx={{ p: 5, width: isNonMobile ? 420 : "90%", borderRadius: 3 }}>
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight={700} color="primary">
            📚 LMS
          </Typography>
          
        </Box>

        <Typography variant="h6" fontWeight={600} mb={3}>
          Sign in to your account
        </Typography>

        {/* Error */}
        {error && (
          <Box mb={2} p={1.5} sx={{ backgroundColor: "#fdecea", borderRadius: 1 }}>
            <Typography color="error" variant="body2">{error}</Typography>
          </Box>
        )}

        {/* Form */}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box display="grid" gap="24px">
                <TextField
                  fullWidth
                  variant="outlined"
                  type="email"
                  label="Email Address"
                  name="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  type="password"
                  label="Password"
                  name="password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  fullWidth
                  sx={{ py: 1.5, fontWeight: 600 }}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </Box>
            </form>
          )}
        </Formik>

        <Box textAlign="center" mt={3}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#1976d2", fontWeight: 600 }}>
              Register here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

