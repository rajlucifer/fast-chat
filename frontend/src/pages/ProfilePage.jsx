import React from 'react'
import assets from '../assets/assets'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const ProfilePage = () => {
  const {authUser,updateProfile} = useContext(AuthContext);
  const [selectedImg,setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name,setName] = useState(authUser.fullName);
  const [bio,setBio] = useState(authUser.bio);
  const submitHandler = async (e)=>{
    e.preventDefault();
    //after sumbit it goes to home page
    if(!selectedImg){
      await  updateProfile({fullName:name,bio});
      navigate("/");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async()=>{
      const base64Img = reader.result;
      await updateProfile({profilePic:base64Img,fullName:name,bio});
      navigate("/");
    }
    

  }
    return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center   '>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-500 border-2 border-gray-500  flex items-center justify-between  max-sm:flex-col-reverse rounded-lg '>
        <form onSubmit={submitHandler} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className=' text-white text-lg '>Profile Details</h3>
          <label htmlFor='avatar' className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e)=>setSelectedImg(e.target.files[0])} type='file' id="avatar"  accept='png, .jpeg ,.jpg' hidden />
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic ||assets.avatar_icon }  className={`w-12 h-12  object-cover rounded-full  ${selectedImg && 'rounded-full'} `}>
            </img>
            <p className='text-gray-400'>Upload Image Profile</p>
             
          </label>
          <input onChange={(e)=>setName(e.target.value)} type='text' placeholder='Enter Your Name'  value={name} required className='bg-transparent  outline-none  p-2 border border-gray-500  ring-2 ring-violet-400 rounded-md' />
          <textarea onChange={(e)=>setBio(e.target.value)} value={bio} rows={3} placeholder='Write Profile Bio'  required className='bg-transparent  outline-none  p-2 border border-gray-500  ring-2 ring-violet-400 rounded-md'> </textarea>
          <button type='submit' className='p-2 bg-gradient-to-r from-purple-400 to-violet-600 rounded-full'>Save</button>


        </form>
        <img src={authUser?.profilePic||assets.logo_icon} alt='logo-icon' className={`max-w-44  aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} ></img>
      </div>
       
    </div>
  )
}
