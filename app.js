const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express'); 
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const router = require('./routes/student.routes.js');
const connectdb = require('./config/dbconfig.js');
connectdb();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')));
console.log(path.join(__dirname, 'public'));
app.set("view engine","ejs")
app.use('/api/students',require('./routes/student.routes.js'));
// Start the server

app.get("/",(req,res)=>{
  res.render("index.ejs")
})
app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
