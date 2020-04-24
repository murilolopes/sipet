import axios from 'axios'
import { Establishment } from './../../services/establishment'

export const state = {}

export const mutations = {}

export const getters = {}

export const actions = {
  init({ state, dispatch }) {},

  updateEstablishment({ dispatch }, { establishment }) {
    return Establishment.update({ establishment })
  },

  updateBankAccount({ dispatch }, { bank_account }) {
    return Establishment.updateBankAccount({ bank_account })
  },
}

