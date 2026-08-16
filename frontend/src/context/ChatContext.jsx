import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";
import { data } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [message, setMessage] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessage, setUnseenMessage] = useState({});
    const { socket, axios } = useContext(AuthContext);

    //function to get all the user on the side bar
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users);
                setUnseenMessage(data.unseenMessage);

            }

        }
        catch (error) {
            toast.error(error.message);

        }

    };

    // function to get the message from the selected user
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessage(data.messages)

            }


        }
        catch (error) {
            toast.error(data.message)

        }

    };
    // function to send the message to the selected users
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessage((prevMessage) => [...prevMessage, data.message]);

            }
            else {
                toast.error(error.message);
            }

        }
        catch (error) {
            toast.error(error.message);

        }
    }
    // function to subscribe the message for selected user get the message in real-Time
    const subscribeToMessages = async () => {
        if (!socket) {
            return;
        }
        socket.on("newMessage", (newMessage) => {
            // if user click on the unseenMessage
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessage((prevMessage) => [...prevMessage, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }
            else {
                //if user doesn't click on the unseenMessage
                setUnseenMessage((prevUnseenMessage) => ({
                    ...prevUnseenMessage, [newMessage.senderId]: prevUnseenMessage[newMessage.senderId] ? prevUnseenMessage[newMessage.senderId] + 1 : 1
                }))
            }

        })
    };

    //detete message 
    const deleteMessage = async (messageId) => {
        try {
            const { data } = await axios.delete(`/api/messages/delete/${messageId}`);
            if (data.success) {
                setMessage((prev) => prev.filter((message) => message._id !== messageId))
            };
            toast.success("Message Deleted Successfully");


        }
        catch (error) {
            toast.error(data.message);

        }

    };

    // function to unsubscribe from  message
    const unsubscribeFromMessage = async () => {
        if (socket) {
            socket.off("newMessage");
        }
    }

    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessage();

    }, [socket, selectedUser]);

    useEffect(() => {

        if (!socket) return;

        socket.on("messageDeleted", (messageId) => {

            setMessage((prev) =>
                prev.filter((msg) => msg._id !== messageId)
            );

        });

        return () => {
            socket.off("messageDeleted");
        };

    }, [socket]);




    const value = {
        message,
        users,
        selectedUser,
        getUsers,
        setMessage,
        sendMessage,
        setSelectedUser,
        unseenMessage,
        setUnseenMessage,
        getMessages,
        deleteMessage



    }
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )


}

