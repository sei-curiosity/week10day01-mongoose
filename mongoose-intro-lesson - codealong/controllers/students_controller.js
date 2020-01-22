const express = require('express')
const router = express.Router()

const Schema = require("../db/schema.js")
const StudentModel = Schema.StudentModel
const ProjectModel = Schema.ProjectModel

//get all students (Index route)
router.get('/students', (request, response) => {
    StudentModel.find({})
    .then((students)=> {
        response.send({
            students : students
        })
    })
})


// new student

router.post('/students', (request, response) => {
    const newStudent = request.body
    let newstud = new StudentModel({"name": newStudent.name, 
    "projects": newStudent.projects})
    newstud.save()
    .then((student)=> {
        response.redirect(`/students/${student._id}`)
    })
})

// get a specific student by id
router.get('/students/:studentID/', (request, response) => {
    const studentID = request.params.studentID
    StudentModel.findById(studentID)
    .then((student)=> {
        response.send({
            student : student
        })
    })
})


//update a specific student by its id
router.patch('/students/:studentID/', (request, response) => {
    const studentID = request.params.studentID
    const updatedStudent = request.body
    console.log(request.body)
    StudentModel.findByIdAndUpdate(studentID, updatedStudent)
    .then((student)=> {
      response.redirect(`/students/${student._id}`)
    })
})

//delete

router.delete('/students/:studentID/', (request, response) => {
    const studentID = request.params.studentID
    StudentModel.findByIdAndDelete(studentID)
    .then(()=> {
        response.redirect('/students')
    })
})

module.exports = router


