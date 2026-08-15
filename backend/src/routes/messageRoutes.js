import express from "express"
import { protectRoutes } from "../middleware/auth.js";
import { getMessages, getUsersForSiderBar, markMessageSeen, sendMessage,deleteChat } from "../controllers/messageController.js";

const messageRouter = express.Router();


messageRouter.get("/users",protectRoutes,getUsersForSiderBar);
messageRouter.get("/:id",protectRoutes,getMessages);
messageRouter.put("/mark/:id",protectRoutes,markMessageSeen);
messageRouter.post("/send/:id",protectRoutes,sendMessage);
messageRouter.delete("/delete/:id",protectRoutes,deleteChat)

export default messageRouter;