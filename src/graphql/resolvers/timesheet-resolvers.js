const TimeSheet = require('../../models/TimeSheet');

module.exports = {
  getTimeSheetByEmployeeAndWeek: async (_, args) => {
    const timeSheet = await TimeSheet.find({
      employee: args.employee,
      date: { $gte: new Date(args.fromDate), $lt: new Date(args.toDate) }
    });
    return timeSheet;
  },
  getTimeSheetById: async (_, args) => {
    try {
      const timeSheet = await TimeSheet.findById(args._id);
      const clonedTimeSheet = JSON.parse(JSON.stringify(timeSheet));
      clonedTimeSheet.employee = {
        _id: clonedTimeSheet.employee
      };
      return clonedTimeSheet;
    } catch (e) {
      return e;
    }
  },
  addTimeSheet: async (_, args) => {
    try {
      const initialExists = await TimeSheet.findOne({
        employeeId: args.employeeId,
        date: args.date,
        start: { $gte: args.start, $lt: args.end }
      });
      const middleExists = await TimeSheet.findOne({
        employeeId: args.employeeId,
        date: args.date,
        start: { $lte: args.start },
        end: { $gte: args.end }
      });
      const finalExists = await TimeSheet.findOne({
        employeeId: args.employeeId,
        date: args.date,
        end: { $gt: args.start, $lte: args.end }
      });

      if (initialExists || middleExists || finalExists) {
        throw new Error(
          'a timesheet exist already between the start and end time of the given date under the employee, please select different values'
        );
      } else {
        const createdTimeSheet = await TimeSheet.create(args);
        const clonedTimeSheet = JSON.parse(JSON.stringify(createdTimeSheet));
        clonedTimeSheet.employee = {
          _id: clonedTimeSheet.employee
        };

        return clonedTimeSheet;
      }
    } catch (e) {
      throw new Error(e);
    }
  },
  editTimeSheet: async (_, args) => {
    try {
      const oldTimeSheet = await TimeSheet.findById(args._id);
      const initialExists = await TimeSheet.find({
        employeeId: oldTimeSheet.employeeId,
        date: args.date,
        start: { $gte: args.start, $lt: args.end }
      });
      const middleExists = await TimeSheet.find({
        employeeId: oldTimeSheet.employeeId,
        date: args.date,
        start: { $lte: args.start },
        end: { $gte: args.end }
      });
      const finalExists = await TimeSheet.find({
        employeeId: oldTimeSheet.employeeId,
        date: args.date,
        end: { $gt: args.start, $lte: args.end }
      });
      const a = JSON.parse(JSON.stringify(initialExists));
      const b = JSON.parse(JSON.stringify(middleExists));
      const c = JSON.parse(JSON.stringify(finalExists));

      const _ = require('lodash');

      const union = _.unionBy(a, b, c, obj => {
        return obj._id;
      });

      _.remove(union, { _id: JSON.parse(JSON.stringify(oldTimeSheet))._id });

      if (union.length) {
        throw new Error(
          'a timesheet exist already between the start and end time of the given date under the employee, please select different values'
        );
      } else {
        const updatedTimeSheet = await TimeSheet.findOneAndUpdate(
          { _id: args._id },
          { $set: args },
          {
            new: true
          }
        );
        const clonedTimeSheet = JSON.parse(JSON.stringify(updatedTimeSheet));
        clonedTimeSheet.employee = {
          _id: clonedTimeSheet.employee
        };

        return clonedTimeSheet;
      }
    } catch (e) {
      return e;
    }
  }
};
