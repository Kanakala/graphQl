module.exports = `
  enum AllowedDepartment {
    OPS
    FIN
    TECH
  }
  scalar ISODate
  scalar ISOTime

  type Employee {
    _id: ID!
    username: String
    email: String
    age: Int
    department: AllowedDepartment
    TimeSheets: [TimeSheet]
  }

  type TimeSheet {
    _id: ID!
    employee: Employee
    date: ISODate
    start: ISOTime
    end: ISOTime
    title: String
    taskDesc: String
  }

  type Query {
    getEmployees(fromDate: ISODate!, toDate:ISODate!): [Employee]
    getEmployee(_id:ID!): Employee
    searchEmployee(username:String!): Employee
    autoFill(search:String!): Employee
    getTimeSheetByEmployeeAndWeek(employee:String!, fromDate:ISODate!, toDate:ISODate!): [TimeSheet]
    getTimeSheetById(_id:ID!): TimeSheet
  }

  type Mutation {
    addEmployee(username: String!, email: String!, age: Int, department: AllowedDepartment!): Employee
    editEmployee(_id:ID!,username: String, email: String, age: Int, department: AllowedDepartment): Employee
    deleteEmployee(_id:ID!): Employee
    addTimeSheet(employee: ID!, date: ISODate!, start: ISOTime!, end: ISOTime!, title: String!, taskDesc: String): TimeSheet
    editTimeSheet(_id: ID!, start: ISOTime!, date: ISODate!, end: ISOTime!, title: String, taskDesc: String): TimeSheet
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
