<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import Multiselect from 'vue-multiselect'
import { authComputed, establishmentMethods, authMethods } from '@manager-state/helpers'

export default {
  components: {
    Multiselect
  },
	data() {
		return {
      establishment: {},
      states: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 
        'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
      ]
		}
	},
	mounted() {
    let establishment = Object.assign({}, this.currentUser.person.establishment)
		this.establishment = establishment
	},
  validations: {
    establishment: {
      company_name: { required },
      fantasy_name: { required },
      cnpj: { required, minLength: minLength(14) },
      zipcode: { required },
      address: { required },
      number: { required },
      neighborhood: { required },
      city: { required },
      state: { required },
    }
  },
	computed: {
		...authComputed,
	},
	methods: {
		...authMethods,
    ...establishmentMethods,
		saveEstablishment() {
			this.$v.establishment.$touch()
      if (this.$v.establishment.$invalid) return false;

			Swal.showLoading({title: 'Carregando...'})
			this.updateEstablishment({ establishment: this.establishment })
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
      		<h5>Dados do Estabelecimento</h5>
      	</div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="company_name" :class="{ 'has-error': $v.establishment.company_name.$error }" >
            <label> Razão Social <span class="text-danger">*</span> </label>
            <b-form-input id="establishmentCompanyName" v-model="establishment.company_name"
              :class="{ 'is-invalid': $v.establishment.company_name.$error }">
            </b-form-input>
            <div v-if="$v.establishment.company_name.$error" class="invalid-feedback">
              <span v-if="!$v.establishment.company_name.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="fantasy_name" :class="{ 'has-error': $v.establishment.fantasy_name.$error }" >
            <label> Nome Fantasia <span class="text-danger">*</span> </label>
            <b-form-input id="establishmenFantasyName" v-model="establishment.fantasy_name"
              :class="{ 'is-invalid': $v.establishment.fantasy_name.$error }">
            </b-form-input>
            <div v-if="$v.establishment.fantasy_name.$error" class="invalid-feedback">
              <span v-if="!$v.establishment.fantasy_name.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="cnpj" :class="{ 'has-error': $v.establishment.cnpj.$error }" >
            <label> CNJP <span class="text-danger">*</span> </label>
            <input class="form-control" v-mask="'##.###.###/####-##'" id="cnpj" 
              :class="{ 'is-invalid': $v.establishment.cnpj.$error }" type="tel" v-model="establishment.cnpj">
            </input>
            <div v-if="$v.establishment.cnpj.$error" class="invalid-feedback">
              <span v-if="!$v.establishment.cnpj.required || !$v.establishment.cnpj.minLength">Este campo é obrigatório.</span>
              <!-- <span v-if="!$v.establishment.cnpj.cnpj">CNJP inválido.</span> -->
            </div>
          </b-form-group>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <h5>Endereço</h5>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="zipcode" :class="{ 'has-error': $v.establishment.zipcode.$error }" >
            <label> CEP <span class="text-danger">*</span> </label>
            <input class="form-control" v-mask="'#####-###'" id="establishment_zipcode"
              :class="{ 'is-invalid': $v.establishment.zipcode.$error }" type="tel" v-model="establishment.zipcode">
            </input>
            <div v-if="$v.establishment.zipcode.$error" class="invalid-feedback">
              <span v-if="!$v.establishment.zipcode.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="address" :class="{ 'has-error': $v.establishment.address.$error }" >
            <label> Endereço <span class="text-danger">*</span> </label>
            <b-form-input id="establishment_address" v-model="establishment.address"
              :class="{ 'is-invalid': $v.establishment.address.$error }"> 
            </b-form-input>
            <div v-if="$v.establishment.address.$error" class="invalid-feedback">
              <span v-if="!$v.establishment.address.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-6 col-md-3">
          <b-form-group label-for="number" :class="{ 'has-error': $v.establishment.number.$error }" >
            <label> Número <span class="text-danger">*</span> </label>
            <b-form-input id="establishment_number" v-model="establishment.number" ref="number"
              :class="{ 'is-invalid': $v.establishment.number.$error }"> 
            </b-form-input>
            <div v-if="$v.establishment.number.$error" class="invalid-feedback">
              <span v-if="!$v.establishment.number.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-6 col-md-3">
          <b-form-group label-for="neighborhood" :class="{ 'has-error': $v.establishment.neighborhood.$error }" >
            <label> Bairro <span class="text-danger">*</span> </label>
            <b-form-input id="establishment_neighborhood" v-model="establishment.neighborhood"
              :class="{ 'is-invalid': $v.establishment.neighborhood.$error }"> 
            </b-form-input>
            <div v-if="$v.establishment.neighborhood.$error" class="invalid-feedback">
              <span v-if="!$v.establishment.neighborhood.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="complement">
            <label> Complemento </label>
            <b-form-input  v-model="establishment.complement">
            </b-form-input>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="city" :class="{ 'has-error': $v.establishment.city.$error }" >
            <label> Cidade <span class="text-danger">*</span> </label>
            <b-form-input id="establishment_city" v-model="establishment.city"
              :class="{ 'is-invalid': $v.establishment.city.$error }">
            </b-form-input>
            <div v-if="$v.establishment.city.$error" class="invalid-feedback">
              <span v-if="!$v.establishment.city.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="species" :class="{ 'has-error': $v.establishment.state.$error }" >
            <label> Estado <span class="text-danger">*</span> </label>
            <multiselect v-model="establishment.state" :class="{ 'is-invalid': $v.establishment.state.$error }"
              selectLabel="" placeholder="" selectedLabel="Selecionado" deselectLabel="Remover"
              :options="states"></multiselect>
            <div v-if="$v.establishment.state.$error" class="invalid-feedback">
              <span v-if="!$v.establishment.state.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
      </div>
      <div class="row">
      	<div class="col-12 text-right">
      		<b-button slot="next" variant="outline-primary" @click.prevent="saveEstablishment()"> 
						Atualizar Dados
					</b-button>
      	</div>
      </div>
    </form>
	</div>
</template>