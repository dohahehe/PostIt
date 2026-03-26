import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getAllPosts() {
  try {
    const {data} = await axios.get(`${BASE_URL}/posts?limit=50`, {
        headers: {
            token: localStorage.getItem('token'),
        },
        params:{
          limit: 15,
          sort: '-createdAt'
        }
    });
    return data;
  } catch (error) {
    return error;
  }
}

export async function getHomeFeed(limit = 10, cursor = null) {
  try {
    const params = {
      only: 'following',
      limit: limit
    };
    
    if (cursor) {
      params.cursor = cursor;
    }
    
    const {data} = await axios.get(`${BASE_URL}/posts/feed`, {
        headers: {
            token: localStorage.getItem('token'),
        },
        params: params
    });
    return data;
  } catch (error) {
    console.error("Error in getHomeFeed:", error);
    throw error;
  }
}

export async function getSinglePost(id){
    try {
    const {data} = await axios.get(`${BASE_URL}/posts/${id}`, {
      headers: { token: localStorage.getItem('token') }
    });
    // console.log("Single post data:", data);
    return data;
  } catch (error) {
    console.error("Error in getSinglePost:", error);
    return error;
  }
}

export async function CreateMyPost(formData){
  try {
    const {data} = await axios.post(`${BASE_URL}/posts`, formData, {
      headers: { 
        token: localStorage.getItem('token'),
        'Content-Type': 'multipart/form-data' 
      }
    });
    // console.log("Post created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in CreateMyPost:", error);
    return error;
  }
}

export async function UpdatePost(formData, postId){
  try {
    const {data} = await axios.put(`${BASE_URL}/posts/${postId}`, formData, {
      headers: { token: localStorage.getItem('token') }
    });
    return data;
  } catch (error) {
    console.error("Error in UpdatePost:", error);
    return error;
  }
}

export async function DeletePost(id){
    try {
    const {data} = await axios.delete(`${BASE_URL}/posts/${id}`, {
        headers: { token: localStorage.getItem('token') }
    });
    // console.log("delete post data:", data);
    return data;
  } catch (error) {
    console.error("Error in DeleteComment:", error);
    return error;
  }
}

export async function getUserPosts(id) {
  try {
    const {data} = await axios.get(`${BASE_URL}/users/${id}/posts`, {
        headers: {
            token: localStorage.getItem('token'),
        },
    });
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

// New Functions for Post Interactions

export async function LikePost(postId) {
  try {
    const {data} = await axios.put(`${BASE_URL}/posts/${postId}/like`, {}, {
      headers: { 
        token: localStorage.getItem('token')
      }
    });
    // console.log("Like/Unlike response:", data);
    return data;
  } catch (error) {
    console.error("Error in LikePost:", error);
    return error;
  }
}

export async function BookmarkPost(postId) {
  try {
    const {data} = await axios.put(`${BASE_URL}/posts/${postId}/bookmark`, {}, {
      headers: { 
        token: localStorage.getItem('token')
      }
    });
    // console.log("Bookmark/Unbookmark response:", data);
    return data;
  } catch (error) {
    console.error("Error in BookmarkPost:", error);
    return error;
  }
}

export async function SharePost(postId, shareBody) {
  try {
    const {data} = await axios.post(`${BASE_URL}/posts/${postId}/share`, {
      body: shareBody
    }, {
      headers: { 
        token: localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    });
    // console.log("Share post response:", data);
    return data;
  } catch (error) {
    console.error("Error in SharePost:", error);
    return error;
  }
}

export async function getBookmarks() {
  try {
    const { data } = await axios.get(`${BASE_URL}/users/bookmarks`, {
      headers: {
        token: localStorage.getItem('token'),
      }
    });
    return data;
  } catch (error) {
    console.error("Error in getBookmarks:", error);
    throw error;
  }
}