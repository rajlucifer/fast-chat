import React from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { useEffect, useRef } from 'react';
import { formatDate } from '../lib/utils';
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { useState } from 'react';
import { IoTrashBinSharp } from "react-icons/io5";

export const ChatContainer = () => {
  const { setSelectedUser, selectedUser, message, sendMessage, getMessages, deleteMessage } = useContext(ChatContext);
  const { authUser, onlineUser, } = useContext(AuthContext);
  const [input, setInput] = useState('');
  // handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault;
    if (input.trim() === "") {
      return null;
    }
    await sendMessage({ text: input.trim() });
    setInput("");

  }
  // handle sending a image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("select an image file");
      return;

    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    }
    reader.readAsDataURL(file);


  };
  const handleDeleteMessage = (messageId) => {
    deleteMessage(messageId);


  }
  const scrollEnd = useRef();
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }

  }, [selectedUser])
  useEffect(() => {
    if (scrollEnd.current && message) {
      scrollEnd.current.scrollIntoView({ behaviour: "smooth" })
    }

  }, [message])


  return selectedUser ? (

    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      {/* // header section */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="profile-img" className='w-8 h-8 object-cover rounded-full'></img>
        <p className='flex-1 text-xl text-white flex items-center   gap-2'>{selectedUser.fullName}
          {onlineUser.includes(selectedUser._id) && <span className='bg-green-500 w-2 h-2 rounded-full'></span>}
        </p>
        {/*  if md:hidden means if width is true then it will not showing */}
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="arrow-icon" className='md:hidden max-w-7'></img>
        <img src={assets.help_icon} alt="help-icon" className='max-md:hidden max-w-5'></img>
      </div>
      {/* //this is chat area */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-scroll p-3 pb-6'>
        {message.map((msg,index)=>(
          <div key={msg._id} className={`flex items-end gap-2 justify-end ${msg.senderId !==  authUser._id && 'flex-row-reverse'} `}> 
             {
              msg.image ? (<img src={msg.image} alt='msg-image' className='max-w-[230px] border border-gray-500 rounded-lg overflow-hidden mb-8'></img>):(<p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8  break-all bg-violet-500/30 text-white 
                ${msg.senderId === authUser._id ? 'rounded-br-none':'rounded-bl-none'}`}>{msg.text} </p>)
             }
             <div  className={`text-center text-xs space-y-2`}>
               <div className={`flex gap-2  ${msg.senderId !==  authUser._id && 'flex-row-reverse'}  `}>
                 <img   src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} 
               className='w-7 h-7 object-cover rounded-full '></img>
               </div>
               <div className={`flex gap-2  ${msg.senderId !==  authUser._id && 'flex-row-reverse'}  `}>
                <p className='text-gray-500'>{formatDate(msg.createdAt)}</p>
                <IoTrashBinSharp className='text-red-500 text-[17px]' onClick={()=>handleDeleteMessage(msg._id)} />
               </div>

             </div>


          </div>
        ))}
        <div ref={scrollEnd}></div>


      </div>
      {/*here we create the bottom area */}
      <div className='absolute  bottom-0 left-0 right-0 flex items-center p-3 gap-3'>
        <div className='flex-1 flex items-center bg-gray-100/10 px-3 rounded-full'>
          <input onChange={(e) => setInput(e.target.value)} value={input} type="text" onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : null} placeholder='Send a message'
            className='flex-1 bg-transparent text-white border-none outline-none text-sm p-3 placeholder-gray-400 rounded-lg '></input>
          <input onChange={handleSendImage} type="file" id="image" accept='image/png , image/jpeg' hidden />
          <label htmlFor='image'>
            <img src={assets.gallery_icon} alt='gallery-icon' className='w-5 mr-2 cursor-pointer'></img>
          </label>
        </div>
        <img onClick={handleSendMessage} src={assets.send_button} className='w-7 cursor-pointer'></img>

      </div>
    </div>



  )
    : (
      <div className='flex flex-col items-center justify-center  gap-4  text-gray-500  bg-white/10 max-md:hidden' >

        <img src={assets.logo_icon} alt='logo-icon' className='max-w-16'></img>
        <p className='text-2xl font-medium text-white'>Chat Anytime Anywhere</p>

      </div>
    )
}
