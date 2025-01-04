import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// i have made this just to get the seperate hugging face mistralm model working
// notuse in project  
// soon to be added in the project

async function generateText(req, res) {
  try {
    // Extract input text from the request body
    const { text } = req.body;

    console.log("Received text: ", text);

    // Validate input
    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Enter the information for AI to complete it",
      });
    }

    // Call the Hugging Face API
    const { data } = await axios.post(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-v0.1",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
        },
      }
    );

    // Respond with the generated text
    return res.status(200).json({
      success: true,
      message: "AI response generated successfully",
      data,
    });
  } catch (error) {
    console.error("Error generating text:", error);

    // Handle errors gracefully
    return res.status(500).json({
      success: false,
      message: "Failed to generate text from AI",
      error: error.response?.data || "Unknown error occurred",
    });
  }
}

export { generateText };
