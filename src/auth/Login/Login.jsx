import { Input, Button } from "@heroui/react";
import { useContext, useState } from "react";
import schema from '../../schema/LoginSchema'
import { useForm } from "react-hook-form"
import { SignIn } from "../../service/LoginApi";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { zodResolver } from '@hookform/resolvers/zod';
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  let { setUserToken } = useContext(AuthContext);

  const { handleSubmit, register, formState: { errors, touchedFields } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(schema)
  })

  async function submitForm(userData) {
    setIsLoading(true);
    try {
      const result = await SignIn(userData);
      
      if (result.success === true || result.token) {
        toast.success('Welcome back!');
        
        if (result.data.token) {
          localStorage.setItem('token', result.data.token);
          localStorage.setItem('user', JSON.stringify(result.data.user || {}));
          setUserToken(result.data.token);
        }
        
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } else {
        toast.error(result.message || "Invalid email or password");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Login - PostIt</title>
      </Helmet>
      
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-900 bg-clip-text text-transparent">
              PostIt
            </h1>
            <p className="text-gray-500 mt-2">Sign in to your account</p>
          </div>
          
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Welcome Back</h2>
            
            <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  isInvalid={Boolean(errors.email && touchedFields?.email)}
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
              
              {/* Password Field with Visibility Toggle */}
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
              
              {/* Submit Button */}
              <Button
                type='submit'
                color="primary"
                size="lg"
                className="w-full rounded-xl font-semibold mt-2"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              
              {/* Register Link */}
              <div className="text-center pt-4">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{' '}
                  <NavLink
                    to="/register"
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    Create account
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

export default Login;