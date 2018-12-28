import mongoose, { Schema } from 'mongoose';

const employeeSchema = new Schema(
  {
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    age: Number,
    department: { type: String, enum: ['OPS', 'FIN', 'TECH'] }
  },
  { timestamps: true }
);

export default mongoose.model('employee', employeeSchema);
