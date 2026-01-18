import {Button} from "@heroui/react";
import { useState } from "react";
import { CreateMyPost } from "../../service/PostApi";
import { IoIosCloseCircleOutline } from "react-icons/io";

function CreatePost({callback}) {
    const [Loading, setLoading] = useState(false);
    const [postBody, setPostBody] = useState("");
    const [postImage, setPostImage] = useState("");

    async function addPost(e){
        e.preventDefault();
        setLoading(true);
        
        const formData = new FormData();
        formData.append('body', postBody ?? '');
        if(postImage){
            formData.append('image', postImage);
        }

        const response = await CreateMyPost(formData);
        console.log(response);
        if(response.message == 'success'){
            await callback();
            setPostBody("");
            setPostImage("");
        }
        setLoading(false);
    }

    function handleImage(e){
        setPostImage(e.target.files[0]);
        e.target.value = '';
    }

    return (
        <form onSubmit={addPost} className='container px-6 lg:px-56 flex justify-center h-fit'>
                <div className="bg-white w-full rounded-2xl shadow-md h-auto py-3 px-3 my-5 flex flex-col">
                    <textarea 
                    value={postBody}
                    onChange={(e) => {setPostBody(e.target.value)}}
                    className="description rounded-xl bg-gray-100 sec p-3 h-30 border border-gray-300 outline-none" spellCheck="false" placeholder="Describe everything about this post here" />
                    {/* preview image */}
                    {postImage && 
                        <div className="previewImage relative my-2">
                            <IoIosCloseCircleOutline
                            onClick={() => setPostImage("")}
                            className="top-2 right-2 absolute text-2xl text-gray-700 hover:text-gray-800 cursor-pointer" />
                            <img className="max-h-80 w-full object-cover object-center rounded-lg" src={URL.createObjectURL(postImage)} alt="post" />
                        </div>
                    }
                    {/* image input */}
                    <input onChange={handleImage} type="file" className='hidden' id='image' />
                    {/* icons */}
                    <div className="icons flex text-gray-500 m-2">
                        <label htmlFor="image">
                            <svg className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                        </label>
                        <div className="count ml-auto text-gray-400 text-xs font-semibold">0/300</div>
                    </div>
                    {/* submit button */}
                    <div className="buttons flex justify-end">
                        <Button color="primary" variant="shadow" type='submit' isLoading={Loading} >
                            Post
                        </Button>           
                    </div>
                </div>
        </form>
    )
}

export default CreatePost