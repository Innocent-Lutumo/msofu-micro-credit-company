import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";

const TableFilters = ({ filterStatus, setFilterStatus, applicants }) => {
  const getStatusCount = (status) => {
    if (status === "all") return applicants.length;
    return applicants.filter((app) => app.status === status).length;
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 2,
        flexWrap: "wrap",
      }}
    >
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Filter by Status</InputLabel>
        <Select
          value={filterStatus}
          label="Filter by Status"
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <MenuItem value="all">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              All Applications
              <Chip
                label={getStatusCount("all")}
                size="small"
                color="default"
              />
            </Box>
          </MenuItem>
          <MenuItem value="pending">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              Pending
              <Chip
                label={getStatusCount("pending")}
                size="small"
                color="warning"
              />
            </Box>
          </MenuItem>
          <MenuItem value="accepted">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              Accepted
              <Chip
                label={getStatusCount("accepted")}
                size="small"
                color="success"
              />
            </Box>
          </MenuItem>
          <MenuItem value="rejected">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              Rejected
              <Chip
                label={getStatusCount("rejected")}
                size="small"
                color="error"
              />
            </Box>
          </MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Chip
          label={`Total: ${getStatusCount("all")}`}
          color="default"
          variant="outlined"
        />
        <Chip
          label={`Pending: ${getStatusCount("pending")}`}
          color="warning"
          variant="outlined"
        />
        <Chip
          label={`Accepted: ${getStatusCount("accepted")}`}
          color="success"
          variant="outlined"
        />
        <Chip
          label={`Rejected: ${getStatusCount("rejected")}`}
          color="error"
          variant="outlined"
        />
      </Box>
    </Box>
  );
};

export default TableFilters;
