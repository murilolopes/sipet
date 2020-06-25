import AXIOS from './axios'

export class Employee {
  static create(payload) {
  	payload.credential_type = payload.credential_type.key
    return AXIOS.post('v1/employees', { employee: payload });
  }

  static fetchEmployees() {
    return AXIOS.get('v1/employees')
  }
}