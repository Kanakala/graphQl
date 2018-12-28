import Employee from '../../models/Employee';

export default {
  getEmployeeById: (_, { _id }) => Employee.findById(_id),
  searchEmployee: (_, args) => Employee.findOne({ username: args.username }),
  autoFill: (_, args) =>
    Employee.findOne({ username: { $regex: '.*' + args.search + '.*' } }),
  getEmployees: () => Employee.find({}),
  addEmployee: (_, args) => {
    try {
      return Employee.create(args);
    } catch (e) {
      return e;
    }
  }
};
