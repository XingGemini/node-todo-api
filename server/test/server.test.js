const expect = require ('expect');
const request = require ('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [
    { text : "Todo 1"},
    { text : "Todo 2"},
    { text : "Todo 3"}
];

beforeEach ((done) => {
  Todo.remove({}).then (() => {
    return Todo.insertMany(todos);
  }).then (() => done());
});

describe ('POST /todos', () => {
  it ('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end ((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(4);
          expect(todos[3].text).toBe(text);
          done()
        }).catch ((e) => done(e));
      });
  });

  it ('should not create todo with invalid body data', (done) => {
    var text = '';

    request(app)
      .post('/todos')
      .send({text})
      .expect(400)
      //.expect((res) => {
      //  expect(res.body.text).toBe(text);
      //})
      .end ((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(3);
          //expect(todos[0].text).toBe(text);
          done()
        }).catch ((e) => done(e));
      });
  });
});

describe ('GET /todos', () => {
  it ('should get all today', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(3);
      })
      .end(done);
  });
});
