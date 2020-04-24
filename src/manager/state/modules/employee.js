import { Employee } from './../../services/employee'

export const state = {
  employees: [],
}

export const mutations = {
  SET_EMPLOYEES(state, employees) {
    state.employees = employees.filter((e) => {
      e.consult_type_text = 'Consulta'
      e.pet_name = e.pet.name
      e.client_name = e.client.name
      e.vet_name = e.person.name
      e.created_at = moment(e.created_at).fromNow()
    })
  },
}

export const getters = {
  employees(state) {
    return state.employees
  },
}

export const actions = {
  init({ state, dispatch }) {},

  createEmployee({}, payload) {
    return Employee.create(payload)
  },

  fetchEmployees({ commit }) {
    return Employee.fetchEmployees().then((response) =>
      commit('SET_EMPLOYEES', response.data)
    )
  },
}
