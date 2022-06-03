const { request, response } = require("express");
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
morgan("tiny");
const morganString =
  ":method :url :status :res[content-length] - :response-time ms";

app.use(morgan(morganString));

morgan.token("data", (request) => {
  return request.method === "POST" ? JSON.stringify(request.body) : " ";
});

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "Mary2 Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((perosn) => perosn.id)) : 0;

  return maxId + 1;
};
app.get("/", (request, response) => {
  response.json({ welcome: "You hit the inital route here" });
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});
app.get("/info", (request, response) => {
  let message = `<p>Persons as info for ${persons.length} people</p>`;
  message += `<p> ${new Date()} </p>`;

  response.send(message);
});
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === Number(id));
  if (person) return response.json({ ...person }).status(200);
  else
    return response
      .json({ message: `person with ${id} id not found` })
      .status(204);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  persons = persons.filter((person) => person.id !== id);
  response.json({ message: "deleted " }).status(204).end();
});

app.post("/api/persons", (request, response) => {
  let perosn = request.body;
  const newPerson = {
    name: perosn.name,
    number: perosn.number,
    id: generateId(),
  };
  if (!perosn.name || !perosn.number) {
    return response
      .json({
        error: "invalid contents, make sure name and number  is supplied",
      })
      .status(400);
  }
  //   persons.map((persona) => {

  //     if (persona.name.toLowerCase === newPerson.name.toLowerCase())
  //       return response.json({ error: "name already exists" }).status(204);
  //   });

  if (
    persons.find(
      (person) => person.name.toLowerCase() === newPerson.name.toLowerCase()
    )
  )
    return response.json({ error: "name already exists" });

  persons = persons.concat(newPerson);

  return response.json({ ...newPerson }).status(201);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
