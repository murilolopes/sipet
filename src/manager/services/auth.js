import AXIOS from './axios'

export class Auth {
  static logIn({ email, password }) {
    return AXIOS.post('v1/auth/sign_in', { email, password });
  }

  static me() {
    return AXIOS.get('v1/me');
  }

  static password({ headers = null, password, password_confirmation }) {
    return AXIOS.put('v1/auth/password', { password, password_confirmation }, { headers });
  }

  static resetPassword({ email }) {
    return AXIOS.post('v1/auth/password', { email });
  }

  static getInvitationResource(invitation_token) {
    return AXIOS.get(`/credential/invitation/accept?invitation_token=${invitation_token}`);
  }

  static acceptInvitation({ accept_invitation }) {
    return AXIOS.put('/credential/invitation/', { api_credential: accept_invitation });
  }
}