const jwt = require('jsonwebtoken');
const {ObjectID} = require ('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const todos = [
    {
      _id : new ObjectID(),
      text : "Todo 1"},
    {
      _id : new ObjectID(),
      text : "Todo 2"},
    {
      _id : new ObjectID(),
      text : "Todo 3"}
];


const populateTodos = (done) => {
  Todo.remove({}).then (() => {
    return Todo.insertMany(todos);
  }).then (() => done());
};


const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
    {
      _id : userOneId,
      email : 'xing@gmail.com',
      password: 'userOnePass',
      tokens: [{
        access:'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
      }]
    },
    {
      _id : userTwoId,
      email : 'xing2@gmail.com',
      password: 'userTwoPass',
      // tokens: [{
      //   access:'auth',
      //   token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
      // }]
    }
];

const populateUsers = (done) => {
  User.remove({}).then (() => {
    var userOne = new User (users[0]).save();
    var userTwo = new User (users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then (() => done());
};


module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};