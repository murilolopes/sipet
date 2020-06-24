<script>
import appConfig from '@manager-src/app.config'
import Layout from '@manager-layouts/main'
import PageHeader from '@manager-components/page-header'

import { required, minLength, email, sameAs, requiredIf } from 'vuelidate/lib/validators'
import Multiselect from 'vue-multiselect'
import { authComputed, personMethods, employeeMethods, authMethods } from '@manager-state/helpers'

import InputText from "@components/inputs/text";

export default {
  page: {
    title: 'Cadastro de funcionários',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader, Multiselect, InputText },
  data() {
    return {
      title: 'Cadastrar de funcionário',
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
      nameMessages: [{ key: "required", message: "Este campo é obrigatório. " }],
      credentialTypeMessages: [{ key: "required", message: "Este campo é obrigatório. " }],
      emailMessages: [{ key: "required", message: "Este campo é obrigatório. " }],
      credential_types: [
        { key: 'employee', label: 'Funcionário' },
        { key: 'vet', label: 'Veterinário' },
      ],
      employee: {
        name: '',
        credential_type: {},
        email: '',
      },
    }
  },
  methods: {
    ...employeeMethods,
    handleSubmit() {
      this.$v.employee.$touch()
      if (!this.$v.employee.$invalid) this.createEmployee(this.employee)
    }
  },
  validations: {
    employee: {
      name: { required },
      credential_type: { required },
      email: { required, email },
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
                  <h5><strong>Informe os dados para enviarmos uma solicitação de cadastro</strong></h5>
                </div>
                <div class="col-4">
                  <InputText
                    v-model="$v.employee.name.$model"
                    label="Nome"
                    required
                    :validations="$v.employee.name"
                    :errorMessages="nameMessages"
                  />
                </div>
                <div class="col-4">
                  <b-form-group>
                    <label> Tipo de acesso <span class="text-danger">*</span> </label>
                    <multiselect v-model="employee.credential_type" selectLabel="" 
                      :options="credential_types" track-by="key" label="label" :hide-selected="true" 
                      :allow-empty="false"></multiselect>
                  </b-form-group>
                </div>
                <div class="col-4">
                  <InputText
                    v-model="$v.employee.email.$model"
                    label="Email"
                    required
                    :validations="$v.employee.email"
                    :errorMessages="nameMessages"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-12 text-right">
                  <b-button slot="next" variant="outline-primary" type="submit"> 
                    Cadastrar
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
