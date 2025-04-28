const express = require('express');
const router = express.Router();
const Student = require('../models/student.model.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pathModule = require('path');

const multerstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './Uploads');
    },
    filename: (req, file, cb) => {
        const name = "Annu-" + Date.now() + path.extname(file.originalname);
        cb(null, name);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image types are allowed'), false);
    }
};

const upload = multer({
    storage: multerstorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5 MB limit
    }
});

// Helper function to delete the old profile image file from the server
const deleteFile = (filename) => {
    const filePath = pathModule.join(__dirname, '..', 'Uploads', filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file
    }
};

// API Routes
// READ: Get all student records
router.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching student records', error: error.message });
    }
});

// READ: Get a single student record by ID
router.get('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching student record', error: error.message });
    }
});

// CREATE: Add a new student record
router.post('/api/students', upload.single('profile_pic'), async (req, res) => {
    const { first_name, last_name, gender, email, phone } = req.body;

    // Validation checks
    if (!first_name || !last_name || !gender || !email || !phone) {
        return res.status(400).render('add-student', {
            activePage: 'students',
            error: 'Missing required fields: first_name, last_name, gender, email, or phone'
        });
    }

    try {
        const student = await Student.create({
            first_name,
            last_name,
            email,
            phone,
            gender,
            profile_pic: req.file ? req.file.filename : 'default.jpg'
        });
        res.redirect('/students');
    } catch (error) {
        res.status(400).render('add-student', {
            activePage: 'students',
            error: error.message
        });
    }
});

// UPDATE: Update a student record by ID
router.put('/api/students/:id', upload.single('profile_pic'), async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).render('edit-student', {
                activePage: 'students',
                error: 'Student not found',
                student: null
            });
        }

        // If a new image is uploaded, delete the old image
        if (req.file) {
            deleteFile(student.profile_pic); // Delete the old image file
            student.profile_pic = req.file.filename; // Update the profile_pic field
        }

        // Update other fields
        student.first_name = req.body.first_name || student.first_name;
        student.last_name = req.body.last_name || student.last_name;
        student.email = req.body.email || student.email;
        student.phone = req.body.phone || student.phone;
        student.gender = req.body.gender || student.gender;

        await student.save();
        res.redirect('/students');
    } catch (error) {
        res.status(400).render('edit-student', {
            activePage: 'students',
            error: error.message,
            student: req.body
        });
    }
});

// DELETE: Delete a student record by ID
router.delete('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).redirect('/students');
        }

        // Delete the image file associated with the student
        deleteFile(student.profile_pic);

        res.redirect('/students');
    } catch (error) {
        res.redirect('/students');
    }
});

// View Routes
// Student List Page
router.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.render('students', {
            students,
            activePage: 'students',
            message: null
        });
    } catch (error) {
        res.render('students', {
            students: [],
            activePage: 'students',
            message: { type: 'error', text: 'Error fetching students' }
        });
    }
});

// Add Student Page
router.get('/students/add', (req, res) => {
    res.render('add-student', { activePage: 'students', error: null });
});

// Edit Student Page
router.get('/students/edit/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.redirect('/students');
        }
        res.render('edit-student', {
            student,
            activePage: 'students',
            error: null
        });
    } catch (error) {
        res.redirect('/students');
    }
});

// View Student Page
router.get('/students/view/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.redirect('/students');
        }
        res.render('view-student', {
            student,
            activePage: 'students',
            error: null
        });
    } catch (error) {
        res.redirect('/students');
    }
});

// Delete Student (Redirect)
router.get('/students/delete/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.redirect('/students');
        }
        deleteFile(student.profile_pic);
        res.redirect('/students');
    } catch (error) {
        res.redirect('/students');
    }
});

module.exports = router;