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

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID("597918e1203d546da340bc3f")
  // }, {
  //   $set:{
  //     completed:true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // })

  db.collection('Users').findOneAndUpdate({
    name: 'Xing'
  }, {
    $set:{
      location: 'PA'
    },
    $inc:{
      age:1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  })
  // db.close();
})
