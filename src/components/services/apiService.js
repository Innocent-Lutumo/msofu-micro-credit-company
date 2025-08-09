import { API_BASE_URL } from "../common/constants";

// Centralized CSRF token retrieval function
export const getCSRFToken = async () => {
  // Try multiple methods to get CSRF token
  let csrfToken = 
    document.querySelector("[name=csrfmiddlewaretoken]")?.value ||
    document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];

  // If no token found, try to fetch it from the backend
  if (!csrfToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/csrf/`, {
        method: "GET",
        credentials: "include", // Important for CSRF cookies
      });
      if (response.ok) {
        const data = await response.json();
        csrfToken = data.csrfToken;
        // Update meta tag for future use
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        if (metaTag) {
          metaTag.setAttribute('content', csrfToken);
        }
      }
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
    }
  }

  return csrfToken;
};

export const fetchApplicants = async (token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/loan-applications/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch applicants:", error);
    throw error;
  }
};

export const fetchUserProfile = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/profile/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const profileData = await response.json();
    return profileData;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
};

export const fetchNotifications = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Ensure data is an array and normalize it
    if (!Array.isArray(data)) {
      console.error("Expected array but got:", typeof data, data);
      return [];
    }

    // Normalize notification data to match backend fields exactly
    const normalizedNotifications = data.map((notification) => ({
      ...notification,
      // Ensure IDs are consistently handled as numbers for comparison
      id: Number(notification.id),
      sender: Number(notification.sender),
      receiver: Number(notification.receiver),
      // Backend provides these fields automatically
      sender_username: notification.sender_username || "Unknown User",
      receiver_username: notification.receiver_username || "Unknown User",
      // Use created_at as the timestamp (backend field)
      timestamp: notification.created_at,
      // Keep original fields
      created_at: notification.created_at,
      is_read: notification.is_read || false,
    }));

    return normalizedNotifications;
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    throw error;
  }
};

export const updateApplicationStatus = async (id, newStatus) => {
  const token = localStorage.getItem("access");
  if (!token) {
    throw new Error("Authentication required");
  }

  try {
    console.log(`Updating status for applicant ${id} to ${newStatus}`);

    // Get CSRF token using centralized function
    const csrfToken = await getCSRFToken();

    const response = await fetch(
      `${API_BASE_URL}/api/admin/loan-applications/${id}/status/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch (parseError) {
        console.error("Error parsing error response:", parseError);
      }
      throw new Error(errorMessage);
    }

    const updatedApplicant = await response.json();
    console.log("Status updated successfully:", updatedApplicant);
    return updatedApplicant;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};

export const deleteApplication = async (id) => {
  const token = localStorage.getItem("access");
  if (!token) {
    throw new Error("Authentication required");
  }

  // Get CSRF token using centralized function
  const csrfToken = await getCSRFToken();

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/loan-applications/${id}/delete/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CSRFToken": csrfToken,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting applicant:", error);
    throw error;
  }
};

export const sendNotification = async (messageData) => {
  const token = localStorage.getItem("access");
  if (!token) {
    throw new Error("Authentication required");
  }

  // Get CSRF token using centralized function
  const csrfToken = await getCSRFToken();

  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newMessage = await response.json();
    return newMessage;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

export const deleteNotification = async (notificationId) => {
  const token = localStorage.getItem("access");
  if (!token) {
    throw new Error("Authentication required");
  }

  // Get CSRF token using centralized function
  const csrfToken = await getCSRFToken();

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/${notificationId}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CSRFToken": csrfToken,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};
