import axios from 'axios'
import { Auth } from './../../services/auth'

export const state = {
  currentUser: getSavedState('auth.currentUser'),
}

export const mutations = {
  SET_CURRENT_USER(state, newValue) {
    state.currentUser = newValue
    saveState('auth.currentUser', newValue)
    setDefaultAuthHeaders(state)
  },
}

export const getters = {
  loggedIn(state) {
    return !!state.currentUser
  },
}

export const actions = {
  init({ state, dispatch }) {
    setDefaultAuthHeaders(state)
    dispatch('validate')
  },

  logIn({ commit, dispatch, getters }, { email, password } = {}) {
    if (getters.loggedIn) return dispatch('validate')

    return Auth.logIn({ email, password })
      .then((response) => {
        const user = response.data
        commit('SET_CURRENT_USER', user)
        return user
      })
  },

  passwordUpdate({ dispatch }, { headers = null, password, password_confirmation }) {
    return Auth.password({ headers, password, password_confirmation })
      .then(response => {
        dispatch('logOut')
        return response
      })
  },

  resetPassword({ dispatch }, { email }) {
    return Auth.resetPassword({ email })
  },

  getInvitationResource({ dispatch }, invitation_token) {
    return Auth.getInvitationResource(invitation_token)
  },

  acceptInvitation({ dispatch }, { employee, invitation_token }) {
    const accept_invitation = { 
      email: 'muriloangelo10@gmail.com', 
      password: employee.credential_attributes.password, 
      password_confirmation: employee.credential_attributes.password_confirmation, 
      invitation_token: invitation_token, 
      person_attributes: { 
        name: employee.name, 
        cpf: employee.cpf, 
        phone: employee.phone, 
        birthdate: employee.birthdate, 
        crmv: employee.crmv, 
        crmv_uf: employee.crmv_uf 
      }
    }
    return Auth.acceptInvitation({ accept_invitation })
  },

  logOut({ commit }) {
    commit('SET_CURRENT_USER', null)
  },

  validate({ commit, state }, updateCurrentUser = false) {
    if (!state.currentUser && !updateCurrentUser) return Promise.resolve(null)

    return Auth.me()
      .then((response) => {
        const user = response.data
        commit('SET_CURRENT_USER', user)
        return user
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          commit('SET_CURRENT_USER', null)
        }
        return null
      })
  },
}

function getSavedState(key) {
  return JSON.parse(window.localStorage.getItem(key))
}

function saveState(key, state) {
  window.localStorage.setItem(key, JSON.stringify(state))
}

function setDefaultAuthHeaders(state) {
  axios.defaults.headers.common.Authorization = state.currentUser
    ? state.currentUser.token
    : ''
}
