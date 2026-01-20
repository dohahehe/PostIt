import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react'
import { HiDotsHorizontal } from 'react-icons/hi';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { DeleteComment, UpdateComment } from '../../service/CommentApi';
import { useState } from 'react';
import toast from 'react-hot-toast';

function CommentDropDown({comment, callback}) {
  const [loading, setLoading] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  async function updateComment(e){
    e.preventDefault();
    setLoading(true);

    const response = await UpdateComment(commentBody, comment._id);
    console.log(response);

    if(response.message == 'success'){
      await callback();
      toast.success('Comment Updated!')
      setCommentBody("");
      onOpenChange(false);
    }

    setLoading(false)
  }



  async function deleteComment(){
    setLoading(true);
    const response = await DeleteComment(comment._id);
    // console.log(response);
    if (response.message == 'success') {
      await callback();
      toast.success('Comment Deleted!')
    }
    setLoading(false);
  }

  

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button variant="light" size='sm' isLoading={loading}><HiDotsHorizontal className='text-2xl text-gray-600' /></Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Action event example">
          <DropdownItem key="edit">
            <Button className='bg-transparent' onPress={onOpen} size='xs'>Edit comment</Button>
          </DropdownItem>
          <DropdownItem
          onClick={deleteComment}
          key="delete" className="text-danger" color="danger">
            {loading ? "Deleting..." : "Delete Comment"}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Edit comment</ModalHeader>
              <form onSubmit={updateComment}>
                <ModalBody>
                  <textarea 
                  value={commentBody}
                  onChange={(e) => {setCommentBody(e.target.value)}}
                  className="description rounded-xl bg-gray-100 sec p-3 h-30 border border-gray-300 outline-none" spellCheck="false" placeholder="Update your comment here" />
                  {/* preview image */}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button isLoading={loading} type='submit' color="primary">
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

export default CommentDropDown