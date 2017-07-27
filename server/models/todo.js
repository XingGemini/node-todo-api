var {mongoose} = require ('../db/mongoose')

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required:true,
    minlength:1,
    trim:true // remove space
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

module.exports = {
  Todo
};
