const EmployeeResolvers = require('./employee-resolvers');
const TimeSheetResolvers = require('./timesheet-resolvers');
const ISODate = require('../scalars/ISODate');
const ISOTime = require('../scalars/ISOTime');

module.exports = {
  Query: {
    searchEmployee: EmployeeResolvers.searchEmployee,
    getEmployee: EmployeeResolvers.getEmployeeById,
    autoFill: EmployeeResolvers.autoFill,
    getEmployees: EmployeeResolvers.getEmployees,
    getTimeSheetByEmployeeAndWeek:
      TimeSheetResolvers.getTimeSheetByEmployeeAndWeek,
    getTimeSheetById: TimeSheetResolvers.getTimeSheetById
  },

  Mutation: {
    addEmployee: EmployeeResolvers.addEmployee,
    editEmployee: EmployeeResolvers.editEmployee,
    deleteEmployee: EmployeeResolvers.deleteEmployee,
    addTimeSheet: TimeSheetResolvers.addTimeSheet,
    editTimeSheet: TimeSheetResolvers.editTimeSheet
  },

  ISODate,
  ISOTime
};
