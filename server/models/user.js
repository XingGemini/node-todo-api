var {mongoose} = require ('../db/mongoose')

var User = mongoose.model('User', {
  email: {
    type: String,
    required:true,
    minlength:1,
    trim:true // remove space
  }
});

module.exports = {
  User
};
