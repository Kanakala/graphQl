const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    age: Number,
    department: { type: String, enum: ['OPS', 'FIN', 'TECH'] }
  },
  { timestamps: true }
);

employeeSchema.post('save', (error, doc, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    if (error.errmsg.includes('username')) {
      return next(new Error('username must be unique'));
    } else if (error.errmsg.includes('email')) {
      return next(new Error('email must be unique'));
    } else {
      return next(error);
    }
  } else {
    return next(error);
  }
});

employeeSchema.post('findOneAndUpdate', (error, doc, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    if (error.errmsg.includes('username')) {
      return next(new Error('username must be unique'));
    } else if (error.errmsg.includes('email')) {
      return next(new Error('email must be unique'));
    } else {
      return next(error);
    }
  } else {
    return next(error);
  }
});

module.exports = mongoose.model('employee', employeeSchema);
