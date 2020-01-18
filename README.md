[![General Assembly Logo](https://camo.githubusercontent.com/1a91b05b8f4d44b5bbfb83abac2b0996d8e26c92/687474703a2f2f692e696d6775722e636f6d2f6b6538555354712e706e67)](https://generalassemb.ly/education/web-development-immersive)

# Intro to Mongoose + Embedded Documents

## Learning Objectives

- Differentiate between NoSQL and SQL databases.
- Explain what Mongoose is.
- Describe the role of Mongoose schema and models.
- Use Mongoose to perform CRUD functionality.
- List and describe common Mongoose queries.
- Persist data using Mongoose embedded documents.
- Describe how to use validations in Mongoose.

<br />

## Opening Framing (10 minutes / 0:10)

Before we dive into Mongoose, let's talk a bit about about Mongo/NoSQL.

#### What is a NoSQL database?

A NoSQL database is a non-relational database.

* This means that there is not an explicit one-to-one, one-to-many and many-to-many relationship.
* That being said, we can emulate these relationships in a NoSQL database.

#### How is a NoSQL database organized?

A NoSQL database are organized into **documents** and **collections**.

* Collections are the NoSQL equivalent of tables in a SQL database.
* Documents are the NoSQL equivalent of a table row.

> This is not the only way that a NoSQL database organizes data. Check out this [link](http://www.techrepublic.com/blog/10-things/10-things-you-should-know-about-nosql-databases/) to learn more.

#### What is MongoDB?

MongoDB is a NoSQL database that stores information as JSON.

* Technically, it's BJSON or "binary JSON," pronounced "BSON". We will discuss [BSON](http://bsonspec.org/) more in a few minutes.

#### Why use NoSQL/MongoDB over SQL?

It is flexible.

* You don't need to follow a schema if you don't want to. This might be helpful with non-uniform data. 
* That being said, you can enforce consistency in your data by using schemas. In fact, we will be doing that in today's class.  And I recommend that you follow this same work-flow.

It is fast.

* Data is "denormalized" in NoSQL, which means that it is all in the same place.
* For example, a post's comments will be nested directly within that post, in the database.
* This is the opposite of a relational database, in which we need to make queries in order to retrieve data in other tables.  The tables are connected through a relation.

Many web applications already implement object-oriented Javascript.

* If we are using objects in both the back-end and front-end, it makes handling and sending data between the client and the database much easier.
* There is no need for type conversion (e.g., making sure a Ruby hash is being served as JSON).

#### What are some example MongoDB commands?

Even though you won't be writing very many MongoDB commands in SEI, we will use some MongoDB CLI commands to test what is in our database. Examples include...

* `show dbs` - Will show a list of all databases
* `use database-name` - Will connect to a database
* `show collections` - Will list the collections that exist within a database
* `db.students.find()` - Will list all of the students in the student collection


#### Data Format

![](https://i.imgur.com/ZAQOhhY.png)

- A MongoDB database consists of _collections_ of _documents_.
- A _document_ in MongoDB is composed of _field_ (key) and _value_ pairs.

Lets take a look of what a MongoDB _document_ may look like:

```js
{
    _id: ObjectId("5099803df3f4948bd2f98391"),
    name: { first: "Alan", last: "Turing" },
    birth: new Date('Jun 23, 1912'),
    death: new Date('Jun 07, 1954'),
    contribs: [ "Turing machine", "Turing test", "Turingery" ],
    views: 1250000
}
```

Who is [Alan Turing](http://www.pbs.org/newshour/updates/8-things-didnt-know-alan-turing/)?

__What does this data structure remind you of?__ JSON!

A MongoDB _document_ is very much like JSON, except that it is stored in the database, in a format known as _BSON_ (think _Binary JSON_).

_BSON_ basically extends _JSON_ with additional data types, such as __ObjectID__ and the __Date__ shown above.

#### The Document *_id*

The *_id* is a special field that represents the document's _primary key_ and will always be listed as the first field. It must be unique.  Primary keys will become very important in relational/SQL databases, and also when we discuss embedded documents.

We can explicitly set the *_id* like this:

```js
{
  _id: 2,
  name: "Suzy"
}
```
or this...

```js
{
  _id: "ABC",
  name: "Suzy"
}
```
However, it is more common to allow MongoDB to create it implicitly for us, using it's _ObjectID_ data type.

<br />

## Mongoose (5 minutes / 0:15)

![mongoose.js](https://www.filepicker.io/api/file/KDQZV88GTIaQn6p0GagE)

> "Let's face it, writing MongoDB validation, casting and business logic boilerplate is a drag. That's why we wrote Mongoose."

**Mongoose** is an ODM (Object Data Mapping), that allows us to encapsulate and model our data in our applications. It gives us access to additional helpers, functions and queries to simply and easily perform CRUD actions.

Mongoose will provide us with the similar functionality to interact with MongoDB and Express, as Active Record will do with PostgreSQL and Rails.

> Active Record is an ORM (Object Relational Mapper). An ODM is the same thing as an ORM, without the relations.

Here's an example of some Mongoose code pulled from  [their documentation](http://mongoosejs.com).

```js
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

let Cat = mongoose.model('Cat', { name: String });

let kitty = new Cat({ name: 'Zelda' });

kitty.save(function (err) {
  if (err) // { do something }
  
  console.log('meow');
});
```

<br />

## I Do: Set Up for Mongoose Intro Lesson App (5 minutes / 0:20)

1. Create a new project folder in your `/class-exercises` folder: `$ mkdir mongoose-intro-lesson`

2. `cd` into the new folder. 
3. `$ npm init -y`

3. Create a new database directory inside that folder: `$ mkdir db`

4. Create the following files: `$ touch server.js db/schema.js db/seeds.js`

5. Open the app in VSCode: `$ code .`
    - make sure that your entry point is `server.js`, and not `index.js`.

Your folder structure should look like this:

![](https://i.imgur.com/Mc52tFo.png)

<br />

### &#x1F535; YOU DO (2 minutes)

Walk through the previous steps to set-up your app

<br />

## I Do: Mongoose and Connection Set Up (5 minutes / 0:25)

For today's in-class Mongoose demonstrations, we will be creating an app that uses two models: `Students` and `Projects`. 

Let's begin by installing Mongoose into our project folder...

```bash
$ npm install mongoose
```

In order to have access to `mongoose` in our application, we need to explicitly require Mongoose and open a connection to the database that we specify.

```js
// in the db/schema.js

let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/students');
```

The name above `students` will be the name of the app's Mongo database. A cool feature of Mongo is that we don't have to create this database initially. If the database doesn't exist Mongo will instantiate it the first time you try to save something. 

```js
// in the db/schema.js

let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/students');

// Now that we are connected, let's save that connection to the database in a letiable. We are just doing this to keep our code DRY.
let db = mongoose.connection;

// Will log an error if db can't connect to MongoDB
db.on('error', function(err) {
  console.log(err);
});

// Will log "database has been connected" if it successfully connects.
db.once('open', function() {
  console.log("database has been connected!");
});

// Disconnect from database
db.close();
```

Now let's run our `db/schema.js` file:

```bash
$ node db/schema.js
```

<br />


### &#x1F535; YOU DO (2 minutes)

Walk through the previous steps

<br />

## Mongoose Schema & Models (10 minutes / 0:40)

#### What is a Mongoose Schema?

* Everything in Mongoose starts with a Schema!
* Mongo is schema-less and doesn't require much structure (but it is still a good idea to use a schema).
* Schemas are used to define attributes and structure our documents.
* Each Schema maps to a MongoDB collection and defines the shape of the documents within that collection.

Here's an example of a Mongoose schema...

```js
// in the db/schema.js

// First, we instantiate a namespace for our Schema constructor defined by mongoose.
let Schema = mongoose.Schema;

let StudentSchema = new Schema({
  name: String,
  age: Number
});
```

> Mongo will add a primary key to each object using `ObjectId`. This will be referenced as an `id` property on each new instance of the object.

#### What are Mongoose Models?

**[Mongoose Models](http://mongoosejs.com/docs/models.html)** will represent documents in our database.

* They are essentially constructor functions, which will allow us to preform CRUD actions within our MongoDB Database.
* Models are defined by passing a Schema instance to `mongoose.model`.

```js
// db/schema.js

let Schema = mongoose.Schema;

// First, we instantiate a namespace for our Schema constructor defined by mongoose.
let StudentSchema = new Schema({
  name: String,
  age: Number
});

let StudentModel = mongoose.model("Student", StudentSchema);
```

`.model()` makes a copy of the schema.

* The first argument is the singular name of the **collection** that your model is for. Mongoose automatically looks for the plural version of your model name.
* This means that the model name `Student` will correspond to the `students` collection in the database.

<br />

### &#x1F535; YOU DO (2 minutes)

Add the code above to your `db/schema.js` file

<br />

### Mongoose - Schema - Model Summary
_Mongoose_ is an _ODM_ - an **O**bject **D**ocument **M**apper - i.e. it maps objects to documents. Therefore, Mongoose gives us the ability to perform the _CRUD_ operations on a _MongoDB_ database using JavaScript objects as our model objects.

> A _model_ object is an object whose primary concern is to hold data, and represent an instance of a [Domain Model](https://en.wikipedia.org/wiki/Domain_model). For example, if we were developing an application for Delta, we might have Domain Models for Airports, Flights, Passengers, Luggage, etc.  Instances of an Airport Domain Model might be ATL, LAX, JFK, ABQ, etc.

![Object Document Mapping](https://i.imgur.com/YhAXdCB.png)

<br />

## Collections: Embedded Documents & References (10 minutes / 0:50)

Let's add another model to our `db/schema.js`.

* We will be adding a schema for `Project`, since I want to create an application that tracks Students and Projects.
* Like a one-to-many relationship in a relational database, a Student will have many Projects.

In Mongoose, we create this relationship by using **embedded documents**.

<br />

### I Do: Embedded Documents

[Embedded Documents](http://mongoosejs.com/docs/2.7.x/docs/embedded-documents.html) -- sometimes referred to as "sub-documents" -- are schemas of their own, as well as elements in a parent document's array

* They contain all of the same features as normal documents.


```js
// in the db/schema.js

let ProjectSchema = new Schema({
  title: String,
  unit: String
});

let StudentSchema = new Schema({
  name: String,
  age: Number,
  projects: [ProjectSchema]
});

let ProjectModel = mongoose.model("Project", ProjectSchema);
let StudentModel = mongoose.model("Student", StudentSchema);
```
> The **projects key** in your `StudentSchema` document, will contain a special array that has specific methods that work with embedded documents.
>
> The Project Schema must be defined prior to our main Student Schema.

#### Advantages
* Easy to conceptualize and set up.
* Can be accessed quickly.

#### Disadvantages
* Do not scale well. Documents cannot exceed 16MB in size.

> If you find that you are nesting documents within documents for 3+ levels, you should probably look into a relational database. Check Multiple collections (below) for more info.

<details>
	<summary>Multiple Collections & References</summary>

Similar to how we use foreign keys to represent a one-to-many relationship in a SQL database, we can add [references](https://docs.mongodb.org/manual/tutorial/model-referenced-one-to-many-relationships-between-documents) to documents in other collections by storing an array of `ObjectIds` that references document Ids from another model.

```js
// in the db/schema.js

let ProjectSchema = new Schema({
  title: String,
  unit: String,
  students: [{type: Schema.ObjectId, ref: "Student"}]
});

let StudentSchema = new Schema({
  name: String,
  age: Number,
  projects: [ {type: Schema.ObjectId, ref: "Project"}]
});

let StudentModel = mongoose.model("Student", StudentSchema);
let ProjectModel = mongoose.model("Project", ProjectSchema);
```

> Since we are using an Id to refer to other objects, we use the ObjectId type in the schema definition. The `ref` attribute must match the model used in the definition.

#### Advantages
* Could offer greater flexibility when querying.
* Might be a better decision for scaling.

#### Disadvantages
* Requires more work. Need to find both documents that have the references (i.e., multiple queries).
* Not the way that Mongo was meant to be used.
</details>
<br />

### &#x1F535; YOU DO (2 minutes)

Set Up a Schema and the Model for Projects.

<br />

## CREATE Students and Projects (10 minutes / 1:20)

First let's create an instance of our Student model. Below is an example that describes one way of doing this...

```js
// in the db/schema.js

// First we create a new student. It's just like generating a new instance of a constructor function!
let frankie = new StudentModel({ name: "Frankie P.", age: 30 });

// Then we save it to the database using .save

frankie.save()
  .then((student) => {
    console.log(student);
  })
  .catch((error) => {
    console.log(error)
  })
```

> Wait, what is this `.then` and `.catch` thing all about?  This is called a Promise!  Let's take a few minutes to explore what this is:

<details>
	<summary>--Promises Explained--</summary>

## Introduction

Welcome to the Promise land! Promises drive a lot of modern programming practices, and it is what allows Node apps to operate asynchronously.  Today's lesson largely covers WHY and HOW to use a promise, and starting with the next class we will utilize these concepts to fetch data from MongoDB.

<details>
	<summary>You Do (10 Minutes)</summary>
	
Read this: [Promises For Dummies](https://scotch.io/tutorials/javascript-promises-for-dummies). 

If you read this yesterday, go through and read it again! What did you pick up this time that you didn't see before?
</details>

<!-- https://spring.io/understanding/javascript-promises -->
  
## Synchronicity

<details>
<summary>Comcast Example</summary>
  
Check out this setup: 
  
  1. Jim is the one person in all of Comcast media who can help you with you get your internet to work correctly.
  2. Naturally, Jim is very popular.
  3. Jim is always available by phone, but he can only talk to one person at a time.
  4. Some people naturally want to talk to Jim for a MUCH longer time than others... which angers some of his other customers and increases the total wait time.

This is an example of synchronous communication.  In the example, he would listen and address people's problems, but was only able to help one person at a time.

Let's use this same metaphor to explain what we mean when we talk about asynchronicity.

  1. Jim buys a answering machine for all of his phone calls.
  2. Customers now leave a message, and wait for Jim to call back.
  3. This allows Jim to respond to messages as soon as he has an answer, without keeping other customers on hold.


Promises in JavaScript are like these answering machines.  It allows us to write responses for code that takes a while to prepare.
</details>

<details>
<summary>Things that use promises</summary>

These are some events that use Promises to handle asynchronous code:
  
  - Waiting for a **response to an HTTP request**.
  - Waiting for a **database** to retrieve/modify a piece of data.
  - Hitting a 3rd party API for **authentication** (Facebook, Twitter, etc)
  - Waiting on **DOM events** (driven by user interaction).

These are some examples of asynchronous code that don't use Promises out of the box:

  - Waiting for a **timer** to run out.
  - Waiting for the **filesystem** to read from, or to write to, a file.

In all of these examples, your JavaScript code is _waiting for something to happen_, and there's no telling how long that 'something' will take.
</details>

Even though all of this sounds new, we've already seen an alternative way to handle code that is waiting for something to happen. 

<summary>Previous Ways We've Dealt with Async Calls</summary>

So how can we tell our code to wait for something to finish?  Node actually uses the same approach that the browser does -- callbacks.

By setting a callback as an event handler, we can defer its execution until the event it's listening for occurs. Future steps can then be triggered by more callbacks.

  ```js
 app.get('/', (req, res) =>{
   //Do stuff when this route is hit on the server
 })

 $('div').on('click', function(e){
   //Do stuff when a user makes an interaction in the browser
 })
  ```

## "Callback Hell" : Drawbacks to Callbacks

  OK, that's fine for doing things that involve one 'slow' step. But what if
  there's _more than one_ 'slow' thing we have to deal with?

  ![Stamp](https://media2.giphy.com/media/1xkMJIvxeKiDS/200w.gif)
  ![Staple](https://media3.giphy.com/media/l2JI9JdUDjxVbd20g/200w.gif)

<details>
<summary>Callback Hell Example</summary>

For instance, let's say we need to do all of the following:

  1. Read in data from a file
  2. Parse the data as CSV content
  3. Fetch JSON from a 3rd party server.
  4. Take the response and store data into a database.
  5. Send a response back to the user.

Phew. How might that look if we try to use callbacks to handle that whole process?

Maybe something like this?

  ```js
  fs.readFile('./data-csv', function(err, data){  // read a file
    if(err) throw err;

    csv.parse(data, function(err, csvData){       // parse the data as CSV
      if(err) throw err;

      var url = csvData[0].url;
      var req = http.request({host: url}, function(res){ // make an HTTP request
        var responseData = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        res.on('end', () => {                            // collect the response
          ResponseMessages.create({body: responseData},  // add record to a DB
            function(err, messageRecord){
            if (err) throw err;

            res.render('response', responseData);
          })
        });
      });
      req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
      });

    })

  });
  ```

  Or how about this? 

  ![](https://i.imgur.com/EGGwaXP.png)
  
  ![](https://i.imgur.com/KqDiYWQ.png)

  ![Head Bang](https://media4.giphy.com/media/OT69wDOihxqEw/200w.gif)

  Wow, that's some deep nesting. This makes code looks complicated and messy.
  It's not easy to follow.  And it isn't DRY -- do you really need a separate system for handling errors at every stage in the
  process?
</details>

<details>
<summary>Drawbacks to Callbacks</summary>

Asynchronous code necessitates callbacks.
But dealing with lots of callbacks can be tricky:

-   Callbacks can be messy when they're nested: "callback hell".
    - [http://callbackhell.com/](http://callbackhell.com/)
-   Each callback will have to handle it's own errors if necessary.
-   In complex programs, it will be hard to tell in what order callbacks fire.
-  As projects become more complex it becomes exponentially harder to refactor and add features.

Fortunately, there's a better way: Promises.
</details>

## Why Promises?

<details>
<summary>Explanation</summary>

Promises are an alternative to directly using callbacks.  The concept of promises in programming have been around for decades, but it first rose to prominence in JavaScript after jQuery introduced something called a deferred object.  This resulted in an explosion of JavaScript libraries vying to find the clearest and most efficient way to handle async code.  Libraries like `bluebird`, `q`, and `async` were very popular options.  As web development became more and more focused on getting data from a variety of endpoints through APIs, these libraries became absolutely necessary for a JavaScript developer.

Fast forward to 2015 and the approval of the ES6 spec.  One of the biggest additions to the JavaScript language is a native promise library.  Now we no longer need to import an extra library, because the concept of Promises is built into the language.

Promises are going to present us with several key advantages over traditional callback functions.

- Promises, like callbacks, make async explicit
  - This means that we can give specific instructions on what to do with data once it is recieved.
- Unlike callbacks, Promises clarify the order of execution.
  - This means that Promises are easier to read and it is clear what happens when.
- Promises simplify error handling.
</details> 

<details>
<summary>Anatomy of a Promise</summary>

A Promise object is a special object in JS that will always have one of 3 states.

- pending
- rejected (Failure)
- resolved (Success!)

This means that a Promise object holds a value that is _promised_ to be given back to you.  When we are working with a Promise object, we need to use two special methods to consume the object when it is either resolved or rejected.

### `Promise.then` and `Promise.catch`

`.then` and `.catch` are the two main methods we will be utilizing when working with promises.  Both methods take one argument, a function.  This function has a single argument, which is a value that represents the fulfilled data, or the error message.

Here is an example of what a function using promises will look like when we begin using it with MongoDB & Handlebars.

```js
//Disclaimer: getInfoFromDatabase is just an example method

getInfoFromDatabase()
  .then(function(data){ //Called when data is successfully fetched
    console.log("Successfully retrieved data");
    res.render('/', {
      data: data
    })
  })
  .catch(function(error){ //Gets called when data isn't successfully fetched
    console.error(error)

    res.send("Oh no, something went wrong")
  });
```

#### `.then`
`then` is a method on every `Promise` object. It is used to register an event
handler for the promise's "resolve" (aka success) event. When the promise resolves, function is invoked and passed onto the function via the argument.

#### `.catch`
`catch` is also method on every `Promise` object. It is used to register an event
handler for the promise's "reject" (aka failure) event. When the promise rejects, the handler
is invoked and passed the value (usually an `Error` object) the promised rejected
with as its argument.  This handler can be really valuable when trying to debug.

What are some scenarios where you imagine an Error may occur when fetching information from a database?
</details>

<details>
<summary>Promises Example</summary>

A promise is like an IOU in real life. When you go to a restaurant, you pay money and in return are _promised_ food in the near future.  When you put in your order there can be plenty of orders being worked on at once.  Each order gets delivered as soon as it is finished, and it is delivered for you to eat.  Additionally, there is a possibility that something goes wrong.  Your food is overcooked, your order gets lost, etc.  When something goes wrong, the restaurant will explicitly let you know (hopefully).
</details> 

<details>
<Summary>Using Promises to fetch data from an API</summary>

Later in the class, we will be using JavaScript to get info from 3rd party servers by utilizing APIs.  In simplest terms, an API is simply a server where various requests can be made and responses can be delivered in JSON.  (We will go into more detail later)

In this example, I am using a database called [OMDB, the Open Movie Database](http://www.omdbapi.com/).  This will allow me to hit an endpoint using a JavaScript library called `axios` and use promises to console log a successful response.

Watch me do this, and focus in on how `.then()` and `.catch()` is allowing us to write clean async code.

```
const axios = require("axios")

axios.get("http://www.omdbapi.com/?apikey=28cbce7c&s=starwars")
  .then((response) => {
    console.log("Success!")
    console.log(response.data)
  })
  .catch((error) => {
    console.log("Something went wrong")
    console.log(error.response.data)
  })
```
</details>

<details>
<summary>Chaining Promises Together</summary>

![](https://i.imgur.com/QpPS6zT.png)

As you build promises, you may find that you need to make multiple calls to a database or API.  Promises allow developers to take this more advanced logic and still present it in a clean way.

**AGAIN** Watch me do this.  We will go more in depth on APIs in the future, for now we should focus on the `.then` and `.catch` methods.

```js
const axios = require("axios")

//Search for all movies that match Star Wars
axios.get("http://www.omdbapi.com/?apikey=28cbce7c&s=star%20wars")
  .then((response) => {
    //Get the ID of the first response and search for more info on that specific movie.
    console.log("Search Success!")
    console.log(response.data)

    const firstId = response.data['Search'][0].imdbID
    console.log("Id of the first movie", firstId);
    //Make a second API call to a third party API
    return axios.get(`http://www.omdbapi.com/?apikey=28cbce7c&i=${firstId}`)
  })
  .then((response) => {
    console.log("Second Api call success!");

    console.log(response.data)
  })
  .catch((error) => {
    console.log("Something went wrong")
    console.log(error.response.data)
  })
```

As our request becomes more complicated, it's now easy to add another `.then()` callback and we can keep our async code in check in a clean way.

Notice that we only have one `.catch` block at the end.  This is another great feature of promises.  If ANY of our promises fail, then that single `.catch` block will be called and we can guarantee consistent actions across any error.
</details>

## Recap
- Promises allow us to make really complex async code readable and clean.
- Promises have 3 states. Pending, Resolved, and Rejected
- We will be consuming Promise objects when we interact with our MongoDB database and when we make API calls to a server.

</details>

Run `node db/schema.js` in the Terminal to run it. We can also consolidate this code into a single `.create` method, like so...

```js
// in the db/schema.js

StudentModel.create({ name: 'Frankie Q.', age: 31 })
  .then((student) => {
    console.log(student);
  })
  .catch((error) => {
    console.log(error)
  })
```

#### Why do we have two different ways to persist something to a database?

- Maybe we want to instantiate new instances of something for test purposes, but not actually save it to our database.
- Maybe we want to add something to the new object (like a date/timestamp) or do some additional validation checking before saving.
- **SIDE NOTE:** if you are using the new/save methods, we need to assign the object to a variable

<br />

### &#x1F535; YOU DO (2 minutes)

- Create a new instance of a Student using `new` + `.save`
- Create a new instance of a Student using `.create`

<br />

### I Do: Add Embedded Documents

Next, let's create a Project...

```js
// db/schema.js

let anna = new StudentModel({ name: "Anna", age: 28 });
let project1 = new ProjectModel({ title: "memory game", unit: "JS" });

// Now we add that project to a student's collection / array of projects.
anna.projects.push(project1);

// In order to save that project to the student, we need to call `.save()` on the student -- not the project.
anna.save()
  .then((anna) => {
    console.log(anna)
  })
  .catch((error) => {

  })
```

Run `node db/schema.js` in the Terminal to run the code.

<br />

#### &#x1F535; YOU DO - Practice Adding Students (10 min)

- Create a new Student and add a Project as an embedded document.

<br />


## Seed Data (10 minutes / 1:30)

Let's delete this create code, and actually add some seed some data in our database, from our `seeds.js` file. In order to do that, we need to make sure that we can connect the `schema.js` to the `seeds.js`. Comment out the code we created above, and add the following to the bottom of the `db/schema.js`.

```js
// in the db/schema.js

// The rest of our schema code is up here...

// By adding `module.exports`, we can reference these models in other files by requiring `schema.js`.
module.exports = {
  StudentModel: StudentModel,
  ProjectModel: ProjectModel
};
```

And add the following to `db/seeds.js`...

```js
// in the db/seeds.js

let mongoose = require('mongoose');
let Schema = require("./schema.js");

let StudentModel = Schema.StudentModel;
let ProjectModel = Schema.ProjectModel;
```

Now let's call some methods in `db/seeds.js` that will populate our database...

```js
// in the db/seeds.js

let mongoose = require('mongoose');
let Schema = require("./schema.js");

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
  .then(() => {
    db.close()
  })

```
Now, seed your database by running `node db/seeds.js` in your terminal. Use Ctrl + C to exit running Node.

Let's test if this all worked by opening Mongo in the Terminal...

```bash
$ mongo
$ show dbs
$ use students
$ show collections
$ db.students.find()
```
<br />

### &#x1F535; YOU DO (10 minutes / 1:45)

Add Seed data to your App 

<br />

### Callback Functions

Oftentimes, when making a Mongoose query, we will pass in a callback function (or use a Promise with `exec()`). It will be passed two arguments: `err` and `data`.

* `data` contains the result of the Mongoose query.

<details>

  <summary>Q: Why do you think callbacks/promises might be necessary when using Mongoose?</summary>

  > Because these queries are asynchronous! We want to make sure the query has finished before we run any code that depends on the result.

</details>

<br />

## Mongoose Queries - READ Index/Show (10 minutes / 1:55)

Mongoose provides us with a variety of helper methods that allow us to easily retrieve documents from our database.

> Explore them using the [Mongoose Queries Documentation](http://mongoosejs.com/docs/api.html#query-js).

```js
// Finds all documents of a specified model type. We can pass in a key-value pair(s) to narrow down the search.
Model.find({}, callback)

// Finds a single model by its id.
Model.findById(someId, callback)

// Find a single model using a key-value pair(s).
Model.findOne({someKey: someValue}, callback)

// Removes documents that match a key-value pair(s).
Model.remove({someKey: someValue}, callback)
```

Let's use `.find()` to implement the `index` functionality. We will do that in the controller file...

```bash
$ mkdir controllers
$ touch controllers/students_controller.js
```

> We are adding a `controllers` directory and `students_controller.js` file to mimic how we might define a controller in an Express application. We will follow REST conventions and use our controllers to listen for incoming requests and communication with our database.


```js
// in the controllers/students_controller.js

const express = require('express')
const router = express.Router()

const Schema = require("../db/schema.js")
const StudentModel = Schema.StudentModel
const ProjectModel = Schema.ProjectModel

router.get('/', (request, response) => {
  StudentModel.find({})
    .then((students) => {
      response.render('students/index', { 
        students: students
      })
    })
    .catch((error) => {
      console.log(error)
    })
})

module.exports = router

```

Now let's create a `show` method...


```js
// in the controllers/students_controller.js

const express = require('express')
const router = express.Router()

const Schema = require("../db/schema.js")
const StudentModel = Schema.StudentModel
const ProjectModel = Schema.ProjectModel

router.get('/', (request, response) => {
  StudentModel.find({})
    .then((students) => {
      response.send('students/index', { 
        students: students
      })
    })
    .catch((error) => {
      console.log(error)
    })
})

router.get('/:studentId', (request, response) => {
  const studentId = request.params.studentId

  StudentModel.findById(studentId)
    .then((student) => {
      response.render('students/show', {
        student: student
      })
    })
})

module.exports = router

```

<br />

### &#x1F535; YOU DO  - Index, Show, Update and Delete (15 minutes / 2:10)

Follow the above instructions to implement `index` and `show` for the Student model.

Then use the [Mongoose documentation](http://mongoosejs.com/docs/api.html#query-js) to figure out how to Update and Delete students. If the documentation proves difficult to navigate, don't be afraid to Google it! We will go over how to Update and Delete after the exercise...

<br />


## I Do: Update & Delete (10 minutes / 2:25)

> Don't look at these while working on the previous exercise!

<details>
  <summary>**This is how to update...**</summary>

  ```js
  // in the controllers/students_controller.js

  const express = require('express')
  const router = express.Router()

  const Schema = require("../db/schema.js")
  const StudentModel = Schema.StudentModel
  const ProjectModel = Schema.ProjectModel

  router.get('/', (request, response) => {
    StudentModel.find({})
      .then((students) => {
        response.send('students/index', { 
          students: students
        })
      })
      .catch((error) => {
        console.log(error)
      })
  })

  router.get('/:studentId', (request, response) => {
    const studentId = request.params.studentId

    StudentModel.findById(studentId)
      .then((student) => {
        response.render('students/show', {
          student: student
        })
      })
  })

  router.put('/:studentId', (request, response) => {
    const studentId = request.params.studentId
    const updatedStudent = request.body

    StudentModel.findByIdAndUpdate(studentId, updatedStudent, {new: true})
      .then((student) => {
        console.log(`${student.name} updated!`)
      })
      .catch((error) => {
        console.log(error)
      })
  })

  module.exports = router

  ```

  > **Important:** We are inserting {new: true} as an additional option. If we do not, we will get the old document as the return value -- not the updated one.

</details>

<details>

  <summary>**This is how to delete...**</summary>

  ```js
  // in the controllers/students_controller.js

  const express = require('express')
  const router = express.Router()

  const Schema = require("../db/schema.js")
  const StudentModel = Schema.StudentModel
  const ProjectModel = Schema.ProjectModel

  router.get('/', (request, response) => {
    StudentModel.find({})
      .then((students) => {
        response.send('students/index', { 
          students: students
        })
      })
      .catch((error) => {
        console.log(error)
      })
  })

  router.get('/:studentId', (request, response) => {
    const studentId = request.params.studentId

    StudentModel.findById(studentId)
      .then((student) => {
        response.render('students/show', {
          student: student
        })
      })
  })

  router.put('/:studentId', (request, response) => {
    const studentId = request.params.studentId
    const updatedStudent = request.body

    StudentModel.findByIdAndUpdate(studentId, updatedStudent, {new: true})
      .then((student) => {
        response.redirect(`/students/${studentId}`)
      })
      .catch((error) => {
        console.log(error)
      })
  })

  router.delete('/:studentId', (request, response) => {
    const studentId = request.params.studentId

    StudentModel.findByIdAndRemove(studentId)
      .then(() => {
        response.redirect('/students')
      })
      .catch((error) => {
        console.log(error)
      })
  })

  module.exports = router

  ```

</details>

<br />


## Validations (Bonus)

Mongoose contains built-in validators and the option to create custom validators as well.

Validators are defined at the field level in a document, and are executed when the document is being saved. If a validation error occurs, the save operation is aborted and the error is passed to the callback.

**Built in Validators:**

* `required` and `unique`: used to validate the field's existence in Mongoose.  These validators are placed in your schema, on the field that you want to validate.

Example: Let's say you want to verify the existence of a username field and ensure that it is unique before you save the user document.

```js
let StudentSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  }
  ...
});

```
>This will validate the existence and uniqueness of the username field when saving the document, thus preventing the saving of any document that doesn't contain this field or the username already exists.

* `match`: type based validator for strings, added to the field's object, in your schema.

Continuing off the above example, to validate your email field, you would need to change your StudentSchema as follows:

```js
let StudentSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  age: Number,
  email: {
    type: String,
    match: /.+\@.+\..+/
  }
});
```

>The usage of a match validator here, will make sure that the email field value matches the given regex expression, thus preventing the saving of any document where the e-mail doesn't conform to a valid pattern!

* `enum`: helps to define a set of strings that are only available for that field value.

```js
let StudentSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  age: Number,
  email: {
    type: String,
    match: /.+\@.+\..+/
  },
  role: {
    type: String,
    enum: ['Admin', 'Instructor', 'Student']
  },

});
```
>By Adding an `enum`, we are adding a validation to ensure that only these three possible strings  ('Admin', 'Instructor', 'Student') are saved in the document.

### Custom Validations

We can also define our own validators by using the `validate` property.

This `validate` property value is typically an array consisting of a validation function.

For example, say that we want to validate the length of a user's password. To do so, you would have to make these changes in your StudentSchema:

```js
let StudentSchema = new Schema({
  ...
  password: {
    type: String,
    validate: [
      function(password) {
        return password.length >= 6;
      },
      'Password needs to be at least 6 characters.'
    ]
  },
});
```

-----

## Closing / Questions

* How is Mongoose used to interact with MongoDB?
* What are embedded documents in Mongoose?
* Why do we create a Schema in Mongoose?
* What do we need after Mongoose queries?
* What are some common built in validations for Mongoose? Why would we use them?

## Homework

After this class you should be able to complete Part I of [YUM](https://github.com/sei-curiosity/hw-week10day01-02-03-mongoose-express).

## Additional Resources

* [Mongoose Documentation](http://mongoosejs.com/index.html)
* [Embedded Docs versus Multiple Collections](https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=mongoose%20embedded%20versus%20collections)
* [Active Record Versus Mongoose](active_record_comparison.md)
* [ODM For Mongo and Rails](https://github.com/mongodb/mongoid)

<br />
