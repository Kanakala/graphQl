import mongoose, { Schema } from 'mongoose';

const timeSheetSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'employee'
    },
    date: Date,
    start: Number,
    end: Number,
    title: String,
    taskDesc: String
  },
  { timestamps: true }
);

export default mongoose.model('timesheet', timeSheetSchema);
