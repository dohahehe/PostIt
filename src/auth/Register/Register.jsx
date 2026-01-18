import {Input, Select, SelectItem, Button} from "@heroui/react";
import { useState } from "react";
import schema from '../../schema/RegisterSchema'
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { Signup } from "../../service/RegisterApi";
import { NavLink, useNavigate } from "react-router-dom";
// ? Conttrolled VS Unconrolled components
// ! Controlled: control its value through react, you have the value all the time
// ! Unconrolled: control its value through DOM, you only have the value when you submit

// ! using useState in controlled causes too many rerenders, useRef doesnt rerender the componenet with every change (uncontrolled)

// ! Formik controlled


function Register () {
  const [message, setMessage] = useState({ text: '', type: '', show: false });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { handleSubmit, register, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      dateOfBirth: '',
      gender: '',
    },
    resolver: zodResolver(schema)
  })

  async function submitForm(userData) {
    setIsLoading(true);
    setMessage({ text: '', type: '', show: false });
    
    try {
      const result = await Signup(userData);
      console.log("API Result:", result);
      
      if (result.success === true) {
        // SUCCESS
        setMessage({ 
          text: result.message || "Registration successful!", 
          type: 'success',
          show: true
        });
        
        reset();
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
        
      } else {
        setMessage({ 
          text: result.message || "Registration failed", 
          type: 'error',
          show: true
        });
      }
      
    } catch (error) {
      console.error("Unexpected error:", error);
      setMessage({ 
        text: "An unexpected error occurred. Please try again.", 
        type: 'error',
        show: true
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className='min-h-screen w-full text-center flex justify-center items-center'>
        <div className='m-auto p-5 bg-white shadow rounded-2xl lg:w-1/3 md:w-1/2 min-w-xs'>
          <h2 className='text-2xl font-bold my-4 text-sky-700'>Register Now!</h2>
          
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
                      You will be redirected to the login page in a few seconds...
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => setMessage({ text: '', type: '', show: false })}
                  className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-gray-100 focus:outline-none"
                >
                  <span className="sr-only">Dismiss</span>
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
                isInvalid={Boolean(errors.name)}
                errorMessage={errors.name?.message}
                {...register('name')}
                label="Name" 
                type="text" 
              />
              
              <Input
                isInvalid={Boolean(errors.email)}
                errorMessage={errors.email?.message} 
                {...register('email')}
                label="Email" 
                type="email" 
              />
              
              <Input
                isInvalid={Boolean(errors.password)}
                errorMessage={errors.password?.message}
                {...register('password')} 
                label="Password" 
                type="password" 
              />
              
              <Input
                isInvalid={Boolean(errors.rePassword)}
                errorMessage={errors.rePassword?.message}
                {...register('rePassword')} 
                label="Re-Password" 
                type="password" 
              />
              
              <div className="flex gap-3">
                <Input 
                  isInvalid={Boolean(errors.dateOfBirth)}
                  errorMessage={errors.dateOfBirth?.message}
                  {...register('dateOfBirth')} 
                  label="Date of Birth" 
                  type="date" 
                />
                
                <Select
                  isInvalid={Boolean(errors.gender)}
                  errorMessage={errors.gender?.message}
                  {...register('gender')}
                  label="Select your gender"
                >
                  <SelectItem key={'male'}>Male</SelectItem>
                  <SelectItem key={'female'}>Female</SelectItem>
                </Select>
              </div>
              
              <Button 
                type='submit' 
                className="my-4" 
                color="primary" 
                variant="shadow"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Submit'}
              </Button>
              
              {/* Already have an account link */}
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{' '}
                  <NavLink 
                    to="/" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Login here
                  </NavLink>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Register;