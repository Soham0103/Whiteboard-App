const express = require('express');
const app = express();
const cors = require('cors');
const connectToDB= require('./db.js');
const userRoutes = require('./routes/userRoutes.js');
const canvasRoutes = require('./routes/canvasRoutes.js');
const http = require("http");
const {Server} = require("socket.io");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require('dotenv').config();
const Canvas = require('./models/canvasModel');


const Secret_Key = process.env.JWT_SECRET_KEY;


connectToDB();

//
//Middlewares
app.use(express.json()); //Parses the req.body, without this it's undefined
app.use(cors());  // Enable CORS for all routes and origins


app.use('/api/users',userRoutes);
app.use('/api/canvas',canvasRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000",], 
      methods: ["GET", "POST"],
    },
  });

let canvasData = {};
let i = 0;
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
  
    socket.on("joinCanvas", async ({ canvasId }) => {
        console.log("Joining canvas:", canvasId);
        try {
        const authHeader = socket.handshake.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("No token provided.");
            setTimeout(() => {
              socket.emit("unauthorized", { message: "Access Denied: No Token" });
          }, 100);
            return;
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, Secret_Key);
        const userId = decoded.userId;
        console.log("User ID:", userId);

        const canvas = await Canvas.findById(canvasId);
        console.log(canvas)
        if (!canvas || (String(canvas.owner) !== String(userId) && !canvas.shared.includes(userId))) {
            console.log("Unauthorized access.");
            setTimeout(() => {
                socket.emit("unauthorized", { message: "You are not authorized to join this canvas." });
            }, 100);
            return;
        }

        // socket.emit("authorized");
  
        socket.join(canvasId);
        console.log(`User ${socket.id} joined canvas ${canvasId}`);
  
        if (canvasData[canvasId]) {
            console.log(canvasData)
          socket.emit("loadCanvas", canvasData[canvasId]);
        } else {
          socket.emit("loadCanvas", canvas.elements);
        }
      } catch (error) {
        console.error(error);
        socket.emit("error", { message: "An error occurred while joining the canvas." });
        }
    });

    socket.on("drawingUpdate", async ({ canvasId, elements }) => {
        try {
          canvasData[canvasId] = elements;
    
          socket.to(canvasId).emit("receiveDrawingUpdate", elements);
    
          const canvas = await Canvas.findById(canvasId);
          //if (canvas) {
            // console.log('updating canvas... ', i++)
            await Canvas.findByIdAndUpdate(canvasId, { elements }, { new: true, useFindAndModify: false });
          //}
        } catch (error) {
          console.error(error);
        }
      });
    
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

server.listen(3030, () => console.log("Server running on port 3030"));

