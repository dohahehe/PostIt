import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react'
import { HiDotsHorizontal } from 'react-icons/hi'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { useState } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { DeletePost, UpdatePost } from '../../service/PostApi';

function PostDropDown({callback, postId}) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [Loading, setLoading] = useState(false);
  const [postBody, setPostBody] = useState("");
  const [postImage, setPostImage] = useState("");

  async function updatePost(e){
    e.preventDefault();
    setLoading(true);    
    
    const formData = new FormData();
    formData.append('body', postBody ?? '');
    if(postImage){
      formData.append('image', postImage);
    }

    const response = await UpdatePost(formData, postId);
    console.log(response);

    if(response.message == 'success'){
      await callback();
      setPostBody("");
      setPostImage("");
      onOpenChange(false);
    }
    setLoading(false);
  }

  function handleImage(e){
      setPostImage(e.target.files[0]);
      e.target.value = '';
  }

  async function deletePost(){
    try{
      const response = await DeletePost(postId);
      if(response.message == 'success'){
        await callback();
      }
    } catch(error){
      console.log(error); 
    }
  }

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="light" size='sm'><HiDotsHorizontal className='text-2xl text-gray-600' /></Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Action event example">
          <DropdownItem key="edit">
            <Button className='bg-transparent' onPress={onOpen} size='xs'>Edit post</Button>
          </DropdownItem>
          <DropdownItem key="delete" onPress={deletePost} className="text-danger" color="danger">
            Delete post
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>


      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Edit post</ModalHeader>
              <form onSubmit={updatePost}>
                <ModalBody>
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
                  <input onChange={handleImage} type="file" className='hidden' id={postId} />
                  {/* icons */}
                  <div className="icons flex text-gray-500 m-2">
                      <label htmlFor={postId}>
                          <svg className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                      </label>
                      <div className="count ml-auto text-gray-400 text-xs font-semibold">0/300</div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button isLoading={Loading} type='submit' color="primary">
                    Update
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
    
  )
}

export default PostDropDown