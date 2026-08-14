import React from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { useState } from 'react'
import { useEffect } from 'react'

export const SideBar = () => {

    const {getUsers,users,setSelectedUser,selectedUser,unseenMessage,
            setUnseenMessage} = useContext(ChatContext)
    const {logout,onlineUser} = useContext(AuthContext);
    const [input,setInput] = useState(false);
    const filteredUsers = input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())) : users;
    const navigate = useNavigate();
    useEffect(()=>{
        getUsers();

    },[onlineUser])
    return (
        // here we use the bg-color/10 here 10 is for the transperency 
        <div className={`bg-[#8185B2]/10 w-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "" : ""}`}>
            <div className='pb-5'>
                <div className='flex justify-between items-center'>
                    <img src={assets.logo} alt="logo" className='max-w-40'></img>
                    {/*here we use the group because now if any one hover on 3 dot then i show both option using group-hover */}
                    <div className='relative py-2 group'>
                        <img src={assets.menu_icon} alt="menu" className='max-h-5 cursor-pointer'></img>
                        <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border-2 border-gray-600  
                           text-gray-100 hidden group-hover:block'>
                            <p onClick={()=>navigate("/profile")} className='cursor-pointer text-sm'>Edit Profile</p>
                            <hr className='my-2 border-t border-gray-500'></hr>
                            <p onClick={()=>logout()} className='cursor-pointer text-sm'>LogOut</p>
                        </div>

                    </div>
                </div>
                {/*here we create the search bar */}
                <div className='bg-[#282142] rounded-full mt-5 flex px-3 py-4 items-center gap-2'>
                    <img src={assets.search_icon} alt="search" className='max-w-3'></img>
                    <input onChange={(e)=>setInput(e.target.value)} type='text' placeholder='Search User ...' className='bg-transparent border-none  outline-none text-white text-xs
                     placeholder-[#c8c8c8c] flex-1'></input>
                </div>
                <div className='flex flex-col '>
                    {filteredUsers.map((user,index)=>(
                        // we can set the unseenMessage to 0 when user click on the setselctedUser
                        <div key={index} onClick={()=>{(setSelectedUser(user)); setUnseenMessage((prev)=>({...prev,[user._id]:0})) }} className={`relative flex items-center gap-2 p-2  pl-4 rounded-md cursor-pointer  max-sm:text-sm 
                            ${selectedUser?._id === user._id && 'bg-[#282142]/50' }`}>
                            <img src={user?.profilePic || assets.avatar_icon} alt="user" className='w-[35px] aspect-[1/1] rounded-full' ></img>
                            {/**/}
                            <div className='flex flex-col leading-5'>
                                <p>{user.fullName}</p>
                                {   //here index < 3 means from the array index 0-2 user show online and other offline
                                    // index < 3
                                    onlineUser.includes(user._id)
                                    ? <span className='text-green-400 text-xs'>online</span> 
                                    : <span className='text-gray-400 text-xs'>offline</span>
                                }
                            </div>
                            {/* unseenMessage  which not read we can see */}
                            {unseenMessage[user._id] > 0 && <p className='absolute  top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50 '>{unseenMessage[user._id]}</p>}
                        </div>
                    ))}

                </div>

            </div>
        </div>
    )
}
