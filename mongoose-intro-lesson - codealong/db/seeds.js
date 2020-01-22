let mongoose = require('mongoose');
let Schema = require("./schema.js");

let db = mongoose.connection

let StudentModel = Schema.StudentModel;
let ProjectModel = Schema.ProjectModel;

// First we clear the database of existing students and projects.
StudentModel.remove({})
  .then(() => {
    console.log('All students deleted!')
  })
  .catch((error) => {
    console.log(error)
  })

ProjectModel.remove({})
  .then(() => {
    console.log('All projects deleted!')
  })
  .catch((error) => {
    console.log(error)
  })

// Now, we will generate instances of a Student and of their Project.
const project1 = new ProjectModel({title: "Project 1!!!", unit: "JS"})
const project2 = new ProjectModel({title: "Project 2!!!", unit: "RAILS"})
const project3 = new ProjectModel({title: "Project 3!!!", unit: "REACT"})
const project4 = new ProjectModel({title: "Project 4!!!", unit: "EXPRESS"})

const projects = [project1, project2, project3, project4]

const ahmed = new StudentModel({name: "Ahmed" , projects: projects})
const maha = new StudentModel({name: "Maha", projects: projects})
const sami = new StudentModel({name: "Sami", projects: projects})
const salman = new StudentModel({name: "Salman", projects: projects})

const students = [ahmed, maha, sami, salman];

StudentModel.insertMany(students)
  .then(() => {
    console.log(`Added ${students.length} students to database.`)
  })
  .catch((error) => {
    console.log(error)
  })
  .then(()=> db.close())