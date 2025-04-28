const mongoose = require('mongoose');

// Define the schema for the student
const studentSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true, 
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,  // Ensures phone number is unique
    match: [/^\d{10}$/, 'Please enter a valid phone number.']  // Validates 10-digit phone number
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address.']  // Validates email format
  },
  profile_pic: {
    type: String,  // You can store the path/URL to the profile picture
    default: 'default.jpg'  // Default profile picture if none is provided
  }
});


const Student = mongoose.model('Student', studentSchema);


module.exports = Student;
