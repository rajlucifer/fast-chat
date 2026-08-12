import React from 'react'
import assets from '../assets/assets'
import { useState } from 'react'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const LoginPage = () => {
  const [currState,setCurrState]= useState("Sign up");
  const [fullName,setFullName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [bio,setBio] = useState("");
  const [isDataSubmited,setIsDataSubmited] = useState(false);
  const {login} = useContext(AuthContext);
  const onSubmitHandler = (e)=>{
    e.preventDefault();
    if(currState === "Sign up" && !isDataSubmited){
      setIsDataSubmited(true);
      return;
    }
    login(currState ==="Sign up" ? 'signup' :'login' ,{fullName,email,password,bio,})

  }
  return (
    <div className='min-h-screen bg-cover bg-center  flex items-center justify-center gap-8 sm:justify-evenly  max-sm:flex-col backdrop-blur-xl '>
      {/*in left side we placed the image */}
      <img src={assets.logo_big} alt="logo" className='w-[min(30vw,250px)]'></img>
      {/* here we write the right columns */}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/10 text-white border-gray-500 p-6 flex flex-col  gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium  text-2xl flex  justify-between items-center '>
          {currState}
          {/*when is Datasubmited is true then back arrow will show */}
          {isDataSubmited && <img  onClick={()=>setIsDataSubmited(false)} src={assets.arrow_icon} alt="arrow-icon" className='w-5 cursor-pointer text-gray-600'></img>}
        </h2>
        {/*if the current state signup then the this input is showing */}
        {currState === "Sign up" && !isDataSubmited
         &&(<input  onChange={(e)=>setFullName(e.target.value)}
         type='text' placeholder='Full Name' required className='p-2 outline-none bg-transparent border border-gray-500 rounded-md' ></input>)
        }
        {
          <div className='flex flex-col gap-6'>
            <input  onChange={(e)=>setEmail(e.target.value)} value={email}
             type="email" placeholder='Enter Email'  required className='p-2  bg-transparent border border-gray-500 rounded-md outline-none'></input>
            <input type="password" onChange={(e)=>setPassword(e.target.value) } value={password}
             placeholder='Enter Password' required className='p-2  bg-transparent border border-gray-500 rounded-md outline-none'/>
            
          </div>
        }
        {
          currState === "Sign up" && isDataSubmited && (
            <textarea onChange={(e)=>setBio(e.target.value)} value={bio} rows={4} placeholder='Provide the short Bio ...' className='p-2 border border-gray-500 rounded-md outline-none  ring-2 bg-transparent
            ring-indigo-500'></textarea>
          )
        }
        <button type="submit" className='py-3 bg-gradient-to-r from-purple-400 to-violet-400 rounded-md text-white cursor-pointer'
        >{currState ==="Sign up" ? "Create Account" : "Login Now"}</button>
        <div className='flex items-center gap-2 text-sm text-gray-400'>
          <input type="checkbox"/>
          <p>Agree to the terms of use of pravicy & policy.</p>
        </div>
        <div className='flex flex-col gap-2'>
          {currState === "Sign up" ? 
          (<p className='text-sm text-gray-400'>Already have an account <span onClick={()=>{setCurrState("Login");setIsDataSubmited(true)}} className='text-violet-400 cursor-pointer'>Login Here</span></p>):
          (<p className='text-sm text-gray-400'>Create an account <span onClick={()=>{setCurrState("Sign up");setIsDataSubmited(false)} }className='text-violet-400 cursor-pointer'>Click Here</span></p>)}

        </div>
      </form>

    </div>
  )
}
