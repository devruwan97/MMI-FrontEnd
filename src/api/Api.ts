export const API_BASE_URL =
  // "http://ec2-3-107-185-78.ap-southeast-2.compute.amazonaws.com:8080";
  "http://localhost:8080";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

