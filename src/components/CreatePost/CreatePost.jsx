import { Button } from "@heroui/react";
import { useState } from "react";
import { CreateMyPost } from "../../service/PostApi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

function CreatePost({ callback }) {
    const [Loading, setLoading] = useState(false);
    const [postBody, setPostBody] = useState("");
    const [postImage, setPostImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [charCount, setCharCount] = useState(0);
    const maxChars = 300;
    const queryClient = useQueryClient();

    async function addPost(e) {
        e.preventDefault();
        
        // Validate post body
        if (!postBody.trim()) {
            toast.error("Please write something before posting");
            return;
        }
        
        setLoading(true);
        
        const formData = new FormData();
        formData.append('body', postBody.trim());
        
        if (postImage) {
            // Validate image size (max 5MB)
            if (postImage.size > 5 * 1024 * 1024) {
                toast.error("Image must be less than 5MB");
                setLoading(false);
                return;
            }
            formData.append('image', postImage);
        }

        try {
            const response = await CreateMyPost(formData);
            
            if (response?.success === true) {
                toast.success('Posted successfully!');
                
                // Reset form immediately
                setPostBody("");
                setPostImage(null);
                setImagePreview(null);
                setCharCount(0);

                queryClient.invalidateQueries({ queryKey: ['posts'] });
                queryClient.invalidateQueries({ queryKey: ['explore-posts'] });
                queryClient.invalidateQueries({ queryKey: ['home-feed'] });
                queryClient.invalidateQueries({ queryKey: ['userPosts'] });

                // Call callback only if it exists and is a function
                if (callback && typeof callback === 'function') {
                    await callback();
                }
            } else {
                // Handle API error response
                const errorMessage = response?.data?.message || response?.message || "Failed to create post";
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Failed to create post. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    function handleImage(e) {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file");
                return;
            }
            
            // Check file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image must be less than 5MB");
                return;
            }
            
            setPostImage(file);
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
        e.target.value = ''; 
    }

    const removeImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setPostImage(null);
        setImagePreview(null);
    };

    const handleBodyChange = (e) => {
        const text = e.target.value;
        if (text.length <= maxChars) {
            setPostBody(text);
            setCharCount(text.length);
        }
    };

    return (
        <form onSubmit={addPost} className='w-full flex justify-center h-fit'>
            <div className="bg-white w-full rounded-2xl shadow-md h-auto py-3 px-3 mb-5 flex flex-col">
                <textarea 
                    value={postBody}
                    onChange={handleBodyChange}
                    className="description rounded-xl bg-gray-100 p-3 h-30 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                    spellCheck="false"
                    placeholder="Describe everything about this post here"
                    disabled={Loading}
                />
                
                {/* Image Preview */}
                {imagePreview && (
                    <div className="previewImage relative my-2">
                        <IoIosCloseCircleOutline
                            onClick={removeImage}
                            className="top-2 right-2 absolute text-2xl text-gray-700 hover:text-gray-800 cursor-pointer bg-white rounded-full"
                        />
                        <img 
                            className="max-h-80 w-full object-cover rounded-lg" 
                            src={imagePreview} 
                            alt="Post preview" 
                        />
                    </div>
                )}
                
                {/* Image Input */}
                <input onChange={handleImage} type="file" accept="image/*" className='hidden' id='image' />
                
                {/* Icons and Counter */}
                <div className="icons flex text-gray-500 m-2 items-center">
                    <label htmlFor="image" className="cursor-pointer">
                        <svg className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </label>
                    <div className="count ml-auto text-gray-400 text-xs font-semibold">
                        {charCount}/{maxChars}
                    </div>
                </div>
                
                {/* Submit Button */}
                <div className="buttons flex justify-end">
                    <Button 
                        color="primary" 
                        variant="shadow" 
                        type='submit' 
                        isLoading={Loading}
                        disabled={!postBody.trim() && !postImage}
                    >
                        Post
                    </Button>           
                </div>
            </div>
        </form>
    )
}

export default CreatePost