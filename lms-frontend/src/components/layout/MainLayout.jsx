import { Box, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar  from "./Navbar";

export default function MainLayout({ children }) {
  return (
    <Box display="flex" minHeight="100vh" sx={{ backgroundColor: "#f9fafb" }}>
      <Sidebar />
      <Box component="main" sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <Toolbar /> 
        <Box sx={{ p: 3, flex: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}