const expect = require ('expect');
const request = require ('supertest');
const {ObjectID} = require ('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

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


describe ('GET /todos:id', () => {
  it ('should get todo by id', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it ('should return 404 if todo not found', (done) => {
    var id = new ObjectID();
    request(app)
      .get(`/todos/${id.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it ('should return 404 if non-object', (done) => {
    var id = new ObjectID();
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
  });
});


describe ('DELETE /todos:id', () => {
  it ('should DELETE todo by id', (done) => {
    var hexId = todos[0]._id.toHexString()
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end((err, res) => {
        if (err) {
          return done (err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch ((e) => done(e));

      });
  });

  it ('should return 404 if todo not found during DELETE', (done) => {
    var id = new ObjectID();
    request(app)
      .delete(`/todos/${id.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it ('should return 404 if non-object during DELETE', (done) => {
    var id = new ObjectID();
    request(app)
      .delete(`/todos/123`)
      .expect(404)
      .end(done);
  });
});

describe ('PATCH /todos:id', () => {
  it ('should update a new todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    var body = {
      text: 'Test todo text',
      completed: true
    };

    request(app)
      .patch(`/todos/${hexId}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(body.text);
        expect(res.body.todo.completed).toBe(body.completed);
        expect(res.body.todo.completedAt).toExist();
      })
      .end ((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo.text).toBe(body.text);
          expect(todo.completed).toBe(body.completed);
          expect(res.body.todo.completedAt).toBeA("number");
          done()
        }).catch ((e) => done(e));
     });
  });

  it ('should update a new todo completed set to false', (done) => {
    var hexId = todos[1]._id.toHexString();

    var body = {
      completed: false
    };

    request(app)
      .patch(`/todos/${hexId}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(body.completed);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end ((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo.completed).toBe(body.completed);
          expect(res.body.todo.completedAt).toNotExist();
          done()
        }).catch ((e) => done(e));
    });
  });

  it ('should not update todo with invalid body data', (done) => {
    var hexId = '123';

    var body = {
      completed: false
    };

    request(app)
      .patch(`/todos/${hexId}`)
      .send(body)
      .expect(404)
      //.expect((res) => {
      //  expect(res.body.text).toBe(text);
      //})
      .end (done);
  });
});
