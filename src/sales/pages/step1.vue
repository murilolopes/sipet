<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import Multiselect from 'vue-multiselect'

const cpf = (value) => {
  var soma;
  var resto;
  soma = 0;
  if (value.length == 14) {
    value = value.replace('-', '').replace('.', '').replace('.', '')
    if (value == "00000000000") return false;
     
    for (let i=1; i<=9; i++) soma = soma + parseInt(value.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11))  resto = 0;
    if (resto != parseInt(value.substring(9, 10)) ) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma = soma + parseInt(value.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11))  resto = 0;
    if (resto != parseInt(value.substring(10, 11) ) ) return false;
    return true;
  }
  return true
}

export default {
  components: {
    Multiselect
  },
  data() {
    return {
      client: {
        name: '',
        cpf: '',
        birthdate: '',
        phone: '',
        zipcode: '',
        address: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        credential_attributes: {
          credential_type: 'client',
          email: '',
          password: '',
          password_confirmation: '',
        }
      },
      states: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 
        'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
      ]
    }
  },
  validations: {
    client: {
      credential_attributes: {
        email: { 
          required, 
          email,
          // async isUnique(value) {
          //   if (value === '' || !this.$v.client.credential_attributes.email.email) return true
          //   if (this.$v.client.credential_attributes.email.email) {
          //     const response = await this.$api.post('clients/by_email', { 'email': value })
          //     return !response.data
          //   }
          // }
        },
        password: { required, minLength: minLength(8) },
        password_confirmation: { required, minLength: minLength(8), sameAsPassword: sameAs('password') },
      },
      name: { required },
      cpf: { 
        required,
        cpf,
        minLength: minLength(14),
        // async isUnique(value) {
        //   if (value === '' || !this.$v.client.cpf.cpf) return true

        //   if (this.$v.client.cpf.cpf) {
        //     const response = await this.$api.post('clients/by_cpf', { cpf: value })
        //     return !response.data
        //   }
        // }
      },
      birthdate: { 
        required, 
        minLength: minLength(10),
        date: (value) => { 
          if (value.length == 10) return moment(value, 'DD/MM/YYYY', true).isValid()
          return true
        },
      },
      phone: { required, minLength: (value) => value.replace(/\D/g, '').length == 11 },
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
      this.$v.client.$touch()
      var isValid = !this.$v.client.$invalid
      this.$emit('on-validate', { client: this.client }, isValid)
      return isValid
    },
  },
  watch: {
    'client.zipcode'(value) {
      if (value.length == 9){
        let that = this
        value = value.replace("-", "")
        that.$pagarme.zipcodes.find({zipcode: value})
          .then(response => {
            that.client.address = response.street
            that.client.neighborhood = response.neighborhood
            that.client.city = response.city
            that.client.state = response.state
            this.$refs.number.$el.focus()
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
          <b-form-group label-for="email" :class="{ 'has-error': $v.client.credential_attributes.email.$error, 'form-group--loading': $v.client.credential_attributes.email.$pending }" >
            <label> Email <span class="text-danger">*</span> </label>
            <input class="form-control" id="email" type="email" v-model="client.credential_attributes.email"
              :class="{ 'is-invalid': $v.client.credential_attributes.email.$error }">
            </input>
            <div v-if="$v.client.credential_attributes.email.$error" class="invalid-feedback">
              <span v-if="!$v.client.credential_attributes.email.required">Este campo é obrigatório.</span>
              <span v-if="!$v.client.credential_attributes.email.email">Email inválido.</span>
              <!-- <span v-if="!$v.client.credential_attributes.email.isUnique">Email já esta em uso.</span> -->
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-3">
          <b-form-group label-for="password">
            <label> Senha
              <span class="text-danger">*</span>
            </label>
            <b-form-input id="password" v-model="client.credential_attributes.password" type="password" 
            :class="{ 'is-invalid': $v.client.credential_attributes.password.$error }">
            </b-form-input>
            <div v-if="$v.client.credential_attributes.password.$error" class="invalid-feedback">
              <span v-if="!$v.client.credential_attributes.password.required">
                Esse campo é obrigatório.
              </span>
              <span v-if="!$v.client.credential_attributes.password.minLength">
                A senha deve ter no mínimo {{ $v.client.credential_attributes.password.$params.minLength.min }} caracteres.
              </span>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-3">
          <b-form-group label-for="password_confirmation">
            <label> Confirmação de senha
              <span class="text-danger">*</span>
            </label>
            <b-form-input id="password_confirmation" v-model="client.credential_attributes.password_confirmation" type="password" 
            :class="{ 'is-invalid': $v.client.credential_attributes.password_confirmation.$error }">
            </b-form-input>
            <div v-if="$v.client.credential_attributes.password_confirmation.$error" class="invalid-feedback">
              <span v-if="!$v.client.credential_attributes.password_confirmation.required">
                Esse campo é obrigatório.
              </span>
              <span v-if="!$v.client.credential_attributes.password_confirmation.sameAsPassword && 
                client.credential_attributes.password_confirmation.length > 1">
                A senha deve ser identica.
              </span>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="name" :class="{ 'has-error': $v.client.name.$error }" >
            <label> Nome <span class="text-danger">*</span> </label>
            <b-form-input id="personName" v-model="client.name"
              :class="{ 'is-invalid': $v.client.name.$error }">
            </b-form-input>
            <div v-if="$v.client.name.$error" class="invalid-feedback">
              <span v-if="!$v.client.name.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="cpf" :class="{ 'has-error': $v.client.cpf.$error, 'form-group--loading': $v.client.cpf.$pending }" >
            <label> CPF <span class="text-danger">*</span> </label>
            <input class="form-control" v-mask="'###.###.###-##'" id="cpf" 
              :class="{ 'is-invalid': $v.client.cpf.$error }" type="tel" v-model="client.cpf">
            </input>
            <div v-if="$v.client.cpf.$error" class="invalid-feedback">
              <span v-if="!$v.client.cpf.required || !$v.client.cpf.minLength">Este campo é obrigatório.</span>
              <span v-if="!$v.client.cpf.cpf">CPF inválido.</span>
              <!-- <span v-if="!$v.client.cpf.isUnique">CPF já esta em uso.</span> -->

            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="birthdate" :class="{ 'has-error': $v.client.birthdate.$error }" >
            <label> Data de nascimento <span class="text-danger">*</span> </label>
            <input class="form-control" v-mask="'##/##/####'" id="personBirthdate"
              :class="{ 'is-invalid': $v.client.birthdate.$error }" type="tel" v-model="client.birthdate">
            </input>
            <div v-if="$v.client.birthdate.$error" class="invalid-feedback">
              <span v-if="!$v.client.birthdate.required || !$v.client.birthdate.minLength">Este campo é obrigatório. </span>
              <span v-if="!$v.client.birthdate.date">Data inválida. </span>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="phone" :class="{ 'has-error': $v.client.phone.$error }" >
            <label> Telefone <span class="text-danger">*</span>  </label>
            <input class="form-control" v-mask="'(##) #####-####'" id="phone"
              :class="{ 'is-invalid': $v.client.phone.$error }" type="tel" v-model="client.phone">
            </input>
            <div v-if="$v.client.phone.$error" class="invalid-feedback">
              <span v-if="!$v.client.phone.required || !$v.client.phone.minLength">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-6">
          <b-form-group label-for="zipcode" :class="{ 'has-error': $v.client.zipcode.$error }" >
            <label> CEP <span class="text-danger">*</span> </label>
            <input class="form-control" v-mask="'#####-###'" id="zipcode"
              :class="{ 'is-invalid': $v.client.zipcode.$error }" type="tel" v-model="client.zipcode">
            </input>
            <div v-if="$v.client.zipcode.$error" class="invalid-feedback">
              <span v-if="!$v.client.zipcode.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="address" :class="{ 'has-error': $v.client.address.$error }" >
            <label> Endereço <span class="text-danger">*</span> </label>
            <b-form-input id="address" v-model="client.address"
              :class="{ 'is-invalid': $v.client.address.$error }"> 
            </b-form-input>
            <div v-if="$v.client.address.$error" class="invalid-feedback">
              <span v-if="!$v.client.address.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-6 col-md-3">
          <b-form-group label-for="number" :class="{ 'has-error': $v.client.number.$error }" >
            <label> Número <span class="text-danger">*</span> </label>
            <b-form-input id="number" v-model="client.number" ref="number"
              :class="{ 'is-invalid': $v.client.number.$error }"> 
            </b-form-input>
            <div v-if="$v.client.number.$error" class="invalid-feedback">
              <span v-if="!$v.client.number.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-6 col-md-3">
          <b-form-group label-for="neighborhood" :class="{ 'has-error': $v.client.neighborhood.$error }" >
            <label> Bairo <span class="text-danger">*</span> </label>
            <b-form-input id="neighborhood" v-model="client.neighborhood"
              :class="{ 'is-invalid': $v.client.neighborhood.$error }"> 
            </b-form-input>
            <div v-if="$v.client.neighborhood.$error" class="invalid-feedback">
              <span v-if="!$v.client.neighborhood.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="complement">
            <label> Complemento </label>
            <b-form-input  v-model="client.complement">
            </b-form-input>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="city" :class="{ 'has-error': $v.client.city.$error }" >
            <label> Cidade <span class="text-danger">*</span> </label>
            <b-form-input id="city" v-model="client.city"
              :class="{ 'is-invalid': $v.client.city.$error }">
            </b-form-input>
            <div v-if="$v.client.city.$error" class="invalid-feedback">
              <span v-if="!$v.client.city.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>

        <div class="col-12 col-md-6">
          <b-form-group label-for="species" :class="{ 'has-error': $v.client.state.$error }" >
            <label> Estado <span class="text-danger">*</span> </label>
            <multiselect v-model="client.state" :class="{ 'is-invalid': $v.client.state.$error }"
              selectLabel="" placeholder="" selectedLabel="Selecionado" deselectLabel="Remover"
              :options="states"></multiselect>
            <div v-if="$v.client.state.$error" class="invalid-feedback">
              <span v-if="!$v.client.state.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
      </div>
    </form>
  </div>
</template>
