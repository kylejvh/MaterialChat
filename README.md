# MaterialChat



> A real-time, multi-user chat application built using React, Material-UI and Socket.io/Node.js/Express. 

## **Production Build: <a href="https://kjvh-materialchat.herokuapp.com/login" target="_blank">Demo</a>**

**Please be patient, Heroku servers can take a minute to spin up from sleep.**

![Recordit GIF](http://g.recordit.co/ziudxn6SPn.gif)

---

## Features
 
- Fully persitent: Create chatrooms, send messages, and customize your username and avatar - all saved on the backend database.

- Realtime: Interact in chatrooms as you wish. New messages, chatrooms, and active users will update nearly instantly.

---

## Libraries and Technologies

**Frontend**
 
- Built with React, React Hooks, and Redux.
- Uses Material-UI styled components and design system.
    
**Backend**

- Node.js/Express
- MongoDB, Mongoose
- JWT, SendGrid, Stripe


**Additional**

- Uses socket.io for realtime events such as messaging, chatroom tracking, active user lists, and typing notifiers.
- Basic Cypress and Jest tests are included and will be improved as time allows. 

---

## Project Setup

This project is set up as a monorepo - it has separate `package.json` files for the client and server. 
The root directory `package.json` is set up for the backend server, and the `package.json` inside the `client` folder is for the Create-React-App based client.


**Backend Configuration**

The backend server will not function without a MongoDB server and the correct cofiguration variables. In the future, I may use Docker to make this easier to get up and running.
For now, you will need:

- MongoDB server
- JWT
- SendGrid API key

**Setup Steps**

1. Fork or clone this repository.

2. Install the required dependencies for the server and client by navigating to the root project directory and running:

 ```
 npm i
 cd client
 npm i
```

3. Configure the backend server using the configuration guidelines above.

4. To run the application in development, you will have to run the commands to start the server, and change directories to start the client dev server. From the root directory, run:

```
npm run server
cd client
npm start
```

5. Navigate to [localhost:3000](http://localhost:3000) in your browser and you should see the client dev server.

6. If the backend server is configured and running, you can make requests at `localhost:3100` with Postman or other development tools.

---

## Contact

> Reach out to me with questions, comments, etc: 
- kylejvh@gmail.com

> My portfolio: 
- <a href="https://www.kylejvh.com/" target="_blank">kylejvh.com</a>
