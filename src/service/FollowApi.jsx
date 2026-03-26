import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getFollowSuggestions(limit = 5) {
  try {
    const { data } = await axios.get(`${BASE_URL}/users/suggestions?limit=10`, {
      headers: {
        token: localStorage.getItem('token'),
      }
    });
    return data;
  } catch (error) {
    console.error("Error in getFollowSuggestions:", error);
    throw error;
  }
}

export async function followUser(userId) {
  try {
    const { data } = await axios.put(`${BASE_URL}/users/${userId}/follow`, {}, {
      headers: {
        token: localStorage.getItem('token'),
      }
    });
    return data;
  } catch (error) {
    console.error("Error in followUser:", error);
    throw error;
  }
}