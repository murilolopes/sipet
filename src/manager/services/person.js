import AXIOS from './axios'

export class Person {
  static update({ person }) {
    return AXIOS.put(`/people/${person.id}`, { person });
  }

  static info(id) {
    return AXIOS.get(`/people/${id}`);
  }

  static search(query) {
    return AXIOS.get(`/people_search?query=${query}`);
  }
}