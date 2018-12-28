export default `
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
    getEmployees: [Employee]
    getEmployee(_id:ID!): Employee
    searchEmployee(username:String!): Employee
    autoFill(search:String!): Employee
    getTimeSheetByEmployeeAndWeek(employee:String!, fromDate:ISODate!, toDate:ISODate!): [TimeSheet]
  }

  type Mutation {
    addEmployee(username: String!, email: String!, age: Int, department: AllowedDepartment!): Employee
    addTimeSheet(employee: ID!, date: ISODate!, start: ISOTime!, end: ISOTime!, title: String!, taskDesc: String): TimeSheet
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;
