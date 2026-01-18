import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function CreateComment(content, id){
    try {
    const {data} = await axios.post(`${BASE_URL}/comments`, {
        content: content,
        post: id
    }, {
      headers: { token: localStorage.getItem('token') }
    });
    // console.log("Add comment data:", data);
    return data;
  } catch (error) {
    console.error("Error in postComment:", error);
    return error;
  }
}

export async function UpdateComment(body, commentId){
  try {
    const {data} = await axios.put(`${BASE_URL}/comments/${commentId}`, { content: body }, {
      headers: { token: localStorage.getItem('token') }
    });
    console.log("update comment data:", data);
    return data;
  } catch (error) {
    console.error("Error in UpdateComment:", error);
    return error;
  }
}

export async function DeleteComment(id){
    try {
    const {data} = await axios.delete(`${BASE_URL}/comments/${id}`, {
        headers: { token: localStorage.getItem('token') }
    });
    // console.log("delete comment data:", data);
    return data;
  } catch (error) {
    console.error("Error in DeleteComment:", error);
    return error;
  }
}