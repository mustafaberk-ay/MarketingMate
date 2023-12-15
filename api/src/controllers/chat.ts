import { Request, Response } from "express";
import { chatService, getLastMessageService, streamChatService } from "../services/chat";

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const userMessage = req.body.userMessage
        await chatService(userMessage)
        res.json({message: `Sent: ${userMessage}`})
    } catch (error) {
        console.error(error)
    }
}

export const getLastMessage = async (req: Request, res: Response) => {
    try {
        const ret = await getLastMessageService()
        res.json({message: ret})
    } catch (error) {
        console.error(error)
    }
}

export const streamChat = async (req: Request, res: Response) => {
    try {
        await streamChatService(req.body.message)
    } catch (error) {
        console.error(error)
    }
}