import AXIOS from './axios'

export class Auth {
  static logIn({ email, password }) {
    return AXIOS.post('/auth/sign_in', { email, password });
  }

  static me() {
    return AXIOS.get('/me');
  }

  static password({ headers = null, password, password_confirmation }) {
    return AXIOS.put('/auth/password', { password, password_confirmation }, { headers });
  }

  static resetPassword({ email }) {
    return AXIOS.post('/auth/password', { email });
  }

  static getInvitationResource(invitation_token) {
    AXIOS.baseURL =  ''
    return AXIOS({url: `/credential/invitation/accept?invitation_token=${invitation_token}`, baseURL: 'http://localhost:3000/api'});
  }
}