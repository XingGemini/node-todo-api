require ('./config/config.js')

const _ = require('lodash');

const express = require ('express');
const bodyParser = require ('body-parser');
const {ObjectID} = require('mongodb');

const port = process.env.PORT || 3000;

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require ('./middleware/authenticate');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  //console.log(req.body);

  var todo = new Todo ({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  //console.log (req.body);

  Todo.find().then ((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  //console.log (req.body);
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }, (e) => {
    res.status(400).send(e);
  });
});


app.delete('/todos/:id', (req, res) => {
  //console.log (req.body);
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }, (e) => {
    res.status(400).send();
  });
});

app.patch ('/todos/:id', (req, res) => {
  var id = req.params.id;

  var body = _.pick (req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completedAt = null;
    body.completed = false;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch ((e) => {
    res.status(400).send();
  });
});


app.post('/users', (req, res) => {
  //console.log(req.body);
  var body = _.pick (req.body, ['email', 'password']);
  //console.log(body);

  var user = new User (body);

  user.save().then(() => {
    return user.generateAuthToken();
    //res.send(user);
  }).then ((token) => {
    //console.log('token: ', token);
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    //console.log(e);
    res.status(400).send(e);
  });
});

//POST /users/login (email, password)
app.post('/users/login', (req, res) => {
  var body = _.pick (req.body, ['email', 'password']);

  //res.send(body);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, (e) => {
    res.status(400).send();
  });
});

app.listen (port, () => {
  console.log(`Start on port ${port}`);
});


module.exports = {
  app
};
