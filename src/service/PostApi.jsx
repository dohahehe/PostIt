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
    // console.log("Posts fetched successfully:", data);
    return data;
    
  } catch (error) {
    return error;
  }
}

export async function getSinglePost(id){
    try {
    const {data} = await axios.get(`${BASE_URL}/posts/${id}`, {
      headers: { token: localStorage.getItem('token') }
    });
    console.log("Single post data:", data);
    return data;
  } catch (error) {
    console.error("Error in getSinglePost:", error);
    return error;
  }
}

export async function CreateMyPost(formData){
  try {
    const {data} = await axios.post(`${BASE_URL}/posts`, formData, {
      headers: { token: localStorage.getItem('token') }
    });
    // console.log("Single post data:", data);
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
    // console.log("Single post data:", data);
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
    console.log("delete post data:", data);
    return data;
  } catch (error) {
    console.error("Error in DeleteComment:", error);
    return error;
  }
}

export async function getUserPosts(id) {
  try {
    const {data} = await axios.get(`${BASE_URL}/users/${id}/posts?`, {
        headers: {
            token: localStorage.getItem('token'),
        },
    });
    //  console.log("Posts fetched successfully:", data);
    return data;
    
  } catch (error) {
    console.log(error);
    return error;
  }
}