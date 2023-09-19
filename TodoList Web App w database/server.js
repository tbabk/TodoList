import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const port = 3000;
const app = express();

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var todoListDay = [];
var todoListWork = [];
var d = new Date();

const uri = "mongodb+srv://tbabka:ibQXzV9K5HOwGakC@cluster0.v8m3mtm.mongodb.net/?retryWrites=true&w=majority";

const dbName = "todolistDB";

await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log("Succesfully connected");

const db = mongoose.connection.useDb(dbName); // access database

const todoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const WorkTodo = db.model("WorkTodo", todoSchema);
const DayTodo = db.model("DayTodo", todoSchema);

var date = weekday.at(d.getDay()) + ", " + months.at(d.getMonth()) + " " + d.getDate(); 

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/work", async (req, res) => {
    const WorkTodos = await WorkTodo.find();
    
    res.render("work.ejs", {
        todoList: WorkTodos,
        date: date
    });
});

app.get("/day", async (req, res) => {
    const DayTodos = await DayTodo.find();
    
    res.render("day.ejs", {
        todoList: DayTodos,
        date: date
    });
});

app.post("/submit", async (req, res) => {
    const tdoItem = new DayTodo({name: req.body.record});
    await tdoItem.save();
    res.redirect("/day");
});

app.post("/send", async (req, res) => {
    const tdoItem = new WorkTodo({name: req.body.record});
    await tdoItem.save();
    res.redirect("/work");
});

app.post("/delete-day", async (req, res) => {
    console.log(req.body);
    const result = await DayTodo.deleteOne({_id: req.body.todo});
    if (result.deletedCount === 1) {
        console.log("Successfully deleted");
    } else {
        console.log("No changes made");
    }
    res.redirect("/day");
});

app.post("/delete-work", async (req, res) => {
    console.log(req.body);
    const result = await WorkTodo.deleteOne({_id: req.body.todo});
    if (result.deletedCount === 1) {
        console.log("Successfully deleted");
    } else {
        console.log("No changes made");
    }
    res.redirect("/work");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});