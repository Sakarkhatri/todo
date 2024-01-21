const express=require('express');
// const expressLayouts = require('express-ejs-layouts');
const app= express();
app.use('/css', express.static('css'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// // Use express-ejs-layouts middleware
// app.use(expressLayouts);
// // Use express-ejs-layouts middleware
// app.use(expressLayouts);
// // Set the public directory for static files
// app.use(express.static('public'));

const {client, ObjectId, dbName} = require('./db');
const objectID = ObjectId;
const db = client.db(dbName);


app.get('/', (req, res) =>{
    res.render("index.ejs")
});
app.get('/login', (req, res) =>{
    res.render("login.ejs")
});
app.get('/register', (req, res) =>{
    res.render("register.ejs")
});
app.get('/todo', async (req, res) =>{
    try {
        const todos = await db.collection('todoTasks').find().toArray();
        res.render("todo.ejs", {todos : todos.length ? todos : []})
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.post('/add-todo', async (req, res) => {
    try {
        const task = req.body.task;

        await db.collection('todoTasks').insertOne({
            task: task,
            completed: false,
        });
        res.redirect('/todo');
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.post('/completed-todo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const taskId = new objectID(id);
        const existingTask = await db.collection('todoTasks').findOne({ _id: taskId });

        if (!existingTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await db.collection('todoTasks').updateOne({ _id: taskId }, { $set: { completed: !existingTask.completed } });

        res.redirect('/todo');
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.post('/delete-todo/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const taskId = new objectID(id);
        const existingTask = await db.collection('todoTasks').findOne({ _id: taskId });

        if (!existingTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await db.collection('todoTasks').deleteOne({ _id: taskId });

        res.redirect('/todo');
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.post('/delete-all', async (req, res) => {
    try {
        await db.collection('todoTasks').deleteMany();
        res.redirect('/todo');
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.listen(3000);