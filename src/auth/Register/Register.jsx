// ? Conttrolled VS Unconrolled components
// ! Controlled: control its value through react, you have the value all the time
// ! Unconrolled: control its value through DOM, you only have the value when you submit

// ! using useState in controlled causes too many rerenders, useRef doesnt rerender the componenet with every change (uncontrolled)
// ! Formik controlled

import { Input, Button, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import schema from '../../schema/RegisterSchema'
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { Signup } from "../../service/RegisterApi";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import { FaUser, FaEnvelope, FaLock, FaCalendar, FaVenusMars, FaEye, FaEyeSlash } from 'react-icons/fa';

function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    
    try {
      const result = await Signup(userData);
      
      if (result.success === true) {
        toast.success('Account created successfully!');
        reset();
        
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Register - PostIt</title>
      </Helmet>
      
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-900 bg-clip-text text-transparent">
              PostIt
            </h1>
            <p className="text-gray-500 mt-2">Create your account</p>
          </div>
          
          {/* Register Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Get Started</h2>
            
            <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <Input
                  isInvalid={Boolean(errors.name)}
                  errorMessage={errors.name?.message}
                  {...register('name')}
                  placeholder="John Doe"
                  startContent={<FaUser className="text-gray-400 text-lg" />}
                  disabled={isLoading}
                  classNames={{
                    input: "text-sm",
                    inputWrapper: "rounded-xl border-gray-200 focus:border-blue-500",
                  }}
                  size="lg"
                />
              </div>
              
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  isInvalid={Boolean(errors.email)}
                  errorMessage={errors.email?.message}
                  {...register('email')}
                  placeholder="you@example.com"
                  startContent={<FaEnvelope className="text-gray-400 text-lg" />}
                  disabled={isLoading}
                  classNames={{
                    input: "text-sm",
                    inputWrapper: "rounded-xl border-gray-200 focus:border-blue-500",
                  }}
                  size="lg"
                />
              </div>
              
              {/* Password Fields Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <Input
                    isInvalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                    {...register('password')}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    startContent={<FaLock className="text-gray-400 text-lg" />}
                    endContent={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="focus:outline-none"
                      >
                        {showPassword ? (
                          <FaEye className="text-gray-400 text-lg hover:text-gray-600" />
                        ) : (
                          <FaEyeSlash className="text-gray-400 text-lg hover:text-gray-600" />
                        )}
                      </button>
                    }
                    disabled={isLoading}
                    classNames={{
                      input: "text-sm",
                      inputWrapper: "rounded-xl border-gray-200 focus:border-blue-500",
                    }}
                    size="lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <Input
                    isInvalid={Boolean(errors.rePassword)}
                    errorMessage={errors.rePassword?.message}
                    {...register('rePassword')}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    startContent={<FaLock className="text-gray-400 text-lg" />}
                    endContent={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <FaEye className="text-gray-400 text-lg hover:text-gray-600" />
                        ) : (
                          <FaEyeSlash className="text-gray-400 text-lg hover:text-gray-600" />
                        )}
                      </button>
                    }
                    disabled={isLoading}
                    classNames={{
                      input: "text-sm",
                      inputWrapper: "rounded-xl border-gray-200 focus:border-blue-500",
                    }}
                    size="lg"
                  />
                </div>
              </div>
              
              {/* Date of Birth and Gender Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <Input
                    isInvalid={Boolean(errors.dateOfBirth)}
                    errorMessage={errors.dateOfBirth?.message}
                    {...register('dateOfBirth')}
                    type="date"
                    startContent={<FaCalendar className="text-gray-400 text-lg" />}
                    disabled={isLoading}
                    classNames={{
                      input: "text-sm",
                      inputWrapper: "rounded-xl border-gray-200 focus:border-blue-500",
                    }}
                    size="lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <Select
                    isInvalid={Boolean(errors.gender)}
                    errorMessage={errors.gender?.message}
                    {...register('gender')}
                    placeholder="Select your gender"
                    startContent={<FaVenusMars className="text-gray-400 text-lg" />}
                    disabled={isLoading}
                    classNames={{
                      trigger: "rounded-xl border-gray-200",
                    }}
                    size="lg"
                  >
                    <SelectItem key="male" value="male">Male</SelectItem>
                    <SelectItem key="female" value="female">Female</SelectItem>
                  </Select>
                </div>
              </div>
              
              {/* Submit Button */}
              <Button
                type='submit'
                color="primary"
                size="lg"
                className="w-full rounded-xl font-semibold mt-4"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
              
              {/* Login Link */}
              <div className="text-center pt-2">
                <p className="text-gray-600 text-sm">
                  Already have an account?{' '}
                  <NavLink
                    to="/"
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    Sign in
                  </NavLink>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register;