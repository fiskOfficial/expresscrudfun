// import libraries
import fs from "fs/promises"
import log from "@ajar/marker";
import express from "express";
import morgan from "morgan";
import { randomID2, standartFileRead } from "./utils/utils.js";


// global variables
const { PORT, HOST } = process.env;

// app instanse
const app = express();
log.magenta("hello");

// apply global middleware functions
app.use(morgan("dev"));
app.use(express.json());

async function HTTPlogger (req,res,next) {
    const line = `${req.method} ${req.url} ${Date.now()}\n`;
    log.magenta(line);
    await fs.appendFile('./logs/http.log', line);
    next();
};

app.use(HTTPlogger);

//routing

app.get("/", (req,res)=> {

  res.status(200).send(`welcome to express!`);
})

app.post("/api/tasks", async (req, res) => {

  const content = await fs.readFile("./db/tasks.json", 'utf8');
  const tasks = JSON.parse(content);
  // standartFileRead()
  req.body.id = randomID2();
  tasks.push(req.body);
  await fs.writeFile("./db/tasks.json", JSON.stringify(tasks,null,2));

  res.status(201).send("new task was created!!")
});

app.get("/api/tasks",async (req, res) => {
  const content = await fs.readFile(`./db/tasks.json`, 'utf8');
  const tasks = JSON.parse(content);

  res.status(200).json(tasks);
});

app.get("/api/tasks/:id",async (req, res) => {

  const content = await fs.readFile(`./db/tasks.json`, 'utf8');
  const tasks = JSON.parse(content);
  const result = tasks.find((obj) => obj.id === req.params.id);

  if (result) return  res.status(200).json(result)
  return res.status(404).send(`no task exies under that ${req.params.id} id`)
});

app.put("/api/tasks/:id", async (req, res) => {
  const content = await fs.readFile(`./db/tasks.json`, 'utf8');
  const tasks = JSON.parse(content);

  const objByID = tasks.find((obj) => obj.id === req.params.id);
  if (!objByID) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Update the properties of objByID with the ones from req.body
  objByID.title = req.body.title;
  objByID.description = req.body.description;
  objByID.time_stemp = req.body.time_stemp;
  // Add any other properties that you want to update

  // Write the updated tasks array back to the JSON file
  const updatedContent = JSON.stringify(tasks, null, 2);
  await fs.writeFile(`./db/tasks.json`, updatedContent, 'utf8');

  res.status(201).send(`${req.params.id} is up to date`);
});


app.patch("/api/tasks/:id", (req, res) => {
  res.status(200).send(`update (patch) a task - by id - PUT - api/tasks/${req.params.id}`)
});

app.delete("/api/tasks/:id/", (req, res) => {
  res.status(200).send(`delete a task - by id - DELETE - api/tasks/${req.params.id}`)
});


// start the server
;(async () => {
  await app.listen(PORT);
  log.magenta(`server is running on http://${HOST}:${PORT}`);
})();

// app.listen(PORT, HOST, () => {
//     log.magenta(`server is running on http://${PORT}:${HOST}`)
// })
