
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import app from './src/app.js'
import connectDB from './config/database.js'

connectDB();
console.log("PRIVATE KEY:", process.env.IMAGEKIT_PRIVATE_KEY);
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log('✅ Server is running on port '+PORT);
})