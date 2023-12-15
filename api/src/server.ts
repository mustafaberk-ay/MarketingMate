import app from './app'
import { createThread, retrieveMarketingMateAssistant } from './services/chat'

const port = 5001

export let globalAssistant : any
export let globalThread : any

const initOpenAIAssistant = async () => {
    try {
        const assistant = await retrieveMarketingMateAssistant()
        const thread = await createThread()
        globalAssistant = assistant
        globalThread = thread
        console.log('Retrieved Marketing Mate successfully');
    } catch (error) {
        console.error('Error creating OpenAI Assistant:', error)
    }
}

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
    initOpenAIAssistant()
})