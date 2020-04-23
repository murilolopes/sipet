<script>
import Topbar from '@sales-components/topbar'

export default {
  components: { Topbar },
  created: () => {
    document.body.setAttribute('data-layout', 'topnav')
    document.body.classList.remove('boxed-layout')
  },
}
</script>

<template>
  <div>
    <Topbar/>
    <div class="content-page">
      <div class="content">
        <div class="container-fluid">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
