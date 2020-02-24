const express = require("express");
const app = express();
const db = require("./db");
const path = require("path");
app.use(express.json());
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use("/assets", express.static("assets"));

app.get("/", (req, res, next) =>
  res.sendFile(path.join(__dirname, "index.html"))
);

//////////////////////////////////////get////////////////////////////////
app.get("/api/verbs", async (req, res, next) => {
  await db
    .readVerbs()
    .then(verbs => res.send(verbs))
    .catch(next);
});
app.get("/api/nouns", async (req, res, next) => {
  await db
    .readNouns()
    .then(nouns => res.send(nouns))
    .catch(next);
});
app.get("/api/adjectives", async (req, res, next) => {
  await db
    .readAdjectives()
    .then(adjectives => res.send(adjectives))
    .catch(next);
});

////////////////////////////////////post//////////////////////////////
app.post("/api/nouns", (req, res, next) => {
  db.createNoun()
    .then(noun => res.send(noun))
    .catch(next);
});
app.post("/api/verbs", (req, res, next) => {
  db.createVerb()
    .then(verb => res.send(verb))
    .catch(next);
});
app.post("/api/adjectives", (req, res, next) => {
  db.createAdjective()
    .then(adjective => res.send(adjective))
    .catch(next);
});

/////////////////////////////////////delete//////////////////////////
app.delete("/api/nouns/:id", (req, res, next) => {
  db.deleteNoun(req.params.id)
    .then(() => res.sendStatus(204)) //since no return
    .catch(next);
});
app.delete("/api/verbs/:id", (req, res, next) => {
  db.deleteVerb(req.params.id)
    .then(() => res.sendStatus(204)) //since no return
    .catch(next);
});
app.delete("/api/adjectives/:id", (req, res, next) => {
  db.deleteAdjective(req.params.id)
    .then(() => res.sendStatus(204)) //since no return
    .catch(next);
});

/////////////////////////////////////use/////////////////////////////
app.use((req, res, next) => {
  next({
    status: 404,
    message: `page not found - (method is ${req.method}) - (url is ${req.url})`
  });
});
app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .send({ error: err.message ? err.message : err.toString() });
});

const port = process.env.PORT || 3000;
db.sync().then(() => {
  app.listen(port, () => console.log(`listening on port ${port}`));
});
