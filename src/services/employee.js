import AXIOS from './axios'

export class Employee {
  static create(payload) {
  	payload.credential_attributes.credential_type = payload.credential_attributes.credential_type.key
    return AXIOS.post('/employees', { employee: payload });
  }

  static fetchEmployees() {
    return AXIOS.get('/employees')
  }
}