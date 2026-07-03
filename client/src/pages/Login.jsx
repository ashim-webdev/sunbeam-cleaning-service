import { useEffect, useState } from 'react'
import React from 'react'
import { toast } from 'sonner'
import Lottie from 'lottie-react'
import { motion } from "framer-motion"
import SuccessLogIn from '../LottieFiles/success.json'
import ErrorLogIn from '../LottieFiles/error.json'
import Blob from '../LottieFiles/blob.json'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useLoginMutation } from "../redux/slices/api/authApiSlice"
import { setCredentials } from '../redux/slices/authSlice'
import Textbox from '../components/Textbox'
import Button from '../components/Button'
import CautionBtn from '../components/CautionBtn'
import Loading from '../components/Loading'



const SmallLoading = () => {
  const { LightMode }  = useSelector((state) => state.auth);

  const smallLoader = LightMode ? "dot-spinner" : "dot-spinnerDark"

  return (
    <>
      <div className={`${smallLoader} transition-colors duration-300 ease-in-out animate-UpDown`}>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
        <div className="dot-spinner__dot"></div>
      </div>
    </>
  )
}



const Login = () => {
  const { user, LightMode } = useSelector((state) => state.auth);
  const [login, { isLoading }] = useLoginMutation() // RTK Query mutation hook for login
  

  const [passwordShow, setPasswordShow] = useState(false)
  const [shake, setShake] = useState(false)
  const [swap, setSwap] = useState(false)
  const [blobState, setBlobState] = useState("half"); // "half" | "full"
  const [vanish, setVanish] = useState(false);


  // Form Handling {For each user}
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const submitHandler = async (data) => {
    try {
      const result = await login(data).unwrap();
      toast.success("Login successful!");
      console.log("Login successful:", result);

      dispatch(setCredentials(result));
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error?.data?.message + "!!!" || "Login failed. Please try again.");
    }
  }

  console.log(user)

  useEffect(() => {
    user && navigate('/dashboard')
  }, [user]); // Redirect to dashboard if user is already logged in




  // Handle Password Show button
  const showPassword = () => {
    setPasswordShow(prev => {
      const newState = !prev;

      if (newState) {
        setBlobState("full"); // password visible
      } else {
        setBlobState("half"); // password hidden
      }

      return newState;
    });
  };
  
  // Shake Animation for Form errors
  const handleErrorAnimation = () => {
    setShake(true)
    setSwap(true)

    setBlobState("half")

    if (navigator.vibrate) {
      navigator.vibrate(300);
    }

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



  // Animate Blob Upward & Downward
  const blobVariants = {
    half: {
      y: 40, // pushes Blob DOWN (hidden halfway)
      transition: { type: "spring", stiffness: 120, damping: 12 }
    },
    full: {
      y: 0, // fully visible
      transition: { type: "spring", stiffness: 120, damping: 12 }
    }
  }

  const handRightVariants = {
    half: {
      x: 0, // pushes Blob DOWN (hidden halfway)
      transition: { type: "spring", stiffness: 120, damping: 12 }
    },
    full: {
      y: 40, // fully visible
      transition: { type: "spring", stiffness: 120, damping: 12 },
      opacity: 0
    }
  }

  const handLeftVariants = {
    half: {
      x: 0, // pushes Blob DOWN (hidden halfway)
      transition: { type: "spring", stiffness: 120, damping: 12 }
    },
    full: {
      y: 40, // fully visible
      transition: { type: "spring", stiffness: 120, damping: 12 },
      opacity: 0
    }
  }

  const blobVanish = () => {
    setVanish(true);
    setTimeout(() => {
      setVanish(false);
    }, 1250);
  }
  
  return (
    <div className='LogIn-BG relative overflow-x-hidden overflow-y-auto w-full h-full'>
      <div className='Login w-full h-auto flex items-center justify-center flex-col lg:flex-row'>
        <div className=' sm:overflow-x-visible z-10 w-auto md:w-auto flex gap-15 md:gap-10 lg:gap-30 flex-col lg:flex-row xl:gap-70 items-center justify-center'>
          <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
            <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 mt-10 2xl:-mt-20'>
              {swap
                ?
                <Lottie className={`w-2/2 ${shake ? "animate-shake" : ""}`} animationData={ErrorLogIn} /> 
                :
                <Lottie className={`w-2/2 ${shake ? "animate-shake" : ""}`} animationData={SuccessLogIn} /> 
              }
            </div>
          </div>

          <div className='w-5/5 [@media(min-width:600px)_and_(max-width:767px)]:w-3/3 md:w-1/3 sm:p-4  md:p-1 flex flex-col justify-center items-center'>
            <form
              onSubmit={handleSubmit(submitHandler, onError)}
              className={`form-container relative ${shake ? 'shadow-red' : 'shadow-blue' } ${LightMode ? "bg-white" : "bg-black/30"} w-full md:w-100 flex flex-col  gap-y-8 pt-14 pb-14 transition-all duration-300 ease-in-out`}
            >
              <div className="z-10 flex justify-center items-center flex-col">
                <p className='LoginHeader text-blue-600 text-3xl font-bold text-center text-shadow-lg'>
                  Welcome back!
                </p>
                <p className={`${LightMode ? "text-gray-700" : "text-gray-400"} text-center text-base `}>
                  Keep all your credentials safe!
                </p>
              </div>
              <div className='flex flex-col gap-y-5'>
                <Textbox
                  placeholder="email"
                  type="email"
                  name="email"
                  label="Email"
                  onFocus={() => setBlobState("full")}
                  springClass="ClickAnimationNoti"
                  className={`w-full rounded-full shadow-[-5px_-5px_0px_rgba(124,124,124,0.147)] border ${
                    errors.email ? `border-2 border-red-500 focus:border-red-500 ${shake ? "animate-shake" : ""}` : "border-gray-300 focus:border-blue-500"
                  }`}
                  register={register("email", {
                    required: "Email is required!",
                  })}
                  error={errors.email ? errors.email.message : ""}
                />
                <div className='relative'>
                  <Textbox
                    placeholder="password"
                    type={`${passwordShow ? "text" : "password"}`}
                    name="password"
                    label="Password"
                    onFocus={() => {
                      if (passwordShow) {
                        setBlobState("full") // 👈 keep visible if password is shown
                      } else {
                        setBlobState("half") // 👈 only hide if password is hidden
                      }
                    }}
                    springClass="ClickAnimationNoti"
                    className={`w-full rounded-full shadow-[-5px_-5px_0px_rgba(124,124,124,0.147)] border ${
                      errors.password ? `border-2 border-red-500 focus:border-red-500 ${shake ? "animate-shake" : ""}` : "border-gray-300 focus:border-blue-500"
                    }`}
                    register={register("password", {
                      required: "Password is required!",
                    })}
                    error={errors.password ? errors.password.message : ""}
                  />
                  <span onClick={showPassword} className={`${shake ? "animate-shake" : ""} ClickAnimationNoti absolute top-9 right-5 cursor-pointer transition-transform ease-in-out duration-200`}>
                    { passwordShow
                      ?
                      <i className="fa-solid fa-eye text-[#0049E5] hover:text-[#0547d5]"></i>
                      :
                      <i className="fa-solid fa-eye-slash text-gray-400 hover:text-gray-500"></i>
                    }
                  </span>
                </div>
                <span className={`${LightMode ? "text-gray-700" : "text-gray-400"} text-sm`}>
                  <span className='hover:text-blue-700 hover:underline cursor-pointer'>Forget Password?</span>
                </span>
              </div>
              {isLoading ? (
                <Loading />
              ) : (
                <Button
                  onClick={blobVanish}
                  type='submit'
                  label='Log in'
                  className={`${shake ? "animate-shake bg-red-500 hover:bg-red-500" : "bg-blue-700"} w-full h-10  hover:bg-blue-800 transition-colors ease-in-out duration-200 text-white rounded-full ClickAnimation shadow-inner hover:shadow-innerWH`}
                />
              )}

              <div className='absolute overflow-y-hidden flex justify-center items-end -top-17 left-0 right-0 w-full h-28 z-0'>
                <motion.div
                  variants={blobVariants}
                  animate={blobState}
                  className={`${errors ? shake ? "animate-shake" : "" : ""} relative`}
                >
                  {vanish || vanish && isLoading
                    ?
                      <SmallLoading />
                    :
                      <Lottie className='w-36 -mb-7' animationData={Blob} />
                  }

                  <motion.i 
                    variants={handRightVariants}
                    animate={blobState}
                    className="fa-solid fa-hand absolute top-11 right-18 rotate-40 transform scale-x-[1] text-xl text-blue-500 drop-shadow-[0_0_2px_black]"
                    ></motion.i>

                  <motion.i 
                    variants={handLeftVariants}
                    animate={blobState}
                    className="fa-solid fa-hand absolute top-11 right-12 -rotate-40 transform scale-x-[-1] text-xl text-blue-500 drop-shadow-[0_0_2px_black]
                  "></motion.i>
                </motion.div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className='absolute bg-transparent w-fill flex justify-center item-center top-5 left-0 right-0 '>
        <CautionBtn />
      </div>
    </div>
  )
}

export default Login