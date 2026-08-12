import React from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { userDummyData } from '../assets/assets'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export const SideBar = ({ selectedUser, setSelectedUser }) => {
    const {logout} = useContext(AuthContext);
    const navigate = useNavigate();
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
                    <input type='text' placeholder='Search User ...' className='bg-transparent border-none  outline-none text-white text-xs
                     placeholder-[#c8c8c8c] flex-1'></input>
                </div>
                <div className='flex flex-col '>
                    {userDummyData.map((user,index)=>(
                        <div key={index} onClick={()=>(setSelectedUser(user))} className={`relative flex items-center gap-2 p-2  pl-4 rounded-md cursor-pointer  max-sm:text-sm 
                            ${selectedUser?._id === user._id && 'bg-[#282142]/50' }`}>
                            <img src={user?.profilePic || assets.avatar_icon} alt="user" className='w-[35px] aspect-[1/1] rounded-full' ></img>
                            {/**/}
                            <div className='flex flex-col leading-5'>
                                <p>{user.fullName}</p>
                                {   //here index < 3 means from the array index 0-2 user show online and other offline
                                    index < 3
                                    ? <span className='text-green-400 text-xs'>online</span> 
                                    : <span className='text-gray-400 text-xs'>offline</span>
                                }
                            </div>
                            {index > 2 && <p className='absolute  top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50 '>{index}</p>}
                        </div>
                    ))}

                </div>

            </div>
        </div>
    )
}
