<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import Multiselect from 'vue-multiselect'
import { authComputed, personMethods, authMethods } from '@manager-state/helpers'

export default {
  components: {
    Multiselect
  },
	data() {
		return {
      password: {
        emailConfirmation: '',
        password: '',
        password_confirmation: ''
      },
      person: {},
      states: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 
        'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
      ]
		}
	},
	mounted() {
		let email = Object.assign({}, this.currentUser)
    let person = Object.assign({}, this.currentUser.person)
		delete person.establishment
		person.birthdate = moment(person.birthdate, 'YYYY-MM-DD').format('DD/MM/YYYY') 
		this.person = person
    this.password.email = email.email
	},
  validations: {
    person: {
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
    },
    password: {
      email: { required, email },
      emailConfirmation: { required, email, sameAsEmail: sameAs('email') },
      password: { required, minLength: minLength(8) },
      password_confirmation: { required, sameAsPassword: sameAs('password') },
    }
  },
	computed: {
		...authComputed,
	},
	methods: {
		...authMethods,
    ...personMethods,
		savePerson() {
			this.$v.person.$touch()
      if (this.$v.person.$invalid) return false;

			Swal.showLoading('Carregando...')
			this.updatePerson({ person: this.person })
				.then(() => {
          this.validate(true)
          Swal.fire('Sucesso', 'Registro salvo com sucesso.', 'success')
        })
				.catch(() => Swal.fire('Erro', 'Erro no servidor, tente novamente mais tarde.', 'error'))
		},
    updatePassword() {
      this.$v.password.$touch()
      if (this.$v.password.$invalid) return false;

      Swal.showLoading('Carregando...')
      const { password, password_confirmation } = this.password
      this.passwordUpdate({ password, password_confirmation })
        .then(() => {
          this.$router.push('/login')
          Swal.fire('Sucesso', 'Senha atualizada com sucesso, favor logar novamente!', 'success')
        })
        .catch(() => Swal.fire('Erro', 'Erro no servidor, tente novamente mais tarde.', 'error'))
    }
	}
}
</script>

