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
  // db.collection('Todos').insertOne ({
  //   text: 'something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // })
  //
  //
  // db.collection('Users').insertOne ({
  //   name: 'Xing Xu',
  //   age: 33,
  //   location: 'Palo Alto'
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert a user', err);
  //   }
  //
  //   console.log(result.ops[0]._id.getTimestamp());
  // })
  // db.close();
})
