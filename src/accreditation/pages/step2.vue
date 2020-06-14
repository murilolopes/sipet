<script>
import { required, minLength, email, sameAs, requiredIf } from 'vuelidate/lib/validators'
import Multiselect from 'vue-multiselect'
import InputText from "@components/inputs/text";
import { EventBus } from "./../../plugins/event-bus.js";

export default {
  components: {
    Multiselect,
    InputText
  },
  data() {
    return {
      isEstablishment: true,
      accredited: {
        fantasy_name: '',
        cnpj: '',
        companyPhone: '',
        foundation_date: '',
        zipcode: '',
        address: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        categories: [],
      },
      categories: ['Clinica', 'Clinica 24h', 'Hospital', 'Laboratório'],
      fantasyNameMessages: [{key: 'required', message: 'Este campo é obrigatório. '}],
      cnpjMessages: [{key: 'required', message: 'Este campo é obrigatório. '}],
      companyPhoneMessages: [{key: 'required', message: 'Este campo é obrigatório. '}],
      foundationDateMessages: [{key: 'required', message: 'Este campo é obrigatório. '}],
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
      fantasy_name: { required: requiredIf(function() {return this.isEstablishment })},
      cnpj: { required: requiredIf(function() {return this.isEstablishment })},
      companyPhone: { required: requiredIf(function() {return this.isEstablishment })},
      foundation_date: { required: requiredIf(function() {return this.isEstablishment })},
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
      this.$emit("on-validate", this.accredited, isValid);
      return isValid;
    }
  },
  mounted(){
    EventBus.$on('accreditationType', isEstablishment => {
      this.isEstablishment = isEstablishment
    });
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
      <div class="row" v-if="isEstablishment">
        <div class="col-12 col-md-12 text-center mt-20 mb-20">
          <b-form-group>
            <label> Selecione qual o porte do seu estabelecimento:</label>
            <div class="row">
              <div class="col-6 col-md-3" v-for="(category, index) in categories" :key="index">
                <b-form-group>
                  <b-form-checkbox v-model="accredited.categories" :value="category">{{ category }}</b-form-checkbox>
                </b-form-group>
              </div>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <InputText
            v-model="$v.accredited.fantasy_name.$model"
            label="Nome Fantasia"
            required
            :validations="$v.accredited.fantasy_name"
            :errorMessages="fantasyNameMessages"
          />
        </div>
        <div class="col-12 col-md-6">
          <InputText
            v-model="$v.accredited.cnpj.$model"
            label="CNPJ"
            required
            mask="##.###.###/####-##"
            :validations="$v.accredited.cnpj"
            :errorMessages="cnpjMessages"
          />
        </div>
        <div class="col-12 col-md-6">
          <InputText
            v-model="$v.accredited.companyPhone.$model"
            label="Telefone para contato"
            required
            mask="(##) #####-####"
            :validations="$v.accredited.companyPhone"
            :errorMessages="companyPhoneMessages"
          />
        </div>
        <div class="col-12 col-md-6">
          <InputText
            v-model="$v.accredited.foundation_date.$model"
            label="Data de abertura"
            required
            mask="##/##/####"
            :validations="$v.accredited.foundation_date"
            :errorMessages="foundationDateMessages"
          />
        </div>
      </div>

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
<style>
.mt-20 {
  margin-top: 20px
}

.mb-20 {
  margin-bottom: 20px
}
</style>