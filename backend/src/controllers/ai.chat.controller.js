import AIChat from '../models/ai.chat.model.js';
  import {GoogleGenerativeAI } from "@google/generative-ai"  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  import axios from "axios"
  
const getResponseFromGemini = async(prompt) =>{
  try {
          // Call the Gemini API directly using axios
   const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
   const response = await axios.post(
      apiUrl,
      {
        contents: [
          {
            parts: [
              {
                text: prompt.trim(),
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const finalResponse = response.data.candidates[0].content.parts[0].text;

     return finalResponse;
  
    } catch (e) {
      console.log("Error in getting response from Gemini")
      console.error(e);
     }
}
const sendMessageToGemini = async (req,res) => {
  try {
    const { text} = req.body
    const userId =  req.user._id
    let chat = await AIChat.findOne({ userId });
    if(!text ||!userId || !text.trim()){
      res.status(404).json({
        success: false,
        message: "Enter all the fields"
      })
    }
    // Create a new chat if it doesn't exist
    if (!chat) {
      chat = new AIChat({ userId, messages: [] });
    }
   console.log(chat)
    // Add the new message
    chat.messages.push({ sender: "user", text });
    await chat.save();

   const response  = await getResponseFromGemini(text)

   console.log("i got the response")
   console.log(response)
   chat.messages.push({ sender: "gemini", text: response})
   await chat.save()


  console.log('Message saved to AI chat!');

   return res.status(200).json({
        success: true, 
        message : "Chat send successfully to Ai",
        chat
    })

  } catch (error) {
    res.status(400).json({
        success: false, 
        message : "Issue in save ai chat message"
    })
    console.error('Error saving AI chat message:', error);
  }
};
const getAIChatHistory = async (req , res) => {
    try {
      const userId = req.user._id
      const chat = await AIChat.findOne({ userId });
      return res.json(chat ? chat.messages : []);
    } catch (error) {
      console.error('Error retrieving AI chat history:', error);
      return [];
    }
  };
const clearChatHistory = async (req , res) => {
    try {
      console.log("clear chat history called")
      const userId = req.user._id
      const chat = await AIChat.findOneAndDelete({ userId }, {new:true});
      console.log(chat)
      return res.json(chat ? chat.messages : []).status(200);
    } catch (error) {
      console.error('Error retrieving AI chat history:', error);
      return res.json({}).status(400);
    }
  };
  
  
export {sendMessageToGemini , getAIChatHistory,clearChatHistory}


// getResponseFromGemini
// sendMessageToGemini
// getAIChatHistory
// clearChatHistory