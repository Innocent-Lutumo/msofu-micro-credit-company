import React from "react";
import {
  Box,
  Typography,
  Divider,
  IconButton,
  CardMedia,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import { drawerWidth } from "../common/themes";

const LeftSidebar = ({
  leftDrawerOpen,
  toggleLeftDrawer,
  user,
  handleProfileOpen,
  handleLogout,
  currentTheme,
}) => {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "background.paper",
        },
      }}
      variant="persistent"
      anchor="left"
      open={leftDrawerOpen}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: currentTheme.spacing(0, 1),
          ...currentTheme.mixins.toolbar,
          justifyContent: "flex-end",
        }}
      >
        <IconButton onClick={toggleLeftDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />

      {/* Profile Section */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            p: 1,
            borderRadius: 2,
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <CardMedia
            component="img"
            sx={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: "50%",
              mr: 2,
            }}
            image={user.passportPicture}
            alt="Profile"
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="body1"
              sx={{
                color: currentTheme.palette.text.primary,
                fontWeight: "medium",
              }}
            >
              {user.username}
            </Typography>
          </Box>
          <IconButton
            onClick={handleProfileOpen}
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Analytics" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default LeftSidebar;
