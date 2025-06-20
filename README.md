ChatApp is a smooth and interactive real-time chat application built with Node.js, Express, MongoDB, TypeScript, and Socket.io. It allows users to register with a profile avatar, log in, and exchange messages in real-time. The app offers a stylish interface with a video background for the login/register pages and image background for the chat interface.

Features
- User registration with avatar upload
- Secure password hashing using bcryptjs
- Real-time chat using Socket.io
- Chat messages with avatars and timestamps
- Background video on login and register pages
- Different background for chat page
- LAN and WAN support for connectivity
- Smooth and modern user interface with theme support

  
Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express, TypeScript
- Database: MongoDB (via Mongoose)
- Real-Time: Socket.io
- Styling: Custom CSS with video/image backgrounds
- File Uploads: Multer
- Authentication: bcryptjs for secure password hashing

  
How to Run the Project
1. Clone the repository and install dependencies:
   - npm install
2. Create a `.env` file and add your MongoDB URI:
   - `MONGO_URI=your_mongodb_connection_string`
3. Compile TypeScript:
   - tsc
4. Run the app:
   - node dist/server.js

To run the app on LAN:
• Use the IP of the machine: http://<your-ip>:3004
To run the app on WAN using ngrok:
• Run: ngrok http 3004
• Copy the forwarding URL and share it with friends
• They can open the app via: http://<ngrok-forwarding-url>:3004

Project Structure
ChatApp/
├── public/
│   ├── login.html
│   ├── register.html
│   ├── chat.html
│   ├── css/
│   └── js/
├── uploads/
├── models/
├── dist/
├── server.ts
├── package.json
├── tsconfig.json
└── .env

Author
Prerna Jha
GitHub: https://github.com/PrernaJha07

