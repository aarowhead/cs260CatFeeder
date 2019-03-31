const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// If it doesn't match any endpoint, serve files from public server
app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/cat', {
  useNewUrlParser: true
});

const logSchema = new mongoose.Schema({
  name: String,
  date: Number
});

const Log = mongoose.model('Log', logSchema);

app.post('/api/logs', async (req, res) => {
  const log = new Log({
    name: req.body.name,
    date: req.body.date
  });
  try {
    await log.save();
    res.send(log);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/logs', async (req, res) => {
  try {
    let logs = await Log.find();
    res.send(logs);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/logs/:id', async (req, res) => {
  try {
    let id = req.params.id
    let log = await Log.findOne({
      _id: id
    })
    log.name = req.body.name
    await log.save()
    res.send(log)
    console.log("Updated Item: " + id)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
});

app.delete('/api/logs/:id', async (req, res) => {
  try {
    let id = req.params.id
    await Log.deleteOne({
      _id: id
    })
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));