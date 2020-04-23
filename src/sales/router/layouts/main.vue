<script>
import Horizontal from '@sales-router/layouts/horizontal'

export default {
  components: { Horizontal },
  data() {
    return {}
  },
  methods: {},
}
</script>

<template>
  <div>
    <Horizontal>
      <slot />
    </Horizontal>
  </div>
</template>
