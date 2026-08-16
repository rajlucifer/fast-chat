import { useContext } from "react";
import { createContext } from "react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast"
import { useEffect } from "react";
 
import {io} from "socket.io-client"

const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const AuthContext = createContext();
axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({children})=>{
    const [token,setToken] = useState(localStorage.getItem("token"));
    const [authUser,setAuthUser] = useState(null);
    const [onlineUser,setOnlineUser] = useState([]);
    const [socket,setSocket] =  useState(null);

    // check if user is authenticated and if so ,set user data and connect the socket

    const checkAuth = async()=>{
        try{
            const {data}= await axios.get("/api/auth/check");
            if(data.success){
                setAuthUser(data.user);
                connectSocket(data.user);
            }

        }
        catch(error){
            console.log("Unauthorized User",error);
            toast.error("Unauthorized User");

        }
    };

// login function to handle user authentication and socket connection 
   const login = async(state,credentials)=>{
     try{
        const {data} = await axios.post(`/api/auth/${state}`,credentials);
        if(data.success){
            setAuthUser(data.userData);
            connectSocket(data.userData);
            axios.defaults.headers.common["token"] = data.token; 
            setToken(data.token);
            localStorage.setItem("token",data.token);
            toast.success(data.message);
        }
        else{
            toast.error(data.message);
        }

     }
     catch(error){
        console.log(error.message)

     }
   }
    // logout function to handle user logout and socket disconnection
    const logout =()=>{
        // if we remove the token user will logout easily 
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUser([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged Out Successfully");
        socket.disconnect();

    };
    // update profile function  to handle user profile updates
    const updateProfile = async(body)=>{
        try{
            const {data} = await axios.put("/api/auth/update-profile",body)
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile Updated Successfully");

            }

        }
        catch(error){
            toast.error(error.message);

        }
    }

    //connect socket function to handle socket connection and online user updates
    const connectSocket = (userData)=>{
        if(!userData || socket?.connected){
            return;
        }
        const newSocket = io(backendUrl,{
            query:{
                userId: userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);
        newSocket.on("getOnlineUser",(userIds)=>{
            setOnlineUser(userIds);

        })

    }

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"] = token;
            checkAuth();
        };
         

    },[])
    const value = {
        axios,
        token,
        authUser,
        onlineUser,
        socket,
        login,
        logout,
        updateProfile

    }



    return (
        <AuthContext.Provider value={value}>
            {children}

        </AuthContext.Provider>
    )

}