import store from '@manager-state/store'

const authRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => lazyLoadView(import('@manager-views/pages/account/login')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        if (store.getters['auth/loggedIn']) {
          next({ name: 'dashboard' })
        } else {
          next()
        }
      },
    },
  },
  {
    path: '/confirm-account',
    name: 'confirm-account',
    component: () => lazyLoadView(import('@manager-views/pages/account/confirm')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        if (store.getters['auth/loggedIn']) {
          next({ name: 'dashboard' })
        } else {
          next()
        }
      },
    },
  },
  {
    path: '/forget-password',
    name: 'forget-password',
    component: () =>
      lazyLoadView(import('@manager-views/pages/account/forgetPassword')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        if (store.getters['auth/loggedIn']) {
          next({ name: 'dashboard' })
        } else {
          next()
        }
      },
    },
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () =>
      lazyLoadView(import('@manager-views/pages/account/resetPassword')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        if (store.getters['auth/loggedIn']) {
          next({ name: 'dashboard' })
        } else {
          next()
        }
      },
    },
  },
  {
    path: '/logout',
    name: 'logout',
    meta: {
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        store.dispatch('auth/logOut')
        const authRequiredOnPreviousRoute = routeFrom.matched.some(
          (route) => route.meta.authRequired
        )
        next(
          authRequiredOnPreviousRoute ? { name: 'dashboard' } : { ...routeFrom }
        )
      },
    },
  },
]

const errorPagesRoutes = [
  {
    path: '/404',
    name: '404',
    component: require('@manager-views/pages/secondary/error-404').default,
    props: true,
  },
  {
    path: '/500',
    name: '500',
    component: require('@manager-views/pages/secondary/error-500').default,
    props: true,
  },
  {
    path: '*',
    redirect: '404',
  },
]

const dashboardRoutes = [
  {
    show: true,
    path: '/',
    name: 'Dashboard',
    header: 'Dashboards',
    icon: 'home',
    component: () => lazyLoadView(import('@manager-views/pages/dashboard/dashboard')),
    meta: { authRequired: true },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
  },
]

const callRoutes = [
  {
    show: true,
    path: '/consultas/nova',
    name: 'Nova Consulta',
    header: 'Plano',
    icon: 'edit',
    component: () => lazyLoadView(import('@manager-views/pages/plan/consultation')),
    meta: { authRequired: true },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
  },
  {
    show: true,
    path: '/consultas',
    name: 'Consultas',
    icon: 'list',
    component: () => lazyLoadView(import('@manager-views/pages/plan/consultation-list')),
    meta: { authRequired: true },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
  },
]

const entriesRoutes = [
  {
    show: true,
    path: '/cadastros',
    name: 'Funcionários',
    header: 'Cadastros',
    icon: 'user-plus',
    meta: { authRequired: true },
    component: {
      render(c) {
        return c('router-view')
      },
    },
    children: [
      {
        name: 'Cadastrar Funcionário',
        path: 'funcionarios/criar',
        meta: { authRequired: true },
        component: () => 
          lazyLoadView(import('@manager-views/pages/entries/employees/create')),
      },
      {
        name: 'Listar Funcionários',
        path: 'funcionarios',
        meta: { authRequired: true },
        component: () => 
          lazyLoadView(import('@manager-views/pages/entries/employees/list')),
      },
    ],
  },
]

const pagesRoutes = [
  {
    show: false,
    path: '/pages',
    name: 'Pages',
    icon: 'file-text',
    header: 'Custom',
    meta: { authRequired: true },
    component: {
      render(c) {
        return c('router-view')
      },
    },
  },
]

const authProtectedRoutes = [
  ...dashboardRoutes,
  ...pagesRoutes,
  ...callRoutes,
  ...entriesRoutes,
]
const allRoutes = [...authRoutes, ...authProtectedRoutes, ...errorPagesRoutes]

export { allRoutes, authProtectedRoutes }

function lazyLoadView(AsyncView) {
  const AsyncHandler = () => ({
    component: AsyncView,
    loading: require('@components/_loading').default,
    delay: 400,
    timeout: 10000,
  })

  return Promise.resolve({
    functional: true,
    render(h, { data, children }) {
      return h(AsyncHandler, data, children)
    },
  })
}
