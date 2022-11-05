const express = require('express');
const app = express();
const nodemon = require('nodemon');
app.use(express.json());

//MongoDB Package
const mongoose = require('mongoose');

const PORT = 1200;
let today = new Date().toLocaleDateString()

const dbUrl = "mongodb+srv://dbadmin:admin@mongo.zjgsurz.mongodb.net/test";

//Connect to MongoDB
mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
});

//MongoDB Connection
const db = mongoose.connection;

//Handle DB Error, display connection
db.on('error', () => (
    console.error.bind(console, 'connection error: ')
));
db.once('open', () => {
    console.log('MongoDB Connected');
});

//Schema/Model Declaration
require('./Models/Students');
require('./Models/Courses');

const Student = mongoose.model('Student');
const Course = mongoose.model('Course');

app.get('/', (req,res) => {
    return res.status(200).json("{message: OK}")
});

app.get('/getAllCourses', async (req,res) => {
    try {
        let programs = await Course.find({}).lean();
        return res.status(200).json(programs);
    }
    catch {
        return res.status(500).json("{message: Failed to access course data}");
    }
});

app.get('/getAllStudents', async (req,res) => {
    try {
        let learners = await Student.find({}).lean();
        return res.status(200).json(learners);
    }
    catch {
        return res.status(500).json("{message: Failed to access student data}");
    }
});

app.get('/findStudent', async (req,res) => {
    try {
        const query = Student.find();
        query.setOptions({ lean : true });
        query.collection(Student.collection);
        query.where('fname').gte("First").exec(callback);

        return res.status(200).json(query);
    }
    catch {
        return res.status(500).json("{message: Failed to access student data}");
    }
});

app.get('/findCourse', async (req,res) => {
    try {
        let programs = await Course.find({
            courseInstructor: req.body.courseInstructor,
            courseCredits: req.body.courseCredits,
            courseID: req.body.courseID,
            courseName: req.body.courseName}).exec();
        return res.status(200).json(programs);
    }
    catch {
        return res.status(500).json("{message: Failed to access course data}");
    }
});

app.post('/addCourse', async (req,res) => {
    try {
        let program = {
            courseInstructor: req.body.courseInstructor,
            courseCredits: req.body.courseCredits,
            courseID: req.body.courseID,
            courseName: req.body.courseName
        }

        await Course(program).save().then(c => {
            return res.status(201).json("Course Added!");
        })
    }
    catch {
        return res.status(500).json("{message: Failed to add course - bad data}");
    }
});

app.post('/addStudent', async (req,res) => {
    try {
        let learner = {
            fname: req.body.fname,
            lname: req.body.lname,
            studentID: req.body.studentID
        }

        await Student(learner).save().then(c => {
            return res.status(201).json("Student Added!");
        })
    }
    catch {
        return res.status(500).json("{message: Failed to add student - bad data}");
    }
});

app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}`);
});