<template>
	<div>
    <form class="form-horizontal">
      <div class="row">
      	<div class="col-12">
      		<h5>Informações pessoais</h5>
      	</div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="name" :class="{ 'has-error': $v.person.name.$error }" >
            <label> Nome <span class="text-danger">*</span> </label>
            <b-form-input id="personName" v-model="person.name"
              :class="{ 'is-invalid': $v.person.name.$error }">
            </b-form-input>
            <div v-if="$v.person.name.$error" class="invalid-feedback">
              <span v-if="!$v.person.name.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="cpf" :class="{ 'has-error': $v.person.cpf.$error }" >
            <label> CPF <span class="text-danger">*</span> </label>
            <input class="form-control" v-mask="'###.###.###-##'" id="cpf" 
              :class="{ 'is-invalid': $v.person.cpf.$error }" type="tel" v-model="person.cpf">
            </input>
            <div v-if="$v.person.cpf.$error" class="invalid-feedback">
              <span v-if="!$v.person.cpf.required || !$v.person.cpf.minLength">Este campo é obrigatório.</span>
              <span v-if="!$v.person.cpf.cpf">CPF inválido.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="birthdate" :class="{ 'has-error': $v.person.birthdate.$error }" >
            <label> Data de nascimento <span class="text-danger">*</span> </label>
            <input class="form-control" v-mask="'##/##/####'" id="personBirthdate"
              :class="{ 'is-invalid': $v.person.birthdate.$error }" type="tel" v-model="person.birthdate">
            </input>
            <div v-if="$v.person.birthdate.$error" class="invalid-feedback">
              <span v-if="!$v.person.birthdate.required || !$v.person.birthdate.minLength">Este campo é obrigatório. </span>
              <span v-if="!$v.person.birthdate.date">Data inválida. </span>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="phone" :class="{ 'has-error': $v.person.phone.$error }" >
            <label> Telefone <span class="text-danger">*</span>  </label>
            <input class="form-control" v-mask="'(##) #####-####'" id="phone"
              :class="{ 'is-invalid': $v.person.phone.$error }" type="tel" v-model="person.phone">
            </input>
            <div v-if="$v.person.phone.$error" class="invalid-feedback">
              <span v-if="!$v.person.phone.required || !$v.person.phone.minLength">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <h5>Endereço</h5>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="zipcode" :class="{ 'has-error': $v.person.zipcode.$error }" >
            <label> CEP <span class="text-danger">*</span> </label>
            <input class="form-control" v-mask="'#####-###'" id="zipcode"
              :class="{ 'is-invalid': $v.person.zipcode.$error }" type="tel" v-model="person.zipcode">
            </input>
            <div v-if="$v.person.zipcode.$error" class="invalid-feedback">
              <span v-if="!$v.person.zipcode.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="address" :class="{ 'has-error': $v.person.address.$error }" >
            <label> Endereço <span class="text-danger">*</span> </label>
            <b-form-input id="address" v-model="person.address"
              :class="{ 'is-invalid': $v.person.address.$error }"> 
            </b-form-input>
            <div v-if="$v.person.address.$error" class="invalid-feedback">
              <span v-if="!$v.person.address.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-6 col-md-3">
          <b-form-group label-for="number" :class="{ 'has-error': $v.person.number.$error }" >
            <label> Número <span class="text-danger">*</span> </label>
            <b-form-input id="number" v-model="person.number" ref="number"
              :class="{ 'is-invalid': $v.person.number.$error }"> 
            </b-form-input>
            <div v-if="$v.person.number.$error" class="invalid-feedback">
              <span v-if="!$v.person.number.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-6 col-md-3">
          <b-form-group label-for="neighborhood" :class="{ 'has-error': $v.person.neighborhood.$error }" >
            <label> Bairo <span class="text-danger">*</span> </label>
            <b-form-input id="neighborhood" v-model="person.neighborhood"
              :class="{ 'is-invalid': $v.person.neighborhood.$error }"> 
            </b-form-input>
            <div v-if="$v.person.neighborhood.$error" class="invalid-feedback">
              <span v-if="!$v.person.neighborhood.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="complement">
            <label> Complemento </label>
            <b-form-input  v-model="person.complement">
            </b-form-input>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="city" :class="{ 'has-error': $v.person.city.$error }" >
            <label> Cidade <span class="text-danger">*</span> </label>
            <b-form-input id="city" v-model="person.city"
              :class="{ 'is-invalid': $v.person.city.$error }">
            </b-form-input>
            <div v-if="$v.person.city.$error" class="invalid-feedback">
              <span v-if="!$v.person.city.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="species" :class="{ 'has-error': $v.person.state.$error }" >
            <label> Estado <span class="text-danger">*</span> </label>
            <multiselect v-model="person.state" :class="{ 'is-invalid': $v.person.state.$error }"
              selectLabel="" placeholder="" selectedLabel="Selecionado" deselectLabel="Remover"
              :options="states"></multiselect>
            <div v-if="$v.person.state.$error" class="invalid-feedback">
              <span v-if="!$v.person.state.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
      </div>
      <div class="row">
      	<div class="col-12 text-right">
      		<b-button slot="next" variant="outline-primary" @click.prevent="savePerson()"> 
						Atualizar Dados
					</b-button>
      	</div>
      </div>

      <div class="row">
        <div class="col-12">
          <h5>Senha</h5>
        </div>

        <div class="col-12 col-md-6">
          <b-form-group label-for="password.email">
            <label> Email
              <span class="text-danger">*</span>
            </label>
            <b-form-input :disabled="true" id="password.email" v-model="password.email" 
              :class="{ 'is-invalid': $v.password.email.$error }">
            </b-form-input>
            <div v-if="$v.password.email.$error" 
              class="invalid-feedback">
              <span v-if="!$v.password.email.required">
                Esse campo é obrigatório.
              </span>
              <span v-if="!$v.password.email.email">
                Email inválido.
              </span>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="password.emailConfirmation">
            <label> Confirmação de email
              <span class="text-danger">*</span>
            </label>
            <b-form-input id="password.emailConfirmation" v-model="password.emailConfirmation" 
              :class="{ 'is-invalid': $v.password.emailConfirmation.$error }">
            </b-form-input>
            <div v-if="$v.password.emailConfirmation.$error" 
              class="invalid-feedback">
              <span v-if="!$v.password.emailConfirmation.required">
                Esse campo é obrigatório.
              </span>
              <span v-if="!$v.password.emailConfirmation.email">
                Email inválido.
              </span>
              <span v-if="!$v.password.emailConfirmation.sameAsEmail">
                Email deve ser identico.
              </span>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="password">
            <label> Senha
              <span class="text-danger">*</span>
            </label>
            <b-form-input id="password" v-model="password.password" type="password" 
            :class="{ 'is-invalid': $v.password.password.$error }">
            </b-form-input>
            <div v-if="$v.password.password.$error" class="invalid-feedback">
              <span v-if="!$v.password.password.required">
                Esse campo é obrigatório.
              </span>
              <span v-if="!$v.password.password.minLength">
                A senha deve ter {{ $v.password.password.$params.minLength.min }} caracteres.
              </span>
            </div>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6">
          <b-form-group label-for="password_confirmation">
            <label> Confirmação de senha
              <span class="text-danger">*</span>
            </label>
            <b-form-input id="password_confirmation" v-model="password.password_confirmation" type="password" 
            :class="{ 'is-invalid': $v.password.password_confirmation.$error }">
            </b-form-input>
            <div v-if="$v.password.password_confirmation.$error" class="invalid-feedback">
              <span v-if="!$v.password.password_confirmation.required">
                Esse campo é obrigatório.
              </span>
              <span v-if="!$v.password.password_confirmation.sameAsPassword">
                A senha deve ser identica.
              </span>
            </div>
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-12 text-right">
          <b-button slot="next" variant="outline-primary" @click.prevent="updatePassword()"> 
            Atualizar Senha
          </b-button>
        </div>
      </div>
    </form>
	</div>
</template>