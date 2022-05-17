var express = require('express')
var app = express()
var { Pool } = require("pg");

// set up EJS
app.set('view engine', 'ejs');

//Set JSON parser
app.use(express.json())

//Get Person page
app.get('/person/:personId', async (req, res) => {
  var sqlData = await getPerson(req.params.personId)
  var person = sqlData.rows[0]
  res.render('pages/index', {person})
});

//api
app.post('/api/edit_person', async (req, res) => {
  if(req.body.age) {
    var sqlData = await editPerson('age', req.body.id, req.body.age)
    res.json({person: sqlData.rows[0]})
  }
})


// DB
var credentials = {
  user: "julianranieri",
  host: "localhost",
  database: "test",
  password: "password",
  port: 5432,
};
var pool = new Pool(credentials);

var newPerson = {
  fullName: 'Suz Jameson',
  gender: 'Female',
  phone: '976-444-2746',
  age: 26
}

async function registerPerson(person) {
  var sql = /*sql*/ `
    INSERT INTO people (fullname, gender, phone, age)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `
  var values = [person.fullName, person.gender, person.phone, person.age]
  return pool.query(sql, values)
}

async function getPerson(personId) {
  var sql = /*sql*/ `SELECT * FROM people WHERE id = ${personId}`;
  return pool.query(sql);
}

async function editPerson(type, id, data) {
  if(type === 'age') {
    var sql = /*sql*/ `
      UPDATE people
      SET age = ${data}
      WHERE id = ${id}
      RETURNING *
    `
    return pool.query(sql)
  }
}


//Run
var PORT = 4000
app.listen({port: PORT}, async () => {
  console.log(`Server Running at http://localhost:${PORT}`)
})