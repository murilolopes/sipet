<script>
import appConfig from '@manager-src/app.config'
import Layout from '@manager-layouts/main'
import PageHeader from '@manager-components/page-header'

/**
 * Starter component
 */
export default {
  page: {
    title: 'Starter',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: 'Starter',
      items: [
        {
          text: 'Shreyu',
          href: '/',
        },
        {
          text: 'Pages',
          href: '/',
        },
        {
          text: 'Starter',
          active: true,
        },
      ],
    }
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
  </Layout>
</template>
