import MessageModel from "../models/Message.js";
import UserModel from "../models/Users.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../../server.js"


// get all user except logged in user
export const getUsersForSiderBar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filterUser = await UserModel.find({ _id: { $ne: userId } }).select("-password");


        // count number of message not seen 
        const unseenMessage = {};
        const promises = filterUser.map(async (user) => {
            const messages = await MessageModel.find({ senderId: user._id, receiverId: userId, seen: false });
            if (messages.length > 0) {
                // by doing this we can create the key value pair of object
                unseenMessage[user._id] = messages.length;
            }


        })
        await Promise.all(promises);
        res.json({
            success: true,
            users: filterUser,
            unseenMessage,
        })



    }
    catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        })
    }
};



//get message for selected user

export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;
        const messages = await MessageModel.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        });
        await MessageModel.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true });
        res.json({
            success: true,
            messages
        })


    }
    catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        })

    }
};


//api to mark message as seen using message id

export const markMessageSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await MessageModel.findByIdAndUpdate({ id }, { seen: true });
        res.json({
            success: true,

        })


    }
    catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        })

    }
};


//send message to selected user

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        // we get the sendId which is we get from the protected routes
        const senderId = req.user._id;
        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.unsigned_upload(image, "chat-profile-pic", {
                resource_type: "auto"
            });
            imageUrl = uploadResponse.secure_url;


        }
        const newMessage = await MessageModel.create({
            senderId,
            receiverId,
            image: imageUrl,
            text


        })
        //emit the new message to the receiver socket
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.json({
            success: true,
            message: newMessage
        })



    }
    catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        })

    };

};

// delete the chat using the id 
export const deleteChat = async (req, res) => {
    try {
        const { id: messageId } = req.params;
        const myId = req.user._id;
        const message = await MessageModel.findOne({
            _id: messageId,
            $or: [
                { senderId: myId },
                { receiverId: myId }
            ]
        });
        if (!message) {
            return res.json({
                success: false,
                message: "Message Not Found"
            })
        }
        await MessageModel.findByIdAndDelete(messageId);
        
       // Get both users socket IDs
        const senderSocketId =
            userSocketMap[message.senderId.toString()];

        const receiverSocketId =
            userSocketMap[message.receiverId.toString()];


        // Send delete event to sender
        if (senderSocketId) {
            io.to(senderSocketId).emit(
                "messageDeleted",
                messageId
            );
        }


        // Send delete event to receiver
        if (receiverSocketId) {
            io.to(receiverSocketId).emit(
                "messageDeleted",
                messageId
            );
        }

         res.json({
            success: true,
            message: "Message deleted Successfully"
        });



    }
    catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        })

    }
};
