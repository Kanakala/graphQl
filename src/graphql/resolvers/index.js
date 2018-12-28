import EmployeeResolvers from './employee-resolvers';
import TimeSheetResolvers from './timesheet-resolvers';
import ISODate from '../scalars/ISODate';
import ISOTime from '../scalars/ISOTime';

export default {
  Query: {
    searchEmployee: EmployeeResolvers.searchEmployee,
    getEmployee: EmployeeResolvers.getEmployeeById,
    autoFill: EmployeeResolvers.autoFill,
    getEmployees: EmployeeResolvers.getEmployees,
    getTimeSheetByEmployeeAndWeek:
      TimeSheetResolvers.getTimeSheetByEmployeeAndWeek
  },

  Mutation: {
    addEmployee: EmployeeResolvers.addEmployee,
    addTimeSheet: TimeSheetResolvers.addTimeSheet
  },

  ISODate,
  ISOTime
};
