import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const pageTitles = {
  "/admin/dashboard": "Dashboard",
  "/admin/borrows":   "Borrow Requests",
  "/books":           "Library Books",
  "/student/dashboard": "My Portal",
};

export default function Navbar() {
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);

  const getPanelName = () => {
    if (user?.role === "Admin") return "Admin Panel";
    if (user?.role === "Manager") return "Manager Panel";
    return "Student Portal";
  };

  const title = pageTitles[location.pathname] || getPanelName();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - 240px)`,
        ml: "240px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight={700} color="#111827" fontSize={18}>
          {title}
        </Typography>
        <Box flex={1} />
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {getPanelName()} | {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
