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

module.exports = mongoose.model('employee', employeeSchema);
