import AXIOS from './axios'

export class Establishment {
  static update({ establishment }) {
    return AXIOS.put(`/establishments/${establishment.id}`, { establishment });
  }

  static updateBankAccount({ bank_account }) {
    return AXIOS.put(`/establishments/${bank_account.id}/bank_account`, { bank_account });
  }
}