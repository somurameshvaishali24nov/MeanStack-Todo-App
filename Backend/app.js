const express = require('express');
var cors = require('cors')

const app = express();

app.use(express.json()); // Middle ware JSON parser


const List = require('./Database/models/list');
const Task = require('./Database/models/task');


const mongoose = require('./Database/mongoose');

// The below middleware is to avoid CORS policy
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Context-Type, Accept");
//     next();
// });

app.use(cors());

app.get('/lists', (req, res) => {
    List.find({})
        .then(lists => res.send(lists))
        .catch(error => console.log(error))
})

app.post("/lists", (req, res) => {
    // Task.create({
    //     'title': ....
    // }) is the same as new Task({})
    
    (new List({
        'title':req.body.title,
    })).save()
        .then((list) => res.send(list))
        .catch(error => console.log(error))   
})

app.get("/lists/:listId", (req, res) => {
    List.find({ _id: req.params.listId })
        .then((list) => res.send(list))
        .catch(error => console.log(error))   
})

// app.patch() is to update one specific field
// app.put() updates the whole field

app.patch('/lists/:listId', (req, res) => {
    List.findOneAndUpdate({ '_id': req.params.listId }, { $set: req.body })
        .then((list) => res.send(list))
        .catch(error => console.log(error))  
})

app.delete('/lists/:listId', (req, res) => {
    // If we delete the LIST all the task related to the task must be deleted
    const deleteAllTaskAssociatedList = (list) => {
        Task.deleteMany({ '_listId': list._id })
            .then(() => (console.log("***: ", list), list))
            .catch(error => console.log(error)) 
        // console.log("list: ", list, Task.find({"_listId": list._id}));
    }

    // const list = List.findByIdAndDelete(req.params.listId)
    //     .then((list) => deleteAllTaskAssociatedList(list))
    //     .catch(error => console.log(error)) 
    
    // res.status(200).send(list)

    // (or)
    List.findByIdAndDelete(req.params.listId)
        .then((list) => res.status(200).send(deleteAllTaskAssociatedList(list)))
        .catch(error => console.log(error))
})

/********************************** TASK *****************************************/
// As the list if associated with the task, we have to call both listID and TaskID

app.get('/tasks', (req, res) => {
    Task.find({})
        .then((task) => res.send(task))
        .catch(error => console.log(error))  
})

// http://localhost:3000/lists/:listId/tasks/:taskId
app.get('/lists/:listId/tasks', (req, res) => {
    Task.find({'_listId': req.params.listId})
        .then((task) => res.send(task))
        .catch(error => console.log(error))  
})

app.post('/lists/:listId/tasks', (req, res) => {
    (new Task(
        {
            'title': req.body.title, 
            '_listId': req.params.listId
        })).save()
        .then((task) => res.send(task))
        .catch(error => console.log(error))  
})

app.get("/lists/:listId/tasks/:taskId", (req, res) => {
    Task.findOne({ '_listId': req.params.listId, '_id': req.params.taskId })
        .then((task) => res.send(task))
        .catch(error => console.log(error))   
})

app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOneAndUpdate({ '_listId': req.params.listId, '_id': req.params.taskId }, { $set: req.body })
        .then((task) => res.send(task))
        .catch(error => console.log(error)) 
})

app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    Task.findOneAndDelete(
        {
            '_listId': req.params.listId,
            '_id': req.params.taskId
        }
    ).then((task) => res.send(task))
        .catch(error => console.log(error)) 
})

app.listen(3000, () => {
    console.log("Server connected to the port 3000");
})