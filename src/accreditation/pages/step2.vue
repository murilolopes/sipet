<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import Multiselect from 'vue-multiselect'
import InputText from "@components/inputs/text";

export default {
  components: {
    Multiselect,
    InputText
  },
  data() {
    return {
      accredited: {
        zipcode: '',
        address: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
      },
      zipcodeMessages: [{key: 'required', message: 'Este campo é obrigatório. '}],
      addressMessages: [{key: 'required', message: 'Este campo é obrigatório. '}],
      numberMessages: [{key: 'required', message: 'Este campo é obrigatório. '}],
      neighborhoodMessages: [{key: 'required', message: 'Este campo é obrigatório. '}],
      cityMessages: [{key: 'required', message: 'Este campo é obrigatório. '}],
      stateMessages: [{key: 'required', message: 'Este campo é obrigatório. '}],
    }
  },
  validations: {
    accredited: {
      zipcode: { required },
      address: { required },
      number: { required },
      neighborhood: { required },
      city: { required },
      state: { required },
    }
  },
  methods: {
    validate() {
      this.$v.accredited.$touch();
      var isValid = !this.$v.accredited.$invalid;
      this.$emit("on-validate", { accredited: this.accredited }, isValid);
      return isValid;
    }
  },
  watch: {
    'accredited.zipcode'(value) {
      if (value.length == 9){
        let that = this
        value = value.replace("-", "")
        that.$pagarme.zipcodes.find({zipcode: value})
          .then(response => {
            that.accredited.address = response.street
            that.accredited.neighborhood = response.neighborhood
            that.accredited.city = response.city
            that.accredited.state = response.state
          })
      }
    }
  }
}
</script>

<template>
  <div>
    <form class="form-horizontal">
      <div class="row">
        <div class="col-12 col-md-6">
          <InputText
            v-model="$v.accredited.zipcode.$model"
            label="CEP"
            required
            :validations="$v.accredited.zipcode"
            :errorMessages="zipcodeMessages"
            mask="#####-###"
          />
        </div>
        <div class="col-12 col-md-6">
        </div>
        <div class="col-12 col-md-6">
          <InputText
            v-model="$v.accredited.address.$model"
            label="Endereço"
            required
            :validations="$v.accredited.address"
            :errorMessages="addressMessages"
          />
        </div>
        <div class="col-12 col-md-6">
          <InputText
            v-model="$v.accredited.number.$model"
            label="Número"
            required
            :validations="$v.accredited.number"
            :errorMessages="numberMessages"
          />
        </div>
        <div class="col-12 col-md-6">
          <InputText
            v-model="$v.accredited.neighborhood.$model"
            label="Bairro"
            required
            :validations="$v.accredited.neighborhood"
            :errorMessages="neighborhoodMessages"
          />
        </div>
        <div class="col-12 col-md-6">
          <InputText
            v-model="$v.accredited.state.$model"
            label="Estado"
            required
            :validations="$v.accredited.state"
            :errorMessages="stateMessages"
          />
        </div>
        <div class="col-12 col-md-6">
          <InputText
            v-model="$v.accredited.city.$model"
            label="Cidade"
            required
            :validations="$v.accredited.city"
            :errorMessages="cityMessages"
          />
        </div>
      </div>
    </form>
  </div>
</template>
