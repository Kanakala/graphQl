const Employee = require('../../models/Employee');
const TimeSheet = require('../../models/TimeSheet');

module.exports = {
  getEmployeeById: async (_, { _id }) => {
    const employee = await Employee.findById(_id);
    const timeSheet = await await TimeSheet.find({
      employee: employee._id
    });
    employee.TimeSheets = timeSheet;
    return employee;
  },
  searchEmployee: (_, args) => Employee.findOne({ username: args.username }),
  autoFill: (_, args) =>
    Employee.findOne({ username: { $regex: '.*' + args.search + '.*' } }),
  getEmployees: async (_, args) => {
    const page = args.page || 1;
    const limit = args.limit || 10;

    const employees = await Employee.find({}, [], {
      skip: (page - 1) * limit,
      limit: limit
    }).sort({
      createdAt: -1
    });

    const totalCount = await Employee.count({});

    const employeesWithTimeSheets = await Promise.all(
      employees.map(async employee => {
        const timeSheetByEmployee = await TimeSheet.find({
          employee: employee._id,
          date: { $gte: new Date(args.fromDate), $lt: new Date(args.toDate) }
        }).sort({ createdAt: -1 });
        employee.TimeSheets = timeSheetByEmployee;
        return employee;
      })
    );
    return { employeesWithTimeSheets, totalCount };
  },
  addEmployee: async (_, args) => {
    try {
      const newEmployee = await Employee.create(args);
      newEmployee.TimeSheets = [];
      return newEmployee;
    } catch (e) {
      return e;
    }
  },
  editEmployee: async (_, args) => {
    try {
      return Employee.findOneAndUpdate(
        { _id: args._id },
        { $set: args },
        {
          new: true
        }
      );
    } catch (e) {
      return e;
    }
  },
  deleteEmployee: async (_, args) => {
    try {
      return Employee.findByIdAndRemove(args._id);
    } catch (e) {
      return e;
    }
  }
};
