import AIChat from "../models/ai.chat.model.js"; 
import axios from "axios";

const sendMessageToAi = async (req, res) => {
  try {
    console.error("send message to ai called")
    const { text, userId } = req.body;

    if (!text?.trim() || !userId) {
      return res.status(400).json({
        success: false,
        message: "User ID and prompt text are required",
      });
    }

    // Step 1: Fetch or create chat history for this user
    let chat = await AIChat.findOne({ userId });
    if (!chat) {
      chat = await AIChat.create({ userId, messages: [] });
    }
    console.log("past messages")
    console.log(chat);


    // Step 2: Add user message to DB (but don't wait for save yet)
    chat.messages.push({ sender: "user", text: text.trim() });

  

    // Step 3: Format chat history for Gemini API
    const contents = chat.messages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));
    console.log("content")
    console.log(contents)

    // Step 4: Call Gemini API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const response = await axios.post(
      apiUrl,
      { contents },
      { headers: { "Content-Type": "application/json" } }
    );

    const geminiReply = response.data.candidates[0].content.parts[0].text;

    // Step 5: Save Gemini's response to DB
    chat.messages.push({ sender: "gemini", text: geminiReply });
    await chat.save();

    return res.json({
      success: true,
      response: geminiReply,
      fullChat: chat.messages,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error communicating with Gemini AI",
    });
  }
};

export { sendMessageToAi };
