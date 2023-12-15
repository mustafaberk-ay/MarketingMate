import OpenAI from 'openai';
import { globalAssistant, globalThread } from '../server';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env['OPENAI_API_KEY'],
});

export async function retrieveMarketingMateAssistant() {
	return await openai.beta.assistants.retrieve('asst_ctG2OPs5N6oLzhwVjRwilmlj');
}

export async function createThread() {
	return await openai.beta.threads.create();
}

export async function chatService(userMessage: string) {
	if (globalAssistant && globalThread) {
		const message = await openai.beta.threads.messages.create(globalThread.id, {
			role: 'user',
			content: userMessage,
		});

		const run = await openai.beta.threads.runs.create(globalThread.id, {
			assistant_id: globalAssistant.id,
		});
	}
}

export async function streamChatService(userMessage: string){
	if(globalAssistant && globalThread){
		const stream = await openai.beta.chat.completions.stream({
			model: globalAssistant.model,
			messages: [{role: 'user', content: userMessage}],
			stream: true
		})

		stream.on('content', (delta, snapshot) => {
			process.stdout.write(delta)
		})

		const chatCompletion = await stream.finalChatCompletion()
		console.log(chatCompletion)
	}
}

export async function getLastMessageService() {
	if (globalThread) {
		const assistantMessages = await openai.beta.threads.messages.list(
			globalThread.id
		);

		if (assistantMessages.data.length > 0) {
			const lastMessage = assistantMessages.data[0];
			const textContent = lastMessage.content.find(
				(item) => item.type === 'text'
			);

			if (textContent) {
				const lastMessageText = textContent.text.value;
				const lastMessageId = lastMessage.id
				const role = lastMessage.role
				
				const lastMessageObj = {
					lastMessageText,
					lastMessageId,
					role
				}
				return lastMessageObj;
			} else {
				console.log('Last message does not contain text content.');
			}
		} else {
			console.log('No messages found for the assistant in this thread.');
		}
	}
}
