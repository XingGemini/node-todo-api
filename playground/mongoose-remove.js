const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


var id = '597ab7d238540cda7713faee';

if (!ObjectID.isValid(id)) {
  console.log('ID not valid');
}

//Todo.remove
//Todo.findOneAndRemove
//Todo.findByIdAndRemove

// Todo.remove({}).then((results) => {
//   console.log(results);
// });

var id = "597b6a3cc063bf1f534562fa";

Todo.findOneAndRemove({_id : id}).then((todo) => {
    if (!todo) {
      return console.log('Id not found');
    }
    console.log(`${todo} is removed`);
  }).catch((e) => {
    console.log(e)
  });

Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return console.log('Id not found');
    }
    console.log(`${todo} is removed`);
  }).catch((e) => {
    console.log(e)
  });

// var userId = '5979bd58fe59cfce729586fb';
// User.findById(userId).then((user) => {
//   if (!user) {
//     return console.log('User Id not found');
//   }
//   console.log('User', user);
// }).catch((e) => {
//   console.log(e)
// });
