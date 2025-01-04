
# Buzz Buddy

**Tagline**: *Where every conversation becomes a moment*

Buzz Buddy is a feature-rich chat application designed to make your conversations seamless, engaging, and memorable. With a focus on real-time interactions, personalization, and intelligent features, Buzz Buddy elevates the way you connect with others.

---

## Features

### 1. **Friendship Management**
- **Add Friends**: Send friend requests to others and build your social circle.
- **Friend Requests**: Recipients can choose to accept or decline friend requests.
- **Becoming Friends**: Once accepted, both users are added to each other's friends list.

### 2. **Real-Time Notifications**
- Get instant notifications for:
  - Friend requests received.
  - Friend requests accepted.
  - Incoming messages.

### 3. **Dynamic Chat Updates**
- **Message Reordering**: Chats are dynamically reordered based on the latest message, ensuring that the most recent conversations appear at the top.
- **Seen and Unread Messages**: Easily track the number of unread messages for each chat.

### 4. **Profile Customization**
- **Avatar Management**: Update your profile with high-quality avatars or upload a custom photo.
- **Themes**: Choose from a variety of themes to personalize your app experience.

### 5. **AI-Powered Chatbot**
- **Chat with AI**: Engage with an intelligent chatbot to get answers to your queries.
- **Clear Chat History**: Remove previous conversations with the chatbot as needed.

### 6. **Authentication**
- **Email-Based Signup**: Register using an email address with OTP verification for added security.
- **Google Login**: Log in quickly and securely using your Google account.

### 7. **Full-Responsive UI**
- **Optimized for Phones**: Buzz Buddy works marvelously on mobile devices, offering a seamless and intuitive user experience.
- **Real-Time Communication**: Enjoy smooth, real-time conversations with friends.

---

## How It Works

### Adding and Messaging Friends
1. Send a friend request to a user.
2. The recipient can accept or decline the request.
3. Once accepted, start messaging your new friend.
4. Receive real-time notifications for new messages and friend activity.

### Chat Features
- Messages are displayed in real-time.
- Conversations are reordered based on the latest activity.
- Track unread messages for each chat.

### Personalization
- Update your profile with avatars or custom photos.
- Apply a theme of your choice to enhance your user experience.

### AI Chatbot
- Interact with the chatbot for instant replies to your questions.
- Clear the chatbot’s chat history anytime for a fresh start.

### Authentication
- Securely sign up with OTP verification sent to your email.
- Use Google Login for quick access.

---

## Installation and Setup

### Prerequisites
- Node.js
- MongoDB
- Any modern web browser

# Buzz Buddy

## Steps

### 1. Clone the repository:
```bash
git clone https://github.com/kshitijgupta0707/BuzzzBuddy.git
```

### 2. Navigate to the frontend directory:
```bash
cd frontend
```

### 3. Install dependencies:
```bash
npm i
```

### 4. Navigate to the backend directory:
```bash
cd ..
cd backend
```

### 3. Install dependencies:
```bash
npm i
```

### 4. Set up environment variables:
- Create a `.env` file in the root directory.
- Add the following variables:

```env

PORT = 5001
//mongodb database url
DATABASE_URL = yourmongodbconnecionstring

JWT_SECRET = anything

//cloudinary
CLOUD_NAME = 
API_KEY = 
API_SECRET = 
    
//mail  
MAIL_HOST = smtp.gmail.com
MAIL_USER = yourGmailId
MAIL_PASS = appPassword

//home url
VITE_SITE_URL = "http://localhost:frontendport"

GEMINI_API_KEY = ""
//not in working for now
HUGGING_FACE_TOKEN = ""

//google login
CLIENT_ID = 
CLIENT_SECRET = 
CALLBACK_URL = "/auth/google/callback"
```

### 5. Start the backend server and frontend server on 2 different terminals:
```bash
cd frontend
npm run dev
```
```bash
cd backend
npm run dev
```

### 6. Open your browser and navigate to:
```arduino
http://localhost:5173
```

---

## Technologies Used

- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js 
- **Database:** MongoDB  
- **Authentication:** JSON Web Tokens (JWT), Google OAuth 2.0  
- **Email Service:** Nodemailer   
- **Real-Time Updates:** Socket.IO  

---

## Contributing

We welcome contributions to Buzz Buddy! Follow these steps to contribute:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature description"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

---

## Contact

For any inquiries or support, please contact:

- **Email:** kshitijgupta070704@gmail.com  
- **GitHub:** [GitHub Repository](https://github.com/kshitijgupta0707/BuzzzBuddy)  

Thank you for choosing Buzz Buddy! Enjoy connecting with your friends and exploring intelligent features.

how to get gmail app password?
how to get gmail login ?
how to get gemini api key ?
how to get llama api key?
