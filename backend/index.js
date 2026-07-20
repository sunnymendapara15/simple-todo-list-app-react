const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let todos = [];
let nextId = 1;

const normalizeText = (text) => (text || '').toString().trim();
const isDuplicate = (text) => todos.some((todo) => todo.text.toLowerCase() === text.toLowerCase());

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const text = normalizeText(req.body && req.body.text);
  if (!text) {
    return res.status(400).json({ message: 'Todo text is required.' });
  }
  if (isDuplicate(text)) {
    return res.status(409).json({ message: 'Todo already exists.' });
  }
  const todo = {
    id: nextId++,
    text,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  res.status(201).json(todo);
});

app.put('/todos/:id/toggle', (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find((entry) => entry.id === id);
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found.' });
  }
  todo.completed = !todo.completed;
  res.json(todo);
});

app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = todos.findIndex((entry) => entry.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Todo not found.' });
  }
  const [removed] = todos.splice(index, 1);
  res.json(removed);
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Todo backend listening on port ${PORT}`);
});
