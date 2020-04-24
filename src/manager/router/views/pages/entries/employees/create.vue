<script>
import appConfig from '@manager-src/app.config'
import Layout from '@manager-layouts/main'
import PageHeader from '@manager-components/page-header'

import { required, minLength, email, sameAs, requiredIf } from 'vuelidate/lib/validators'
import Multiselect from 'vue-multiselect'
import { authComputed, personMethods, employeeMethods, authMethods } from '@manager-state/helpers'

export default {
  page: {
    title: 'Cadastro de funcionários',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader, Multiselect },
  data() {
    return {
      title: 'Cadastro de funcionários',
      items: [
        {
          text: 'Dasboard',
          href: '/',
        },
        {
          text: 'Funcionários',
          href: '/cadastros/funcionarios',
        },
        {
          text: 'Cadastrar Funcionário',
          active: true,
        },
      ],
      credential_types: [
        { key: 'employee', label: 'Funcionário' },
        { key: 'vet', label: 'Veterinário' },
      ],
      states: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 
        'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
      ],
      employee: {
        name: '',
        cpf: '',
        birthdate: '',
        phone: '',
        zipcode: '',
        address: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        crmv: '',
        crmv_uf: '',
      },
      credential_attributes: {
        credential_type: { key: 'employee', label: 'Funcionário' },
        email: '',
        password: '',
        password_confirmation: '',
      },
    }
  },
  computed: {
    isVet() {
      let credential_type = this.credential_attributes.credential_type
      return credential_type && credential_type.key == 'vet'
    }
  },
  methods: {
    ...employeeMethods,
    handleSubmit() {
      this.$v.employee.$touch()
      this.$v.credential_attributes.$touch()
      if (!this.$v.employee.$invalid && !this.$v.credential_attributes.$invalid) {
        const payload = {
          ...this.employee,
          credential_attributes: this.credential_attributes
        }
        this.createEmployee(payload)
      }
    }
  },
  validations: {
    employee: {
      name: { required },
      cpf: { required, minLength: minLength(14) },
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
      // crmv: { required },
      // crmv_uf: { required },
    },
    credential_attributes: {
      email: { required, email },
      password: { required, minLength: minLength(8) },
      password_confirmation: { required, sameAsPassword: sameAs('password') },
    }
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <form class="form-horizontal" @submit.prevent="handleSubmit">
              <div class="row">
                <div class="col-12">
                  <h5><strong>Informações pessoais</strong></h5>
                </div>
                <div class="col-12 col-md-6">
                  <b-form-group label-for="name" :class="{ 'has-error': $v.employee.name.$error }" >
                    <label> Nome <span class="text-danger">*</span> </label>
                    <b-form-input id="employeeName" v-model="employee.name"
                      :class="{ 'is-invalid': $v.employee.name.$error }">
                    </b-form-input>
                    <div v-if="$v.employee.name.$error" class="invalid-feedback">
                      <span v-if="!$v.employee.name.required">Este campo é obrigatório.</span>
                    </div>
                  </b-form-group>
                </div>
                <div class="col-12 col-md-6">
                  <b-form-group label-for="cpf" :class="{ 'has-error': $v.employee.cpf.$error }" >
                    <label> CPF <span class="text-danger">*</span> </label>
                    <input class="form-control" v-mask="'###.###.###-##'" id="cpf" 
                      :class="{ 'is-invalid': $v.employee.cpf.$error }" type="tel" v-model="employee.cpf">
                    </input>
                    <div v-if="$v.employee.cpf.$error" class="invalid-feedback">
                      <span v-if="!$v.employee.cpf.required || !$v.employee.cpf.minLength">Este campo é obrigatório.</span>
                      <span v-if="!$v.employee.cpf.cpf">CPF inválido.</span>
                    </div>
                  </b-form-group>
                </div>
                <div class="col-12 col-md-6">
                  <b-form-group label-for="birthdate" :class="{ 'has-error': $v.employee.birthdate.$error }" >
                    <label> Data de nascimento <span class="text-danger">*</span> </label>
                    <input class="form-control" v-mask="'##/##/####'" id="employeeBirthdate"
                      :class="{ 'is-invalid': $v.employee.birthdate.$error }" type="tel" v-model="employee.birthdate">
                    </input>
                    <div v-if="$v.employee.birthdate.$error" class="invalid-feedback">
                      <span v-if="!$v.employee.birthdate.required || !$v.employee.birthdate.minLength">Este campo é obrigatório. </span>
                      <span v-if="!$v.employee.birthdate.date">Data inválida. </span>
                    </div>
                  </b-form-group>
                </div>
                <div class="col-12 col-md-6">
                  <b-form-group label-for="phone" :class="{ 'has-error': $v.employee.phone.$error }" >
                    <label> Telefone <span class="text-danger">*</span>  </label>
                    <input class="form-control" v-mask="'(##) #####-####'" id="phone"
                      :class="{ 'is-invalid': $v.employee.phone.$error }" type="tel" v-model="employee.phone">
                    </input>
                    <div v-if="$v.employee.phone.$error" class="invalid-feedback">
                      <span v-if="!$v.employee.phone.required || !$v.employee.phone.minLength">Este campo é obrigatório.</span>
                    </div>
                  </b-form-group>
                </div>
              </div>

              <div class="row">
                <div class="col-12">
                  <h5><strong>Endereço</strong></h5>
                </div>
                <div class="col-12 col-md-6">
                  <b-form-group label-for="zipcode" :class="{ 'has-error': $v.employee.zipcode.$error }" >
                    <label> CEP <span class="text-danger">*</span> </label>
                    <input class="form-control" v-mask="'#####-###'" id="zipcode"
                      :class="{ 'is-invalid': $v.employee.zipcode.$error }" type="tel" v-model="employee.zipcode">
                    </input>
                    <div v-if="$v.employee.zipcode.$error" class="invalid-feedback">
                      <span v-if="!$v.employee.zipcode.required">Este campo é obrigatório.</span>
                    </div>
                  </b-form-group>
                </div>
                <div class="col-12 col-md-6">
                  <b-form-group label-for="address" :class="{ 'has-error': $v.employee.address.$error }" >
                    <label> Endereço <span class="text-danger">*</span> </label>
                    <b-form-input id="address" v-model="employee.address"
                      :class="{ 'is-invalid': $v.employee.address.$error }"> 
                    </b-form-input>
                    <div v-if="$v.employee.address.$error" class="invalid-feedback">
                      <span v-if="!$v.employee.address.required">Este campo é obrigatório.</span>
                    </div>
                  </b-form-group>
                </div>
                <div class="col-6 col-md-3">
                  <b-form-group label-for="number" :class="{ 'has-error': $v.employee.number.$error }" >
                    <label> Número <span class="text-danger">*</span> </label>
                    <b-form-input id="number" v-model="employee.number" ref="number"
                      :class="{ 'is-invalid': $v.employee.number.$error }"> 
                    </b-form-input>
                    <div v-if="$v.employee.number.$error" class="invalid-feedback">
                      <span v-if="!$v.employee.number.required">Este campo é obrigatório.</span>
                    </div>
                  </b-form-group>
                </div>
                <div class="col-6 col-md-3">
                  <b-form-group label-for="neighborhood" :class="{ 'has-error': $v.employee.neighborhood.$error }" >
                    <label> Bairo <span class="text-danger">*</span> </label>
                    <b-form-input id="neighborhood" v-model="employee.neighborhood"
                      :class="{ 'is-invalid': $v.employee.neighborhood.$error }"> 
                    </b-form-input>
                    <div v-if="$v.employee.neighborhood.$error" class="invalid-feedback">
                      <span v-if="!$v.employee.neighborhood.required">Este campo é obrigatório.</span>
                    </div>
                  </b-form-group>
                </div>
                <div class="col-12 col-md-6">
                  <b-form-group label-for="complement">
                    <label> Complemento </label>
                    <b-form-input  v-model="employee.complement">
                    </b-form-input>
                  </b-form-group>
                </div>
                <div class="col-12 col-md-6">
                  <b-form-group label-for="city" :class="{ 'has-error': $v.employee.city.$error }" >
                    <label> Cidade <span class="text-danger">*</span> </label>
                    <b-form-input id="city" v-model="employee.city"
                      :class="{ 'is-invalid': $v.employee.city.$error }">
                    </b-form-input>
                    <div v-if="$v.employee.city.$error" class="invalid-feedback">
                      <span v-if="!$v.employee.city.required">Este campo é obrigatório.</span>
                    </div>
                  </b-form-group>
                </div>
                <div class="col-12 col-md-6">
                  <b-form-group label-for="species" :class="{ 'has-error': $v.employee.state.$error }" >
                    <label> Estado <span class="text-danger">*</span> </label>
                    <multiselect v-model="employee.state" :class="{ 'is-invalid': $v.employee.state.$error }"
                      selectLabel="" placeholder="" selectedLabel="Selecionado" deselectLabel="Remover"
                      :options="states"></multiselect>
                    <div v-if="$v.employee.state.$error" class="invalid-feedback">
                      <span v-if="!$v.employee.state.required">Este campo é obrigatório.</span>
                    </div>
                  </b-form-group>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <h5><strong>Senha</strong></h5>
                </div>
                <div class="col-12 col-md-6">
                  <b-form-group>
                    <label> Tipo de acesso <span class="text-danger">*</span> </label>
                    <multiselect v-model="credential_attributes.credential_type" selectLabel="" 
                      :options="credential_types" track-by="key" label="label" :hide-selected="true" 
                      :allow-empty="false"></multiselect>
                  </b-form-group>
                </div>
                <div class="col-12 col-md-6">
                  <div class="row" v-show="isVet">
                    <div class="col-6 col-md-6">
                      <b-form-group label-for="crmv">
                        <label> CRMV <span class="text-danger">*</span> </label>
                        <b-form-input id="crmv" v-model="employee.crmv" type="text"></b-form-input>
                      </b-form-group>
                    </div>
                    <div class="col-6 col-md-6">
                      <b-form-group>
                        <label> UF <span class="text-danger">*</span> </label>
                        <multiselect v-model="employee.crmv_uf" :options="states" 
                          :hide-selected="true" :allow-empty="false"></multiselect>
                      </b-form-group>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <b-form-group label-for="credential_attributes.email">
                    <label> Email <span class="text-danger">*</span> </label>
                    <b-form-input id="credential_attributes.email" v-model="credential_attributes.email" 
                      :class="{ 'is-invalid': $v.credential_attributes.email.$error }">
                    </b-form-input>
                    <div v-if="$v.credential_attributes.email.$error" class="invalid-feedback">
                      <span v-if="!$v.credential_attributes.email.required"> Esse campo é obrigatório.</span>
                      <span v-if="!$v.credential_attributes.email.email"> Email inválido.</span>
                    </div>
                  </b-form-group>
                </div>
                <div class="col-6 col-md-3">
                  <b-form-group label-for="password">
                    <label> Senha <span class="text-danger">*</span> </label>
                    <b-form-input id="password" v-model="credential_attributes.password" type="password" 
                      :class="{ 'is-invalid': $v.credential_attributes.password.$error }">
                    </b-form-input>
                    <div v-if="$v.credential_attributes.password.$error" class="invalid-feedback">
                      <span v-if="!$v.credential_attributes.password.required">
                        Esse campo é obrigatório.</span>
                      <span v-if="!$v.credential_attributes.password.minLength">
                        A senha deve ter {{ $v.credential_attributes.password.$params.minLength.min }} caracteres.</span>
                    </div>
                  </b-form-group>
                </div>
                <div class="col-6 col-md-3">
                  <b-form-group label-for="password_confirmation">
                    <label> Confirmação de senha
                      <span class="text-danger">*</span>
                    </label>
                    <b-form-input id="password_confirmation" v-model="credential_attributes.password_confirmation" type="password" 
                    :class="{ 'is-invalid': $v.credential_attributes.password_confirmation.$error }">
                    </b-form-input>
                    <div v-if="$v.credential_attributes.password_confirmation.$error" class="invalid-feedback">
                      <span v-if="!$v.credential_attributes.password_confirmation.required">
                        Esse campo é obrigatório.
                      </span>
                      <span v-if="credential_attributes.password_confirmation && !$v.credential_attributes.password_confirmation.sameAsPassword">
                        A senha deve ser identica.
                      </span>
                    </div>
                  </b-form-group>
                </div>
              </div>
              <div class="row">
                <div class="col-12 text-right">
                  <b-button slot="next" variant="outline-primary" type="submit"> 
                    Atualizar Senha
                  </b-button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
