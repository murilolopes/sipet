import AXIOS from './axios'

export class Establishment {
  static update({ establishment }) {
    return AXIOS.put(`v1/establishments/${establishment.id}`, { establishment });
  }

  static updateBankAccount({ bank_account }) {
    return AXIOS.put(`v1/establishments/${bank_account.id}/bank_account`, { bank_account });
  }
}