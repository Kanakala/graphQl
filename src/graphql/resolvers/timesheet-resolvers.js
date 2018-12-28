import TimeSheet from '../../models/TimeSheet';

export default {
  getTimeSheetByEmployeeAndWeek: async (_, args) => {
    const timeSheet = await TimeSheet.find({
      employee: args.employee,
      date: { $gte: new Date(args.fromDate), $lt: new Date(args.toDate) }
    });
    return timeSheet;
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
        return TimeSheet.create(args);
      }
    } catch (e) {
      throw new Error(e);
    }
  }
};
