// src/components/layout/Sidebar.jsx
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Typography, Divider, Avatar,
} from "@mui/material";
import MenuBookIcon  from "@mui/icons-material/MenuBook";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon    from "@mui/icons-material/Logout";
import PeopleIcon    from "@mui/icons-material/People";
import { logout }    from "../../features/auth/authSlice";

const SIDEBAR_WIDTH = 240;

const navItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
  { label: "Books",     icon: <MenuBookIcon />,  path: "/admin/books" },
  { label: "Members",   icon: <PeopleIcon />,    path: "/admin/members" },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true }); // ✅ FIX: replace:true clears history stack
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_WIDTH,
          boxSizing: "border-box",
          backgroundColor: "#1a1f2e",
          color: "#fff",
          borderRight: "none",
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Typography variant="h6" fontWeight={700} color="#fff" fontSize={15}>
          📚 Library Management
        </Typography>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
          Admin Panel
        </Typography>
      </Box>

      {/* Nav Items */}
      <List sx={{ flex: 1, px: 1, pt: 2 }}>
        {navItems.map(({ label, icon, path }) => {
          const active = location.pathname === path;
          return (
            <ListItem key={label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(path)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: active ? "rgba(99,102,241,0.15)" : "transparent",
                  color: active ? "#818cf8" : "rgba(255,255,255,0.6)",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.06)", color: "#fff" },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>{icon}</ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 400 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      {/* User + Logout */}
      <Box sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: "#6366f1", fontSize: 14 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" color="#fff" fontWeight={600} fontSize={13}>
              {user?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
              {user?.role}
            </Typography>
          </Box>
        </Box>

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: "rgba(255,255,255,0.5)",
            "&:hover": { backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444" },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 14 }} />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}