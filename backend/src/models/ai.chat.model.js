import mongoose from "mongoose";

const aiChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Links the conversation to a specific user
    },
    messages: [
      {
        sender: { type: String, enum: ["user", "gemini"], required: true }, // Identifies sender
        text: { type: String, required: true }, // Message content        
        timestamp: {
          type: String, // Store time directly as a string
          default: function () {
            const date = new Date();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}`;
          },}
        
        
        
        // Timestamp for each message
      },
    ],
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt timestamps
);

const AIChat = mongoose.model("AIChat", aiChatSchema);

export default AIChat;
