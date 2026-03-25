import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function GetPostComments(postId, page = 1, limit = 10) {
    try {
        const { data } = await axios.get(
            `${BASE_URL}/posts/${postId}/comments`,
            {
                params: {
                    page: page,
                    limit: limit
                },
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return data;
    } catch (error) {
        console.error("Error in GetPostComments:", error);
        return error;
    }
}

export async function CreateComment(content, postId, imageFile = null){
    try {
        const formData = new FormData();
        formData.append('content', content);
        
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        const {data} = await axios.post(
            `${BASE_URL}/posts/${postId}/comments`, 
            formData,
            {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        
        return data;
    } catch (error) {
        console.error("Error in CreateComment:", error);
        return error;
    }
}

// Updated UpdateComment with correct endpoint
export async function UpdateComment(content, postId, commentId, imageFile = null){
    try {
        const formData = new FormData();
        formData.append('content', content);
        
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        const {data} = await axios.put(
            `${BASE_URL}/posts/${postId}/comments/${commentId}`, 
            formData,
            {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        console.log("Update comment response:", data);
        return data;
    } catch (error) {
        console.error("Error in UpdateComment:", error);
        return error;
    }
}

// Updated DeleteComment with correct endpoint
export async function DeleteComment(postId, commentId){
    try {
        const {data} = await axios.delete(
            `${BASE_URL}/posts/${postId}/comments/${commentId}`,
            {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        console.log("Delete comment response:", data);
        return data;
    } catch (error) {
        console.error("Error in DeleteComment:", error);
        return error;
    }
}

// New LikeComment function
export async function LikeComment(postId, commentId){
    try {
        const {data} = await axios.put(
            `${BASE_URL}/posts/${postId}/comments/${commentId}/like`,
            {},
            {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        // console.log("Like comment response:", data);
        return data;
    } catch (error) {
        console.error("Error in LikeComment:", error);
        return error;
    }
}

export async function GetCommentReplies(postId, commentId, page = 1, limit = 10) {
    try {
        if (!postId || !commentId) {
            console.error("Missing postId or commentId:", { postId, commentId });
            return { message: "Missing postId or commentId", success: false };
        }
        
        const { data } = await axios.get(
            `${BASE_URL}/posts/${postId}/comments/${commentId}/replies`,
            {
                params: {
                    page: page,
                    limit: limit
                },
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        // console.log("Get replies response:", data);
        return data;
    } catch (error) {
        console.error("Error in GetCommentReplies:", error);
        return error.response?.data || { message: "Failed to get replies", success: false };
    }
}

export async function CreateReply(postId, commentId, content, imageFile = null) {
    try {
        if (!postId || !commentId) {
            console.error("Missing postId or commentId:", { postId, commentId });
            return { message: "Missing postId or commentId", success: false };
        }
        
        const formData = new FormData();
        formData.append('content', content);
        
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        const { data } = await axios.post(
            `${BASE_URL}/posts/${postId}/comments/${commentId}/replies`,
            formData,
            {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        // console.log("Create reply response:", data);
        return data;
    } catch (error) {
        console.error("Error in CreateReply:", error);
        return error.response?.data || { message: "Failed to create reply", success: false };
    }
}