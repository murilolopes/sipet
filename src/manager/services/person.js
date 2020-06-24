import AXIOS from './axios'

export class Person {
  static update({ person }) {
    return AXIOS.put(`v1/people/${person.id}`, { person });
  }

  static info(id) {
    return AXIOS.get(`v1/people/${id}`);
  }

  static search(query) {
    return AXIOS.get(`v1/people_search?query=${query}`);
  }
}