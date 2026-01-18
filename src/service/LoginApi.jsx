import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function SignIn(userdata){
    try {
        const {data} = await axios.post(`${BASE_URL}/users/signin`, userdata);
        // console.log("Login successful:", data);
        return data;
    } catch (error) {
        console.log("Login error:", error.response?.data || error.message);
        // Return the error response data for better handling
        return error.response?.data || { 
            success: false, 
            message: "Something went wrong" 
        };
    }
}

export async function GetUserData(){
    try {
        const {data} = await axios.get(`${BASE_URL}/users/profile-data`, {
            headers: {
                token: localStorage.getItem('token')
            }
    });
        return data;
    } catch (error) {
        return error.response?.data || { 
            success: false, 
            message: "Something went wrong" 
        };
    }
}

export async function uploadProfileImage(formData) {
    try {
        const { data } = await axios.put(`${BASE_URL}/users/upload-photo`,
        formData,
        {
            headers: {
            token: localStorage.getItem('token')
            }
        }
    );
    return data;
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    throw error;
  }
}

export async function ChangePass(userdata){
    try {
        const {data} = await axios.patch(`${BASE_URL}/users/change-password`, 
            userdata,
        {
            headers: {
            token: localStorage.getItem('token')
            }
        });
        console.log("ChangePass successful:", data);
        return data;
    } catch (error) {
        console.log("ChangePass error:", error);
        // Return the full error response
        return {
            success: false,
            message: error.response?.data?.message || error.message || "Something went wrong"
        };
    }
}


