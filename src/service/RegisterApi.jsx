import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;


export async function Signup(userdata) {
    console.log("Sending data to API:", userdata);
    
    try {
        const { data } = await axios.post(`${BASE_URL}/users/signup`, userdata, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log("API Response data:", data);
        return { success: true, data, message: "Registration successful!" };
    } catch (error) {
        console.log("Full error object:", error);
        
        if (error.response?.status === 404) {
            return { 
                success: false, 
                message: "API endpoint not found. Please check the server URL.",
                error: "404 Not Found"
            };
        }
        
        return { 
            success: false, 
            message: error.response?.data?.message || 
                    error.response?.data?.error ||
                    "Registration failed. Please try again.",
            status: error.response?.status
        };
    }
}