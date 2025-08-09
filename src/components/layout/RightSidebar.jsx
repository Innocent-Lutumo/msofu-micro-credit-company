import React from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatIcon from "@mui/icons-material/Chat";
import { drawerWidthRight } from "../common/themes";

const RightSidebar = ({
  rightDrawerOpen,
  notifications,
  readNotifications,
  user,
  onNotificationClick,
  onMarkAllAsRead,
  onDeleteNotification,
  currentTheme,
}) => {
  return (
    <Box
      sx={{
        width: rightDrawerOpen ? drawerWidthRight : 0,
        bgcolor: "background.paper",
        p: rightDrawerOpen ? 2 : 0,
        borderLeft: rightDrawerOpen ? "1px solid #333" : "none",
        position: "fixed",
        right: 0,
        top: 0,
        height: "100vh",
        overflow: "auto",
        zIndex: 1200,
        transition: "width 0.3s, padding 0.3s",
        whiteSpace: "nowrap",
      }}
    >
      {rightDrawerOpen && (
        <>
          <Box sx={{ mt: 10 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: currentTheme.palette.text.primary }}
              >
                Notifications
              </Typography>
              {notifications.filter((note) => !readNotifications.has(note.id))
                .length > 0 && (
                <Button
                  size="small"
                  onClick={onMarkAllAsRead}
                  sx={{
                    fontSize: "0.7rem",
                    minWidth: "auto",
                    px: 1,
                    py: 0.5,
                  }}
                >
                  Mark All Read
                </Button>
              )}
            </Box>
            <Divider sx={{ mb: 2 }} />
            {notifications.length > 0 ? (
              notifications.map((note) => {
                // Determine if this message was sent by the current user
                const isFromCurrentUser = String(note.sender) === String(user.id);
                const senderDisplayName = isFromCurrentUser
                  ? "You"
                  : note.sender_username || "Unknown";

                return (
                  <Box
                    key={note.id}
                    sx={{
                      mb: 1,
                      p: 1,
                      bgcolor: readNotifications.has(note.id)
                        ? "action.hover"
                        : "primary.light",
                      borderRadius: 1,
                      cursor: "pointer",
                      border: readNotifications.has(note.id)
                        ? "none"
                        : "2px solid",
                      borderColor: readNotifications.has(note.id)
                        ? "transparent"
                        : "primary.main",
                      opacity: readNotifications.has(note.id) ? 0.7 : 1,
                      position: "relative",
                      "&:hover .delete-button": {
                        opacity: 1,
                      },
                    }}
                    onClick={() => onNotificationClick(note)}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box sx={{ flexGrow: 1, pr: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 0.5,
                          }}
                        >
                          <ChatIcon
                            sx={{
                              fontSize: 16,
                              mr: 0.5,
                              color: currentTheme.palette.text.secondary,
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: "bold",
                              color: currentTheme.palette.text.primary,
                            }}
                          >
                            {senderDisplayName}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: currentTheme.palette.text.primary,
                            fontSize: "0.85rem",
                            lineHeight: 1.3,
                            wordBreak: "break-word",
                          }}
                        >
                          {note.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: currentTheme.palette.text.secondary,
                            fontSize: "0.7rem",
                            mt: 0.5,
                            display: "block",
                          }}
                        >
                          {new Date(note.created_at).toLocaleString()}
                        </Typography>
                      </Box>
                      <Tooltip title="Delete message">
                        <IconButton
                          className="delete-button"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNotification(note);
                          }}
                          sx={{
                            opacity: 0,
                            transition: "opacity 0.2s",
                            color: "error.main",
                            "&:hover": {
                              bgcolor: "error.light",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  py: 4,
                  color: currentTheme.palette.text.secondary,
                }}
              >
                <ChatIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography variant="body2">No notifications found.</Typography>
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default RightSidebar;
