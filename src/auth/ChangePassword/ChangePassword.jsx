import {Input, Select, SelectItem, Button} from "@heroui/react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { ChangePass } from "../../service/LoginApi";
import { NavLink, useNavigate } from "react-router-dom";
import schema from "../../schema/ChangePassSchema";
import { zodResolver } from '@hookform/resolvers/zod';
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";

function ChangePassword() {
    const [message, setMessage] = useState({ text: '', type: '', show: false });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); // Initialize navigate

    const { handleSubmit, register, formState: { errors, touchedFields } } = useForm({
    defaultValues: {
      password: '',
      newPassword: '',
    },
    resolver: zodResolver(schema)
    })

    async function submitForm(userData) {
      setIsLoading(true);
      setMessage({ text: '', type: '', show: false });
      console.log('Submitting:', userData); 

      try {
          const result = await ChangePass(userData);
          console.log('change pass result:', result);
          
          // Check for success
          if (result.message === 'success') {
            toast.success('Password Changed Successfully!')

            setMessage({ 
              text: "Password changed successfully!", 
              type: 'success',
              show: true 
            });
            
            // Redirect to home after success
            setTimeout(() => {
              navigate('/'); 
            }, 2000);
            
          } else {
            // Password change failed
            setMessage({ 
              text: result.message || "Failed to change password", 
              type: 'error',
              show: true 
            });
          }
          
      } catch (error) {
        console.error('Password change error:', error);
        setMessage({ 
          text: error.message || "Network error. Please try again.", 
          type: 'error',
          show: true 
        });
      } finally {
        setIsLoading(false);
      }

    }
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Change Password</title>
      </Helmet>
      <div className='min-h-screen w-full text-center flex justify-center items-center'>
        <div className='m-auto p-5 bg-white shadow rounded-2xl lg:w-1/3 md:w-1/2 min-w-xs'>
          <h2 className='text-2xl font-bold my-4 text-sky-700'>Re-set Password</h2>
          {/* Message Display */}
          {message.show && (
            <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-start">
                {message.type === 'success' ? (
                  <div className="shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className="shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium">
                    {message.type === 'success' ? 'Success!' : 'Error!'}
                  </p>
                  <p className="mt-1 text-sm">{message.text}</p>
                  
                  {message.type === 'success' && (
                    <p className="mt-2 text-xs text-green-600">
                      Redirecting back to login...
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => setMessage({ text: '', type: '', show: false })}
                  className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-gray-100 focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="flex flex-col gap-4">
              <Input
              isInvalid={Boolean(errors.password && touchedFields?.password)}
              errorMessage={errors.password?.message} 
              {...register('password' ,
              
              )} label="Old Password" type="password" disabled={isLoading}/>
              {/* <p className="text-red-900 text-left">{errors.password?.message}</p> */}

              <Input
              isInvalid={Boolean(errors.newPassword)}
              errorMessage={errors.newPassword?.message}
              {...register('newPassword')} label="New Password" type="password" disabled={isLoading}/>

              <Button type='submit' className="my-4" color="primary" variant="shadow" isLoading={isLoading}
                disabled={isLoading}>
                 {isLoading ? 'Changing...' : 'Change Password'}
              </Button>
               
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default ChangePassword