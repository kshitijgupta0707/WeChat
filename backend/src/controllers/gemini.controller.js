// i have made this just to get the seperate gemini working
// notuse in project  
  
  
  
  
  import {GoogleGenerativeAI } from "@google/generative-ai"  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  import axios from "axios"
  
//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.0-flash-exp",
//   });

//it is done in the frontened because why do unneccessary call in our backend server


const sendMessageToAi = async(req  , res) =>{
    try {
        //get data
        const { text } = req.body;
    
        //validation on email and password
        if (!text.trim()) {
          return res.status(404).json({
            success: false,
            message: "Enter the task for AI",
          });
        }

         const prompt = text
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

        return res.json({
          success: true,
          response: response.data,
          finalResponse
        });
    
      } catch (e) {
    
        console.error(e);
        res.status(400).json({
          success: false,
          data: "Not able to ask to AI",
        })
      }
}
export {sendMessageToAi}