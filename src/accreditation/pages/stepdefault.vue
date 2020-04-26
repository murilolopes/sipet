<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import Multiselect from 'vue-multiselect'

export default {
  components: {
    Multiselect
  },
  data() {
    return {}
  },
  validations: {},
  methods: {
    validate() {
      this.$v.client.$touch()
      var isValid = !this.$v.client.$invalid
      this.$emit('on-validate', { client: this.client }, isValid)
      return isValid
    },
  },
}
</script>

<template>
  <div>
    <form class="form-horizontal">
    </form>
  </div>
</template>
