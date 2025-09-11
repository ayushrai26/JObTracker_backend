console.log("🚀 server.js starting up...");
const express = require('express')
const userRoutes = require('./routes/users')
const multer = require('multer')
const upload = require('./routes/uploads')
const path = require('path')
const cors = require('cors')
const PORT = process.env.PORT || 5000;
require('dotenv').config()
const mongoose = require('mongoose')
const app = express();
const adminRoutes = require('./routes/admin')
app.use(cors());
app.use(express.json())
app.use('/upload',upload)
app.use('/',userRoutes)
app.use('/admin',adminRoutes)
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));
app.listen(PORT,()=>
    console.log('connected')
)

