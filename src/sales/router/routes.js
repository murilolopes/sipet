const dashboardRoutes = [
  {
    path: '/',
    component: () => lazyLoadView(import('@sales-views/pages/')),
  },
]

const authProtectedRoutes = [
  ...dashboardRoutes,
]
const allRoutes = [...authProtectedRoutes]

export { allRoutes, authProtectedRoutes }

function lazyLoadView(AsyncView) {
  const AsyncHandler = () => ({
    component: AsyncView,
    loading: require('@sales-components/_loading').default,
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
