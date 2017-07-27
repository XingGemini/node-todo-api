// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

// var user = {
//   name: 'Xing new',
//   age: 25
// }
//
// var {name} = user;  destructure to pull porperty out of a record
//
//console.log(name);

// learn about ID  create the ID by ourselves
//var obj = new ObjectID();
//console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log("Connected to MongoDB server");


  // delete Many
  db.collection('Users').deleteMany({
    text: 'Eat Lunch'
  }).then ((result) => { // find is a promise so can use then
    console.log(result);
  }, (err) => {
    console.log('Unable to deleteMany the todos', err);
  })

  db.collection('Users').deleteOne({
    name: 'Xing Xu'
  }).then ((result) => { // find is a promise so can use then
    console.log(result);
  }, (err) => {
    console.log('Unable to deleteMany the todos', err);
  })

  // findOne and delete
  db.collection('Todos').findOneAndDelete({
    completed: false
  }).then ((result) => { // find is a promise so can use then
    console.log(result);
  }, (err) => {
    console.log('Unable to deleteMany the todos', err);
  })

  // db.close();
})
