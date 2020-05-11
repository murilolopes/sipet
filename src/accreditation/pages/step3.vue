<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import Multiselect from 'vue-multiselect'

import { categoryMethods } from '@manager-state/helpers'

export default {
  components: {
    Multiselect
  },
  data() {
    return {
      categories: [],
      selectedServices: [],
    }
  },
  validations: {},
  created() {
    this.$api('/categories').then(resp => {
      this.categories = resp.data
    })
  },
  methods: {
    ...categoryMethods,
    validate() {
      this.$v.client.$touch()
      var isValid = !this.$v.client.$invalid
      this.$emit('on-validate', { }, isValid)
      return isValid
    },
  },
}
</script>

<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <b-tabs class="navtab-bg" pills justified>
              <div v-for="category in categories">
                <b-tab :title="category.name">
                  <template slot="title"> 
                    {{ category.name }}
                  </template>
                  <div class="row">
                    <div class="col-3 text-center" v-for="service in category.services">
                      <div class="input-group bootstrap-touchspin bootstrap-touchspin-injected mb-2">
                        <b-form-checkbox v-model="selectedServices" :value="service.id">{{ service.name }}</b-form-checkbox>
                      </div>
                    </div>
                  </div>
                </b-tab>
              </div>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
