<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import Multiselect from 'vue-multiselect'
import { authComputed, establishmentMethods, authMethods } from '@manager-state/helpers'
import { banks } from './banks-data'

export default {
  components: {
    Multiselect
  },
	data() {
		return {
      establishment: {},
      banks: []
		}
	},
	mounted() {
		this.banks = banks
    this.establishment = Object.assign({}, this.currentUser.person.establishment)
    this.establishment.bank_code = {
      value: this.establishment.bank_code,
      name: this.establishment.legal_name,
    }
	},
  validations: {
    establishment: {
      agency: { required },
      agency_dv: { required },
      account: { required },
      account_dv: { required },
      document_number: { required },
      bank_code: { required },
    }
  },
	computed: {
		...authComputed,
	},
	methods: {
		...authMethods,
    ...establishmentMethods,
		saveBankAccount() {
			this.$v.establishment.$touch()
      if (this.$v.establishment.$invalid) return false;

			Swal.showLoading({title: 'Carregando...'})
      const bank_account = {
        ...this.establishment,
        bank_code: this.establishment.bank_code.value,
        legal_name: this.establishment.bank_code.name,
      }
			this.updateBankAccount({ bank_account })
				.then(() => Swal.fire('Sucesso', 'Registro salvo com sucesso.', 'success'))
				.catch(() => Swal.fire('Erro', 'Erro no servidor, tente novamente mais tarde.', 'error'))
		},
	}
}
</script>

<template>
	<div>
    <form class="form-horizontal">
      <div class="row">
        <div class="col-12">
          <h5>Dados Bancários</h5>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-md-6">
          <b-form-group label-for="species" :class="{ 'has-error': $v.establishment.bank_code.$error }" >
            <label> Banco <span class="text-danger">*</span> </label>
            <multiselect v-model="establishment.bank_code" :class="{ 'is-invalid': $v.establishment.bank_code.$error }"
              selectLabel="" placeholder="" selectedLabel="Selecionado" deselectLabel="Remover"
              :options="banks" track-by="value" label="name"></multiselect>
            <div v-if="$v.establishment.bank_code.$error" class="invalid-feedback">
              <span v-if="!$v.establishment.bank_code.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-6 col-md-3">
          <b-form-group label-for="agency" :class="{ 'has-error': $v.establishment.agency.$error }" >
            <label> Agência <span class="text-danger">*</span> </label>
            <input class="form-control"  id="establishment_agency"
              :class="{ 'is-invalid': $v.establishment.agency.$error }" type="tel" v-model="establishment.agency">
            </input>
            <div v-if="$v.establishment.agency.$error" class="invalid-feedback">
              <span v-if="!$v.establishment.agency.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-6 col-md-3">
          <b-form-group label-for="agency_dv" :class="{ 'has-error': $v.establishment.agency_dv.$error }" >
            <label> Agência DV <span class="text-danger">*</span> </label>
            <b-form-input id="establishment_agency_dv" v-model="establishment.agency_dv"
              :class="{ 'is-invalid': $v.establishment.agency_dv.$error }" v-mask="'#'"> 
            </b-form-input>
            <div v-if="$v.establishment.agency_dv.$error" class="invalid-feedback">
              <span v-if="!$v.establishment.agency_dv.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-6 col-md-3">
          <b-form-group label-for="account" :class="{ 'has-error': $v.establishment.account.$error }" >
            <label> Conta <span class="text-danger">*</span> </label>
            <b-form-input id="establishment_account" v-model="establishment.account" ref="account"
              :class="{ 'is-invalid': $v.establishment.account.$error }"> 
            </b-form-input>
            <div v-if="$v.establishment.account.$error" class="invalid-feedback">
              <span v-if="!$v.establishment.account.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-6 col-md-3">
          <b-form-group label-for="account_dv" :class="{ 'has-error': $v.establishment.account_dv.$error }" >
            <label> Conta DV <span class="text-danger">*</span> </label>
            <b-form-input id="establishment_account_dv" v-model="establishment.account_dv"
              :class="{ 'is-invalid': $v.establishment.account_dv.$error }" v-mask="'#'"> 
            </b-form-input>
            <div v-if="$v.establishment.account_dv.$error" class="invalid-feedback">
              <span v-if="!$v.establishment.account_dv.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-6 col-md-3">
          <b-form-group label-for="document_number" :class="{ 'has-error': $v.establishment.document_number.$error }" >
            <label> Número do Documento <span class="text-danger">*</span> </label>
            <b-form-input id="establishment_document_number" v-model="establishment.document_number"
              :class="{ 'is-invalid': $v.establishment.document_number.$error }"> 
            </b-form-input>
            <div v-if="$v.establishment.document_number.$error" class="invalid-feedback">
              <span v-if="!$v.establishment.document_number.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
      </div>
      <div class="row">
      	<div class="col-12 text-right">
      		<b-button slot="next" variant="outline-primary" @click.prevent="saveBankAccount()"> 
						Atualizar Dados
					</b-button>
      	</div>
      </div>
    </form>
	</div>
</template>