<script>
import Layout from '@manager-layouts/default'
import { authMethods } from '@manager-state/helpers'
import appConfig from '@manager-src/app.config'
import InputText from "@components/inputs/text";
import Multiselect from 'vue-multiselect'
import { required, minLength, email, sameAs, requiredIf } from 'vuelidate/lib/validators'

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
	page: {
		title: 'Register',
		meta: [{ name: 'description', content: `Register to ${appConfig.title}` }],
	},
	components: { Layout, InputText, Multiselect },
	data() {
		return {
      nameMessages: [{ key: "required", message: "Este campo é obrigatório. " }],
      cpfMessages: [
        { key: "required", message: "Este campo é obrigatório. " },
        { key: "cpf", message: "CPF inválido. " },
        { key: "isUnique", message: "CPF já cadastrado. " },
      ],
      birthdateMessages: [
        { key: "required", message: "Este campo é obrigatório. " },
        { key: "date", message: "Data inválida. " }
      ],
      phoneMessages: [
        { key: "required", message: "Este campo é obrigatório. " },
        { key: "minLength", message: "Número de telefone incompleto. " }
      ],
      emailMessages: [
        { key: "required", message: "Este campo é obrigatório. " },
        { key: "email", message: "Email inválido. " },
        { key: "isUnique", message: "Email já cadastrado. " }
      ],
      passwordMessages: [
        { key: "required", message: "Este campo é obrigatório. " },
        {
          key: "minLength",
          message: "Senha deve conter no minimo 8 caracteres. "
        }
      ],
      passwordConfirmationMessages: [
        { key: "required", message: "Este campo é obrigatório. " },
        { key: "sameAsPassword", message: "Senha deve ser identica. " }
      ],
      crmvMessages: [
        { key: "required", message: "Este campo é obrigatório. " }
      ],
      crmvUfMessages: [
        { key: "required", message: "Este campo é obrigatório. " }
      ],
      states: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 
        'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
      ],
      invitation_token: '',
      employee: {
        name: '',
        cpf: '',
        birthdate: '',
        phone: '',
        crmv: '',
        crmv_uf: '',
	      credential_attributes: {
	        password: '',
	        password_confirmation: '',
	      },
      },
		}
	},
  validations: {
    employee: {
      name: { required },
      cpf: { 
      	required,
        cpf,
        async isUnique(value) {
          if (value === '' || value.length < 14) return true
          if (this.$v.employee.cpf.cpf) {
            // const response = await this.$api.post('clients/by_cpf', { cpf: value })
            // return !response.data
          }
          return true
        }
			},
      birthdate: { 
        required, 
        date: (value) => { 
          if (value.length == 10) return moment(value, 'DD/MM/YYYY', true).isValid()
          return true
        },
      },
      phone: { required, minLength: (value) => value.replace(/\D/g, '').length == 11 },
      crmv: { required },
      crmv_uf: { required },
	    credential_attributes: {
	      password: { required, minLength: minLength(8) },
	      password_confirmation: { required, sameAsPassword: sameAs('password') },
	    }
    },
  },
	mounted(){
		this.invitation_token = this.$route.query.invitation_token
		this.getInvitationResource(this.invitation_token);
		
	},
	computed: {},
	methods: {
		...authMethods,
		accept() {
			Swal.fire({ title: 'Validando convite!' });
			Swal.showLoading();

			return this.acceptInvitation({ employee: this.employee, invitation_token: this.invitation_token })
				.then(() => {
					this.validate(true).then(() => {
						Swal.close()
						this.$router.push('/')
					})
				})
				.catch((err) => console.log(err))
		},
	},
}
</script>

<template>
	<Layout>
		<div class="account-pages my-5">
			<div class="container">
				<div class="row justify-content-center">
					<div class="col-xl-10">
						<div class="card">
							<div class="card-body p-0">
								<div class="row">
									<div class="col-md-12 p-5">
										<div class="mx-auto mb-5">
											<a href="/">
												<img src="@assets/images/logo.png" alt height="24" />
												<h3 class="d-inline align-middle ml-1 text-logo"
													>Shreyu</h3
												>
											</a>
										</div>

										<h6 class="h5 mb-0 mt-4">Crie sua conta</h6>
										<p class="text-muted mt-0 mb-4"
											>Para finalizar seu convite, precisamos que preencha o formulário abaixo.</p
										>

										<form class="form-horizontal">
								      <div class="row">
								        <div class="col-12 col-md-6">
								          <InputText
								            v-model="$v.employee.name.$model"
								            label="Nome"
								            required
								            :validations="$v.employee.name"
								            :errorMessages="nameMessages"
								          />
								        </div>

								        <div class="col-12 col-md-6">
								          <InputText
								            v-model="$v.employee.cpf.$model"
								            label="CPF"
								            required
								            :validations="$v.employee.cpf"
								            :errorMessages="nameMessages"
								            type="tel"
								            mask="###.###.###-##"
								          />
								        </div>
								        
								        <div class="col-12 col-md-6">
								          <InputText
								            v-model="$v.employee.birthdate.$model"
								            label="Data de nascimento"
								            required
								            :validations="$v.employee.birthdate"
								            :errorMessages="birthdateMessages"
								            type="tel"
								            mask="##/##/####"
								          />
								        </div>
								        
								        <div class="col-12 col-md-6">
								          <InputText
								            v-model="$v.employee.phone.$model"
								            label="Telefone"
								            required
								            :validations="$v.employee.phone"
								            :errorMessages="phoneMessages"
								            type="tel"
								            mask="(##) #####-####"
								          />
								        </div>
								        
								        <div class="col-12 col-md-6">
								          <InputText
								            v-model="$v.employee.crmv.$model"
								            label="CRMV"
								            required
								            :validations="$v.employee.crmv"
								            :errorMessages="crmvMessages"
								          />
								        </div>
								        
								        <div class="col-6 col-md-6">
		                      <b-form-group>
		                        <label> UF <span class="text-danger">*</span> </label>
		                        <multiselect v-model="employee.crmv_uf" :options="states" 
		                          :hide-selected="true" :allow-empty="false"></multiselect>
		                      </b-form-group>
		                    </div>

								        <div class="col-12 col-md-6">
								          <InputText
								            v-model="$v.employee.credential_attributes.password.$model"
								            label="Senha"
								            required
								            type="password"
								            :validations="$v.employee.credential_attributes.password"
								            :errorMessages="passwordMessages"
								          />
								        </div>
								        
								        <div class="col-12 col-md-6">
								          <InputText
								            v-model="$v.employee.credential_attributes.password_confirmation.$model"
								            label="Confirmar senha"
								            required
								            type="password"
								            :validations="$v.employee.credential_attributes.password_confirmation"
								            :errorMessages="passwordConfirmationMessages"
								          />
								        </div>
								        
								        <div class="col-6 offset-3 text-center">
													<button class="btn btn-block btn-primary waves-effect waves-light mt-3" @click.prevent="accept()">Cadastrar</button>
								        </div>
								        
								      </div>
								    </form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Layout>
</template>

<style lang="scss" module></style>
