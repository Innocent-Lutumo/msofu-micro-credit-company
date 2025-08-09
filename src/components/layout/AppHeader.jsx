import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Badge,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Brightness2Icon from "@mui/icons-material/Brightness2";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { drawerWidth } from "../common/themes";

const AppHeader = ({
  leftDrawerOpen,
  toggleLeftDrawer,
  toggleRightDrawer,
  toggleDarkMode,
  mode,
  searchTerm,
  handleSearch,
  notifications,
  readNotifications,
  currentTheme,
}) => {
  const unreadCount = notifications.filter(
    (note) => !readNotifications.has(note.id)
  ).length;

  return (
    <AppBar
      position="fixed"
      sx={{
        width: leftDrawerOpen
          ? `calc(100% - ${drawerWidth}px)`
          : "100%",
        ml: leftDrawerOpen ? `${drawerWidth}px` : 0,
        transition: "width 0.3s, margin 0.3s",
        bgcolor: "headerGreen.main",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleLeftDrawer}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Loan Management System
        </Typography>
        <Box
          sx={{
            position: "relative",
            borderRadius: currentTheme.shape.borderRadius,
            bgcolor: "rgba(255, 255, 255, 0.15)",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.25)",
            },
            marginRight: 2,
            marginLeft: 0,
            width: "100%",
            maxWidth: "300px",
          }}
        >
          <Box
            sx={{
              padding: currentTheme.spacing(0, 2),
              height: "100%",
              position: "absolute",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SearchIcon />
          </Box>
          <InputBase
            placeholder="Search applicants..."
            value={searchTerm}
            onChange={handleSearch}
            sx={{
              color: "inherit",
              "& .MuiInputBase-input": {
                padding: currentTheme.spacing(1, 1, 1, 0),
                paddingLeft: `calc(1em + ${currentTheme.spacing(4)})`,
                transition: currentTheme.transitions.create("width"),
                width: "100%",
              },
            }}
          />
        </Box>
        <IconButton color="inherit" onClick={toggleDarkMode}>
          {mode === "dark" ? <WbSunnyIcon /> : <Brightness2Icon />}
        </IconButton>
        <IconButton color="inherit" onClick={toggleRightDrawer}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
