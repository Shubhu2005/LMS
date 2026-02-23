import { useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Box, Button, TextField, Typography, Paper, MenuItem, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, clearError, clearRegisterSuccess } from "../../features/auth/authSlice";

const validationSchema = Yup.object({
  name:     Yup.string().min(2, "Min 2 characters").required("Name is required"),
  email:    Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Min 6 characters").required("Password is required"),
  role:     Yup.string().oneOf(["Student", "Manager", "Admin"]).required("Role is required"),
});

export default function RegisterPage() {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { loading, error, registerSuccess } = useSelector((state) => state.auth);

  useEffect(() => {
    if (registerSuccess) {
      dispatch(clearRegisterSuccess());
      navigate("/login");
    }
  }, [registerSuccess, navigate, dispatch]);

  useEffect(() => () => dispatch(clearError()), [dispatch]);

  const handleSubmit = (values) => {
    dispatch(registerUser(values));
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
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Create Account
          </Typography>
        </Box>

        <Typography variant="h6" fontWeight={600} mb={3}>
          Register
        </Typography>

        {/* Error */}
        {error && (
          <Box mb={2} p={1.5} sx={{ backgroundColor: "#fdecea", borderRadius: 1 }}>
            <Typography color="error" variant="body2">{error}</Typography>
          </Box>
        )}

        {/* Form */}
        <Formik
          initialValues={{ name: "", email: "", password: "", role: "Student" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box display="grid" gap="24px">
                <TextField
                  fullWidth variant="outlined" label="Full Name"
                  name="name" value={values.name}
                  onBlur={handleBlur} onChange={handleChange}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                />
                <TextField
                  fullWidth variant="outlined" type="email" label="Email Address"
                  name="email" value={values.email}
                  onBlur={handleBlur} onChange={handleChange}
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  fullWidth variant="outlined" type="password" label="Password"
                  name="password" value={values.password}
                  onBlur={handleBlur} onChange={handleChange}
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
                <TextField
                  fullWidth select variant="outlined" label="Role"
                  name="role" value={values.role}
                  onBlur={handleBlur} onChange={handleChange}
                  error={!!touched.role && !!errors.role}
                  helperText={touched.role && errors.role}
                >
                  <MenuItem value="Student">Student</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </TextField>

                <Button
                  type="submit" variant="contained" size="large"
                  disabled={loading} fullWidth
                  sx={{ py: 1.5, fontWeight: 600 }}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </Box>
            </form>
          )}
        </Formik>

        <Box textAlign="center" mt={3}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#1976d2", fontWeight: 600 }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}