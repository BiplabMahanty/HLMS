const express = require("express");
const cors = require("cors"); // Import cors

const app = express();
require('dotenv').config();
require("./models/db");
const bodyParser = require("body-parser");
const path = require("path");

const sellerRouter=require( "./router/sellerRouter");
const authRouter = require("./router/authRouter");

const PORT = process.env.PORT || 4000;

// Enable CORS - Add this BEFORE other middleware
app.use(cors(
 { 
  origin:[
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://192.168.1.34:3000",
    //add production url
  ],
  credentials:true,
}
));

app.use(bodyParser.json());
app.use(express.json()); 

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get("/", (req, res) => {
    res.json({ message: "This API is connected" });
});

app.use('/api/auth', authRouter);
app.use('/api/seller', sellerRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});