import axios from 'axios'
import store from './../state/store'

const AXIOS = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  // baseURL: 'https://pety-api.herokuapp.com/api/v1',
  timeout: 30000
});

AXIOS.interceptors.request.use((config) => {
  let headers = JSON.parse(window.sessionStorage.getItem('headers'))
  if (headers) {
    config.headers.common['access-token'] = headers['access-token']
    config.headers.common['client'] = headers['client']
    config.headers.common['uid'] = headers['uid']
    config.headers.common['expiry'] = headers['expiry']
    config.headers.common['token-type'] = headers['token-type']
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

AXIOS.interceptors.response.use(function (response) {
  if (response.headers['access-token'])
    saveHeaders('headers', response)

  return response;
}, function (error) {
  if (error.response.status === 401 && !error.response.config.url.includes('api/v1/auth/sign_in')) {
    Swal.fire({
      title: "Sessão expirada",
      text: "Sua sessão expirou. Por favor faça login novamente!",
      icon: "info",
      confirmButtonText: "OK",
      closeOnConfirm: false
    }).then(response => {
      store.dispatch('auth/logOut')
      window.location = '/login';
    });
  } else {
    return Promise.reject(error);
  }
});

function saveHeaders(key, response) {
  let headers = {}
  headers['access-token'] = response.headers['access-token']
  headers['client'] = response.headers['client']
  headers['uid'] = response.headers['uid']
  headers['expiry'] = response.headers['expiry']
  headers['token-type'] = 'Bearer'
  window.sessionStorage.setItem(key, JSON.stringify(headers))
}

export default AXIOS