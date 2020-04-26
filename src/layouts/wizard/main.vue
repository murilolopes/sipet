<script>
import Horizontal from '@layouts/wizard/horizontal'

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
