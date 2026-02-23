import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/admin/dashboard": "Dashboard",
  "/admin/books":     "Books Management",
  "/admin/members":   "Members",
};

export default function Navbar() {
  const location = useLocation();
  const title    = pageTitles[location.pathname] || "Admin Panel";

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
        <Typography variant="caption" color="text.secondary">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}