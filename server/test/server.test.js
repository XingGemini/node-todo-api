const expect = require ('expect');
const request = require ('supertest');
const _ = require('lodash');
const {ObjectID} = require ('mongodb');


const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {todos, populateTodos, users, populateUsers} = require ('./seed/seed.js');

beforeEach (populateUsers);
beforeEach (populateTodos);

describe ('POST /todos', () => {
  it ('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end ((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({_creator: users[0]._id}).then((todos) => {
          expect(todos.length).toBe(3);
          expect(todos[2].text).toBe(text);
          done()
        }).catch ((e) => done(e));
      });
  });

  it ('should not create todo with invalid body data', (done) => {
    var text = '';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(400)
      //.expect((res) => {
      //  expect(res.body.text).toBe(text);
      //})
      .end ((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({_creator: users[0]._id}).then((todos) => {
          expect(todos.length).toBe(2);
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
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});


describe ('GET /todos:id', () => {
  it ('should get todo by id', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it ('should not get todo by id created by another user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it ('should return 404 if todo not found', (done) => {
    var id = new ObjectID();
    request(app)
      .get(`/todos/${id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it ('should return 404 if non-object', (done) => {
    var id = new ObjectID();
    request(app)
      .get(`/todos/123`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});


describe ('DELETE /todos:id', () => {
  it ('should DELETE todo by id', (done) => {
    var hexId = todos[0]._id.toHexString()
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
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


  it ('should not DELETE todo by id created by another user', (done) => {
    var hexId = todos[0]._id.toHexString()
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done (err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toExist();
          done();
        }).catch ((e) => done(e));

      });
  });

  it ('should return 404 if todo not found during DELETE', (done) => {
    var id = new ObjectID();
    request(app)
      .delete(`/todos/${id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it ('should return 404 if non-object during DELETE', (done) => {
    var id = new ObjectID();
    request(app)
      .delete(`/todos/123`)
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[1].tokens[0].token)
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

  it ('should NOT update a new todo created by another user', (done) => {
    var hexId = todos[1]._id.toHexString();

    var body = {
      text: 'Test todo text',
      completed: true
    };

    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send(body)
      .expect(404)
      .end ((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo.text).toBe(todos[1].text);
          expect(todo.completed).toBe(todos[1].completed);
          expect(todo.completedAt).toBe(todos[1].completedAt);
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
      .set('x-auth', users[1].tokens[0].token)
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
      .set('x-auth', users[1].tokens[0].token)
      .send(body)
      .expect(404)
      //.expect((res) => {
      //  expect(res.body.text).toBe(text);
      //})
      .end (done);
  });
});


describe ('GET /users/me',  () => {
  it ('should return user if authenticated', (done) => {
    request (app)
    .get ('/users/me')
    .set ('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it ('should return 401 if not authenticated', (done) => {
    request (app)
    .get ('/users/me')
    .set ('x-auth', users[0].tokens[0].token + 'a')
    .expect(401)
    .expect((res) => {
      expect (res.body).toEqual({});
    })
    .end(done);
  })
});

describe ('POST /users', () => {
  it ('should create a user', (done) => {
    var email = 'xing+1@gmail.com';
    var password = 'abc123';

    request(app)
      .post('/users')
      .send({
        email,
        password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it ('should return validation error if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: users[0].password
      })
      .expect(400)
      .end(done);
  });

  it ('should not create a user if the email is in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: users[0].password
      })
      .expect(400)
      .end(done);
  });
});

describe ('POST /users/login', () => {
  it ('should login user and return auth token', (done) => {
    request(app)
      .post ('/users/login')
      .send ({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        //console.log(res);
        expect(res.body.email).toBe(users[1].email)
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it ('should reject invalid login', (done) => {
    request(app)
      .post ('/users/login')
      .send ({
        email: users[1].email,
        password: 'wrongpassword'
      })
      .expect(400)
      .expect((res) => {
        //console.log(res);
        //expect(res.body.email).toBe(users[0].email)
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe ('DELETE /users/me/tocken', () => {
  it ('should remove token from the tokens array', (done) => {
    request(app)
      .delete ('/users/me/token')
      .set ('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
