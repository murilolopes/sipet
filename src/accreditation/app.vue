<script>
export default {
  page: {
    titleTemplate(title) {
      title = typeof title === 'function' ? title(this.$store) : title
      return title ? `${title} | Saúde Intregrada Pet` : 'Saúde Intregrada Pet'
    },
  },
}
</script>

<template>
  <div id="app">
    <!--
    Even when routes use the same component, treat them
    as distinct and create the component again.
    -->
    <RouterView :key="$route.fullPath" />
  </div>
</template>

<!-- This should generally be the only global CSS in the app. -->
<style lang="scss">
// Allow element/type selectors, because this is global CSS.
// stylelint-disable selector-max-type, selector-class-pattern

// Design variables and utilities from src/design.
@import '@design';
</style>
