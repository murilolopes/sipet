<script>
import { layoutComputed } from '@manager-state/helpers'
import Vertical from '@manager-router/layouts/vertical'

export default {
  components: { Vertical },
  data() {
    return {}
  },
  computed: {
    ...layoutComputed,
  },
  methods: {},
}
</script>

<template>
  <div>
    <Vertical>
      <slot />
    </Vertical>
  </div>
</template>
