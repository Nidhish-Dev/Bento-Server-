// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/user');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use('/api/users', userRoutes);

app.get("/", (req,res)=>{
    res.send("Hello From Server");
   });

const PORT = process.env.PORT || 8000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
