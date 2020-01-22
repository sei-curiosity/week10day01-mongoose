let mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/students',  
{useNewUrlParser: true , useUnifiedTopology: true })

let db = mongoose.connection

db.on('error', function (err) {
    console.log(err)
})

db.once('open', function() {
    console.log("database successfully connected")
})

let Schema = mongoose.Schema

let ProjectSchema = new Schema ({
    title: String,
    unit: String
})

let StudentSchema = new Schema ({
    name: String,
    age: Number,
    projects: [ProjectSchema]
})

let ProjectModel = mongoose.model("Project", ProjectSchema)
let StudentModel = mongoose.model("Student", StudentSchema)

module.exports = {
    StudentModel: StudentModel,
    ProjectModel: ProjectModel
}

// db.close()

// let frankie = new StudentModel({ name: "Frankie P.", age: 30 });
// // Then we save it to the database using .save
// frankie.save()
//   .then((student) => {
//     console.log(student);
//   })
//   .catch((error) => {
//     console.log(error)
//   })

//   StudentModel.create({name: 'frankie 2', age: 31})
//   .then((student) => {
//     console.log(student);
//   })
//   .catch((error) => {
//     console.log(error)
//   })

// let anna = new StudentModel({ name: "Anna", age: 28 });
// let project1 = new ProjectModel({ title: "memory game", unit: "JS" });
// let project2 = new ProjectModel({ title: "memory game2", unit: "JS" });
// let project3 = new ProjectModel({ title: "memory game3", unit: "JS" });
// // Now we add that project to a student's collection / array of projects.
// anna.projects.push(project1);
// anna.projects.push(project2);
// anna.projects.push(project3);

// // In order to save that project to the student, we need to call `.save()` on the student -- not the project.
// anna.save()
//   .then((anna) => {
//     console.log(anna)
//   })
//   .catch((error) => {

//   })