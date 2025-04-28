const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();
const port = 3000;
const studentRoutes = require('./routes/student.routes.js');
const connectdb = require('./config/dbconfig.js');
connectdb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // Support PUT/DELETE from forms
app.use(express.static(path.join(__dirname, 'public')));
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads'))); // Serve Uploads folder
console.log('Serving static files from:', path.join(__dirname, 'public'));
console.log('Serving uploads from:', path.join(__dirname, 'Uploads'));
app.set("view engine", "ejs");

// Routes
app.use('/', studentRoutes);

// Root route for home page
app.get("/", (req, res) => {
    res.render("index", { activePage: 'home' });
});
app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(process.env.PORT || port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});