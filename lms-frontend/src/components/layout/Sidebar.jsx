import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Typography, Divider, Avatar,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded';
import SwapHorizontalCircleRoundedIcon from '@mui/icons-material/SwapHorizontalCircleRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { logout } from '../../features/auth/authSlice';

const SIDEBAR_WIDTH = 260;

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isAdminOrManager = user?.role === 'Admin' || user?.role === 'Manager';

  const navItems = isAdminOrManager 
    ? [
        { label: 'Overview', icon: <DashboardRoundedIcon />, path: '/admin/dashboard' },
        { label: 'Library Books', icon: <AutoStoriesRoundedIcon />, path: '/books' },
        { label: 'Borrow Logs', icon: <SwapHorizontalCircleRoundedIcon />, path: '/admin/borrows' },
      ]
    : [
        { label: 'My Portal', icon: <DashboardRoundedIcon />, path: '/student/dashboard' },
        { label: 'Browse Books', icon: <AutoStoriesRoundedIcon />, path: '/books' },
      ];

  return (
    <Drawer
      variant='permanent'
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          borderRight: 'none',
          boxShadow: '4px 0 24px rgba(0,0,0,0.05)',
        },
      }}
    >
      <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>L</Box>
        <Box>
          <Typography variant='subtitle1' fontWeight={800} sx={{ letterSpacing: -0.5, lineHeight: 1.2 }}>LMS CLOUD</Typography>
          <Typography variant='caption' sx={{ color: '#64748b', fontWeight: 600 }}>v1.0.4 - Production</Typography>
        </Box>
      </Box>

      <List sx={{ px: 2, flex: 1 }}>
        <Typography variant='caption' sx={{ px: 2, py: 1, display: 'block', color: '#475569', fontWeight: 700, textTransform: 'uppercase', fontSize: 10 }}>Menu</Typography>
        {navItems.map(({ label, icon, path }) => {
          const active = location.pathname === path;
          return (
            <ListItem key={label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(path)}
                sx={{
                  borderRadius: '12px',
                  py: 1.2,
                  backgroundColor: active ? 'rgba(99,102,241,0.1)' : 'transparent',
                  color: active ? '#818cf8' : '#94a3b8',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)', color: '#fff' },
                  transition: 'all 0.2s',
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40, '& svg': { fontSize: 20 } }}>{icon}</ListItemIcon>
                <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 500 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2, m: 2, borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <Box display='flex' alignItems='center' gap={1.5} mb={2}>
          <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(45deg, #6366f1, #a855f7)', fontSize: 14, fontWeight: 700 }}>{user?.name?.charAt(0)}</Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant='body2' fontWeight={700} noWrap>{user?.name}</Typography>
            <Typography variant='caption' sx={{ color: '#64748b', display: 'block' }}>{user?.role}</Typography>
          </Box>
        </Box>
        <ListItemButton
          onClick={() => dispatch(logout())}
          sx={{ borderRadius: '10px', color: '#f43f5e', '&:hover': { backgroundColor: 'rgba(244,63,94,0.1)' } }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}><LogoutRoundedIcon fontSize='small' /></ListItemIcon>
          <ListItemText primary='Sign Out' primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }} />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}