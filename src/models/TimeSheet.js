const mongoose = require('mongoose');

const timeSheetSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model('timesheet', timeSheetSchema);
