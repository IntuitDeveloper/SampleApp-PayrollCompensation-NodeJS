export const getEmployeeCompensationQuery = `
query payrollEmployeeCompensations($filter: Payroll_EmployeeCompensationsFilter!) {
    payrollEmployeeCompensations(filter: $filter) {
        edges {
            node {
                id
                active
                employerCompensation {
                    id
                    name
                    type {
                        key
                        description
                        value
                    }
                }
            }
        }
        pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
        }
    }
}
`;


export const getEmployeeCompensationVariables = (params) => {
    const variable = {
        first: +params.first,
        filter: {}
    };
    if(params.employee) {
        variable.filter.employeeId = params.employee
    }
    if(params.active !== undefined && params.active !== 'undefined' && params.active !== null && params.active !== '') {
        variable.filter.active = params.active;
    }
    return variable;
}