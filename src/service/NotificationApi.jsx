import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getNotifications(unread = false, page = 1, limit = 10) {
  try {
    const { data } = await axios.get(`${BASE_URL}/notifications`, {
      headers: {
        token: localStorage.getItem('token'),
      },
      params: {
        unread,
        page,
        limit
      }
    });
    return data;
  } catch (error) {
    console.error("Error in getNotifications:", error);
    throw error;
  }
}

export async function getUnreadCount() {
  try {
    const { data } = await axios.get(`${BASE_URL}/notifications/unread-count`, {
      headers: {
        token: localStorage.getItem('token'),
      }
    });
    return data;
  } catch (error) {
    console.error("Error in getUnreadCount:", error);
    throw error;
  }
}

export async function markNotificationAsRead(notificationId) {
  try {
    const { data } = await axios.patch(`${BASE_URL}/notifications/${notificationId}/read`, {}, {
      headers: {
        token: localStorage.getItem('token'),
      }
    });
    return data;
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error);
    throw error;
  }
}

export async function markAllAsRead() {
  try {
    const { data } = await axios.patch(`${BASE_URL}/notifications/read-all`, {}, {
      headers: {
        token: localStorage.getItem('token'),
      }
    });
    return data;
  } catch (error) {
    console.error("Error in markAllAsRead:", error);
    throw error;
  }
}