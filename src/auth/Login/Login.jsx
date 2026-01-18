import {Input, Select, SelectItem, Button} from "@heroui/react";
import { useContext, useState } from "react";
import schema from '../../schema/LoginSchema'
import { useForm } from "react-hook-form"
import { SignIn } from "../../service/LoginApi";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { zodResolver } from '@hookform/resolvers/zod';


// ? Conttrolled VS Unconrolled components
// ! Controlled: control its value through react, you have the value all the time
// ! Unconrolled: control its value through DOM, you only have the value when you submit

// ! using useState in controlled causes too many rerenders, useRef doesnt rerender the componenet with every change (uncontrolled)

// ! Formik controlled


function Login() {
  const [message, setMessage] = useState({ text: '', type: '', show: false });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate
  let {setUserToken} =  useContext(AuthContext);

  const { handleSubmit, register, formState: { errors, touchedFields } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(schema)
  })

  async function submitForm(userData) {
    setIsLoading(true);
    setMessage({ text: '', type: '', show: false });
    // console.log('Login attempt:', userData);
      try {
      const result = await SignIn(userData);
      // console.log('Login result:', result);
      
      if (result.success === true || result.token) {
        // Login successful
        setMessage({ 
          text: result.message || "Login successful!", 
          type: 'success',
          show: true 
        });
        
        // Save token to localStorage & context
        if (result.token) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user || {}));
          setUserToken(result.token);
        }
        
        // Redirect to home
        setTimeout(() => {
          navigate('/home'); 
        }, 2000);
        
      } else {
        // Login failed
        setMessage({ 
          text: result.message || "Invalid email or password", 
          type: 'error',
          show: true 
        });
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setMessage({ 
        text: "Network error. Please try again.", 
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
          <h2 className='text-2xl font-bold my-4 text-sky-700'>Login</h2>
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
                      Redirecting to home page...
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
              isInvalid={Boolean(errors.email && touchedFields?.email)}
              errorMessage={errors.email?.message} 
              {...register('email' ,
              
              )} label="Email" type="email" disabled={isLoading}/>
              {/* <p className="text-red-900 text-left">{errors.email?.message}</p> */}
              <Input
              isInvalid={Boolean(errors.password)}
              errorMessage={errors.password?.message}
              {...register('password')} label="Password" type="password" disabled={isLoading}/>
              
              <Button type='submit' className="my-4" color="primary" variant="shadow" isLoading={isLoading}
                disabled={isLoading}>
                 {isLoading ? 'Logging in...' : 'Login'}
              </Button>
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{' '}
                  <NavLink
                    to="/register" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Register here
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

export default Login