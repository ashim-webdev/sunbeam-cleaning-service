import { useEffect, useState } from 'react'
import React from 'react'
import { toast } from 'sonner'
import Lottie from 'lottie-react'
import SuccessLogIn from '../LottieFiles/SuccessLogIn.json'
import ErrorLogIn from '../LottieFiles/ErrorLogIn.json'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Textbox from '../components/Textbox'
import Button from '../components/button'

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  
  // Shake Animation for Form errors
  const [shake, setShake] = useState(false)
  const [swap, setSwap] = useState(false)


  const handleErrorAnimation = () => {
    setShake(true)
    setSwap(true)
    setTimeout(() => {
      setShake(false)
    }, 1000);
  }

  const onError = (errors) => {
    if (!errors.password) {
      setSwap(false)
    }
    if (errors.email && errors.password) {
      handleErrorAnimation();
      toast.error("Please fill in all required fields")
    } else {
      if (errors.email) {
        handleErrorAnimation();
        toast.error("Oops! Please enter your email.")
      }
      if (errors.password) {
        handleErrorAnimation();
        toast.error("Oops! Please enter your password.")
      }
    }
  }
  // END


  // Form Handling
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm()

  const submitHandler = () => {
    console.log("submit")
  }

  const navigate = useNavigate()

  // useEffect(() => {
  //   user && navigate('/dashboard')
  // }, [user]);

  
  return (
    <div className='Login w-full min-h-screen flex items-center justify-center flex-col lg:flex-row'>
      <div className='z-10 w-full md:w-auto flex gap-15 md:gap-10 lg:gap-30 flex-col lg:flex-row xl:gap-70 items-center justify-center'>
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className=' w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            {swap
              ?
              <Lottie className={`w-2/2 ${shake ? "animate-shake" : ""}`} animationData={ErrorLogIn} /> 
              :
              <Lottie className={`w-2/2 ${shake ? "animate-shake" : ""}`} animationData={SuccessLogIn} /> 
            }
            
          </div>
        </div>

        <div className=' w-5/5 [@media(min-width:600px)_and_(max-width:767px)]:w-2/3 md:w-1/3 p-4  md:p-1 flex flex-col justify-center items-center'>
          <form
            onSubmit={handleSubmit(submitHandler, onError)}
            className={`form-container ${shake ? 'shadow-red' : 'shadow-blue' } w-full md:w-100 flex flex-col gap-y-8 bg-white dark:bg-slate-900 pt-14 pb-14`}
          >
            <div>
              <p className='text-blue-600 text-3xl font-bold text-center'>
                Welcome back!
              </p>
              <p className='text-center text-base text-gray-700 dark:text-gray-500'>
                Keep all your credentials safe!
              </p>
            </div>
            <div className='flex flex-col gap-y-5'>
              <Textbox
                placeholder="email"
                type="email"
                name="email"
                label="Email"
                className={`w-full rounded-full border ${
                  errors.email ? `border-2 border-red-500 focus:border-red-500 ${shake ? "animate-shake" : ""}` : "border-gray-300 focus:border-blue-500"
                }`}
                register={register("email", {
                  required: "Email is required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />
              <Textbox
                placeholder="password"
                type="password"
                name="password"
                label="Password"
                className={`w-full rounded-full border ${
                  errors.password ? `border-2 border-red-500 focus:border-red-500 ${shake ? "animate-shake" : ""}` : "border-gray-300 focus:border-blue-500"
                }`}
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password.message : ""}
              />
              <span className='text-sm text-gray-600 hover:text-blue-700 hover:underline cursor-pointer'>
                Forget Password?
              </span>
            </div>
            {isLoading ? (
              <Loading />
            ) : (
              <Button
                type='submit'
                label='Log in'
                className='w-full h-10 bg-blue-700 hover:bg-blue-800 transition-colors ease-in-out duration-200 text-white rounded-full'
              />
            )}
          </form>
        </div>
      </div>

      <div className='LogIn-BG'></div>
    </div>
  )
}

export default Login