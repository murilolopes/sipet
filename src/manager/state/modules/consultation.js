import axios from 'axios'
import { Consultation } from './../../services/consultation'

export const state = {
	consultations: []
}

export const mutations = {
	SET_CONSULTATIONS(state, consultations) {
    state.consultations = consultations
  },
}

export const getters = {
	consultations(state) {
		return state.consultations
	}
}

export const actions = {
  init({ state, dispatch }) {},

  createConsultation({}, payload) {
    return Consultation.create(payload)
  },

  fetchConsultations({ commit }) {
    return Consultation.fetchConsultations().then(response => {
      response.data.filter(c => {
        c.consult_type_text = 'Consulta'
        c.pet_name = c.pet.name
        c.client_name = c.client.name
        c.vet_name = c.person.name
        c.created_at = moment(c.created_at).fromNow()
      })
      commit('SET_CONSULTATIONS', response.data)
    })
  },
}

