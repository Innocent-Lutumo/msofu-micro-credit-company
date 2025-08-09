import { useState, useEffect } from "react";
import { 
  fetchApplicants, 
  fetchUserProfile, 
  fetchNotifications 
} from "../services/apiService";

export const useApplicationData = () => {
  const [applicants, setApplicants] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState({
    id: 1,
    username: "Credit Officer",
    phone: "",
    national_id: "",
    total_applications: 0,
    total_approved: 0,
    total_rejected: 0,
    money_approved: "0.00",
    money_pending: "0.00",
    money_rejected: "0.00",
    passportPicture: "https://via.placeholder.com/150/4CAF50/FFFFFF?text=CO",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  // Stats calculations
  const totalApplicants = applicants.length;
  const pendingApplicants = applicants.filter(
    (applicant) => applicant.status === "pending"
  ).length;
  const acceptedApplicants = applicants.filter(
    (applicant) => applicant.status === "accepted"
  ).length;
  const rejectedApplicants = applicants.filter(
    (applicant) => applicant.status === "rejected"
  ).length;

  const loadData = async (token) => {
    try {
      setIsLoading(true);
      setIsError(false);

      // Load all data in parallel
      const [applicantsData, profileData, notificationsData] = await Promise.allSettled([
        fetchApplicants(token),
        fetchUserProfile(token),
        fetchNotifications(token),
      ]);

      // Handle applicants data
      if (applicantsData.status === "fulfilled") {
        setApplicants(applicantsData.value);
      } else if (applicantsData.reason?.message === "UNAUTHORIZED") {
        setIsUnauthorized(true);
        setIsLoading(false);
        return;
      } else {
        console.error("Failed to fetch applicants:", applicantsData.reason);
        setIsError(true);
      }

      // Handle profile data
      if (profileData.status === "fulfilled") {
        setUser(prevUser => ({
          ...prevUser,
          username: profileData.value.username || prevUser.username,
          phone: profileData.value.phone || "",
          national_id: profileData.value.national_id || "",
          total_applications: profileData.value.total_applications || 0,
          total_approved: profileData.value.total_approved || 0,
          total_rejected: profileData.value.total_rejected || 0,
          money_approved: profileData.value.money_approved || "0.00",
          money_pending: profileData.value.money_pending || "0.00",
          money_rejected: profileData.value.money_rejected || "0.00",
          passportPicture: "https://via.placeholder.com/150/4CAF50/FFFFFF?text=CO",
        }));
      } else if (profileData.reason?.message === "UNAUTHORIZED") {
        setIsUnauthorized(true);
        setIsLoading(false);
        return;
      } else {
        console.error("Failed to fetch profile:", profileData.reason);
      }

      // Handle notifications data
      if (notificationsData.status === "fulfilled") {
        setNotifications(notificationsData.value);
      } else if (notificationsData.reason?.message === "UNAUTHORIZED") {
        setIsUnauthorized(true);
        setIsLoading(false);
        return;
      } else {
        console.error("Failed to fetch notifications:", notificationsData.reason);
        setNotifications([]);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setIsError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      setIsUnauthorized(true);
      setIsLoading(false);
      return;
    }

    loadData(token);
  }, []);

  const refreshData = () => {
    const token = localStorage.getItem("access");
    if (token) {
      loadData(token);
    }
  };

  return {
    applicants,
    setApplicants,
    notifications,
    setNotifications,
    user,
    setUser,
    isLoading,
    isError,
    isUnauthorized,
    totalApplicants,
    pendingApplicants,
    acceptedApplicants,
    rejectedApplicants,
    refreshData,
  };
};
