import { mapState, mapGetters, mapActions } from 'vuex'

export const authComputed = {
  ...mapState('auth', {
    currentUser: (state) => state.currentUser,
  }),
  ...mapGetters('auth', ['loggedIn']),
}

export const layoutComputed = {
  ...mapState('layout', {
    layoutType: (state) => state.layoutType,
    leftSidebarTheme: (state) => state.leftSidebarTheme,
    leftSidebarType: (state) => state.leftSidebarType,
    layoutWidth: (state) => state.layoutWidth,
  }),
}

export const authMethods = mapActions('auth', [
  'validate',
  'logIn',
  'logOut',
  'register',
  'resetPassword',
  'passwordUpdate',
  'resetPassword',
  'getInvitationResource',
  'acceptInvitation',
])

export const personMethods = mapActions('person', [
  'getPersonInfo',
  'updatePerson',
  'search',
])

export const categoryMethods = mapActions('category', [
  'fetchCategories',
])

export const establishmentMethods = mapActions('establishment', [
  'updateEstablishment',
  'updateBankAccount',
])

export const consultationMethods = mapActions('consultation', [
  'createConsultation',
  'fetchConsultations',
])

export const employeeMethods = mapActions('employee', [
  'createEmployee',
])

export const consultationGetters = mapGetters('consultation', [
  'consultations',
])

export const employeeGetters = mapGetters('employee', [
  'employees',
])

export const layoutMethods = mapActions('layout', [
  'changeLayoutType',
  'changeLeftSidebarTheme',
  'changeLeftSidebarType',
  'changeLayoutWidth',
])
