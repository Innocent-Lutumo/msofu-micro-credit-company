import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";

const ConversationDialog = ({
  open,
  onClose,
  conversationHistory,
  conversationParticipants,
  currentReplyUser,
  replyMessage,
  setReplyMessage,
  onSendReply,
  user,
  currentTheme,
}) => {
  // Auto-scroll to bottom when conversation history changes
  useEffect(() => {
    if (open && conversationHistory.length > 0) {
      setTimeout(() => {
        const conversationContent = document.getElementById("conversation-content");
        if (conversationContent) {
          conversationContent.scrollTop = conversationContent.scrollHeight;
        }
      }, 100);
    }
  }, [conversationHistory, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "primary.main",
          color: "white",
          py: 1.5,
        }}
      >
        <IconButton onClick={onClose} sx={{ mr: 1, color: "white" }}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {conversationParticipants.otherUser?.username ||
              currentReplyUser ||
              "Applicant"}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {conversationParticipants.otherUser?.phone || "Phone not available"}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent
        id="conversation-content"
        sx={{
          p: 0,
          height: "400px",
          overflow: "auto",
          bgcolor: currentTheme.palette.mode === "dark" ? "#1a1a1a" : "#f5f5f5",
        }}
      >
        <Box sx={{ p: 2 }}>
          {conversationHistory.length > 0 ? (
            conversationHistory.map((msg, index) => {
              const isFromCurrentUser = String(msg.sender) === String(user.id);
              const isConsecutive =
                index > 0 &&
                String(conversationHistory[index - 1].sender) === String(msg.sender);

              return (
                <Box
                  key={`${msg.id}-${index}`}
                  sx={{
                    display: "flex",
                    justifyContent: isFromCurrentUser ? "flex-end" : "flex-start",
                    mb: isConsecutive ? 0.5 : 2,
                    alignItems: "flex-end",
                  }}
                >
                  {!isFromCurrentUser && !isConsecutive && (
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        mr: 1,
                        bgcolor: "primary.main",
                        fontSize: "0.8rem",
                      }}
                    >
                      {(msg.sender_username || "U").charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                  {!isFromCurrentUser && isConsecutive && (
                    <Box sx={{ width: 32, mr: 1 }} />
                  )}
                  <Box
                    sx={{
                      maxWidth: "70%",
                      bgcolor: isFromCurrentUser
                        ? "primary.main"
                        : currentTheme.palette.mode === "dark"
                        ? "#333"
                        : "white",
                      color: isFromCurrentUser
                        ? "white"
                        : currentTheme.palette.text.primary,
                      p: 1.5,
                      borderRadius: 2,
                      borderBottomRightRadius: isFromCurrentUser ? 0.5 : 2,
                      borderBottomLeftRadius: isFromCurrentUser ? 2 : 0.5,
                      boxShadow: 1,
                    }}
                  >
                    {!isConsecutive && !isFromCurrentUser && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: "bold",
                          display: "block",
                          mb: 0.5,
                          opacity: 0.8,
                        }}
                      >
                        {msg.sender_username || "Unknown User"}
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        wordBreak: "break-word",
                        lineHeight: 1.4,
                      }}
                    >
                      {msg.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mt: 0.5,
                        opacity: 0.7,
                        fontSize: "0.7rem",
                        textAlign: isFromCurrentUser ? "right" : "left",
                      }}
                    >
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
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
              <Typography variant="body2">
                Start a conversation by sending a message.
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            gap: 1,
            alignItems: "flex-end",
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Type your message..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSendReply();
              }
            }}
            sx={{
              flexGrow: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                bgcolor: "background.paper",
                "& fieldset": {
                  borderColor: currentTheme.palette.divider,
                },
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />
          <IconButton
            onClick={onSendReply}
            disabled={!replyMessage.trim()}
            sx={{
              bgcolor: replyMessage.trim() ? "primary.main" : "grey.300",
              color: replyMessage.trim() ? "white" : "grey.500",
              "&:hover": {
                bgcolor: replyMessage.trim() ? "primary.dark" : "grey.400",
              },
              "&.Mui-disabled": {
                bgcolor: "grey.300",
                color: "grey.500",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ConversationDialog;
