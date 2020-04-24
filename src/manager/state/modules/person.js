import axios from 'axios'
import { Person } from './../../services/person'

export const state = {}

export const mutations = {}

export const getters = {}

export const actions = {
  init({ state, dispatch }) {},

  updatePerson({ dispatch }, { person }) {
    return Person.update({ person })
  },

  getPersonInfo({ dispatch }, id) {
    return Person.info(id)
  },

  search({}, query) {
    return Person.search(query)
  },
}

