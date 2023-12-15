import { Router } from "express";
import { sendMessage, getLastMessage, streamChat } from "../controllers/chat";

export const chatRouter = Router()

chatRouter.get('/getMessage', getLastMessage)
chatRouter.post('/sendMessage', sendMessage)
chatRouter.post('/streamChat', streamChat)