<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import Multiselect from 'vue-multiselect'
import InputText from '@components/inputs/text'

export default {
  components: {
    Multiselect, InputText
  },
  data() {
    return {
      email: '',
      emailMessages: [{key: 'email', message: 'Email inválido'}, {key: 'required', message: 'Este campo é obrigatório.'}, {key: 'isUnique', message: 'Email em uso.'}]
    }
  },
  validations: {
    email: { 
      email, 
      required,
      async isUnique(value) {
        if (value === '' || !this.$v.email.email) return true
        if (this.$v.email.email) {
          const response = await this.$api.post('clients/by_email', { 'email': value })
          return !!response.data
        }
      }
    }
  },
  methods: {
    validate() {
      this.$v.email.$touch()
      var isValid = !this.$v.email.$invalid
      this.$emit('on-validate', {email}, isValid)
      return isValid
    },
  },
}
</script>

<template>
  <div>
    <form class="form-horizontal">
      <div class="row">
        <div class="col-12 col-md-6">
          <InputText v-model="$v.email.$model" label="Email" required :validations="$v.email" :errorMessages="emailMessages"/>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="email" 
            :class="{ 
              'form-group--error': $v.email.$error, 
              'form-group--loading': $v.email.$pending 
            }" >
            <label> Email <span class="text-danger">*</span> </label>
            <input class="form-control" 
              id="email" type="email" v-model="$v.email.$model"
              :class="{ 'is-invalid': $v.email.$error }">
             </input>

            <div v-if="$v.email.$error" class="invalid-feedback">
              <span v-if="!$v.email.required">Este campo é obrigatório.</span>
              <span v-if="!$v.email.email">Email inválido.</span>
              <span v-if="!$v.email.isUnique">asd.</span>
            </div>
          </b-form-group>
        </div>
      </div>
    </form>
  </div>
</template>
