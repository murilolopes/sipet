<script>
import { required } from 'vuelidate/lib/validators'
  
var Card = require("card");

import { FormWizard, TabContent } from 'vue-form-wizard'

import appConfig from '@sales-src/app.config'
import Layout from '@layouts/wizard/main'
import PageHeader from '@components/page-header'

import Step1 from './step1'
import Step2 from './step2'

export default {
	page: {
		title: 'Assine',
		meta: [{ name: 'description', content: appConfig.description }],
	},
	components: { Layout, PageHeader, FormWizard, TabContent, Step1, Step2 },
	data() {
		return {
			client: {},
			terms: false,
			showWelcome: false,
			wizard: {
				activeTabIndex: 0
			},
			items: [],
			finalModel: {
				pets: []
			},
			cardId: '',
			card: {
				number: '',
				name: '',
				expiry: '',
				cvc: '',
			},
			cardOptions: {}
		}
	},
	validations: {
		card: {
			number: { 
				required,
				minLength: (value) => value.replace(/\D/g, '').length > 15
			},
			name: { 
				required,
			},
			expiry: { 
				required,
				minLength: (value) => value.replace(/\D/g, '').length == 4
			},
			cvc: { 
				required,
				minLength: (value) => value.replace(/\D/g, '').length > 2
			},
		}
	}, 
	mounted() {
		this.wizard = this.$refs.wizard

		setTimeout(() => {
			this.cardOptions = new Card({
				form: '#cardForm',
					container: '.card-wrapper',
					formSelectors: {
					nameInput: 'input[name="name"]'
				},
				placeholders: {
					number: '**** **** **** ****',
					name: 'Eu Amo Meu Pet',
					expiry: '**/**',
					cvc: '***'
				}
			})
		}, 10)
	},
	computed: {
		title() {
			let index = this.wizard.activeTabIndex
			let titles = ['Informações pessoais', 'Beneficiários', 'Pagamento', 'Finalização'] 
			return titles[index]
		},
		totalValue() {
			let value = 0
			this.finalModel.pets.filter(pet => {
				pet.categories.filter(c => {
					value += c.price
				})
			})

			return this.numberParaReal(value)
		},
		revision() {
			let quantity = 'Um pet'
			if (this.finalModel.pets.length > 1) quantity =  `São ${this.finalModel.pets.length} pets`


			return `${quantity} no valor de ${this.totalValue} reais cobrados mensalmente 
						e individualmente por pet e seu respectivo plano.`
		}
	},
	methods: {
		showTerms() {
			if (this.terms)
				this.saveClient()
			else
				this.$bvModal.show('terms-modal')
		},
		async saveClient() {
			this.$v.card.$touch()
			this.$bvModal.hide('terms-modal')
			if (this.$v.card.$invalid) return

			window.Swal.showLoading()

			const cards = this.$pagarme.cards
			await cards.create({
				card_number: this.card.number.split(" ").join(""),
				card_holder_name: this.card.name,
				card_expiration_date: this.card.expiry.replace("/", ""),
				card_cvv: this.card.cvc,
			}).then(response => this.cardId = response.id)
					

			this.finalModel.client.cpf = this.finalModel.client.cpf.replace("-", "").replace(".", "").replace(".", "")
			let client = {
				client: {
					...this.finalModel.client,
					pets_attributes: this.finalModel.pets
				},
				card: this.cardId
			}

			this.$api.post('/clients', client)
				.then(response => {
					this.showWelcome = true
					window.Swal.fire('Sucesso', 'Assinatura finalizada com sucesso.', 'success')
					this.client = response.data
				}).catch(error => {
					if (error.response.status == 422) {
						window.Swal.fire('Erro', error.response.data.message, 'error')
					} else {
						window.Swal.fire('Erro', 'Erro no servidor, tente novamente mais tarde.', 'error')
					}
				})
		},
		numberParaReal(value){
			let formated = "R$ " + (value/100).toFixed(2).replace(".",",");
			return formated;
		},
		validateStep(name) {
			var refToValidate = this.$refs[name]
			return refToValidate.validate()
		},
		mergePartialModels(model, isValid) {
			if (isValid) {
				this.finalModel = Object.assign(this.finalModel, model)
			}
		},

		deletePet(index) {
			this.finalModel.pets.splice(index, 1)
		},
		pet_specie(pet) {
			return this.species.filter(specie => specie.value == pet.species.value)[0].label
		},
		pet_gender(pet) {
			return this.genders.filter(gender => gender.value == pet.gender.value)[0].label
		},
		pet_plan(pet) {
			return this.finalModel.plans.filter(plan => plan.id == pet.plan_id)[0].name
		},
	},
}
</script>

<template>
	<Layout>
		<PageHeader :title="title" class="text-center"/>
		<div class="row">
			<div class="col-12">
				<div class="card">
					<div class="card-body">
						<form-wizard ref="wizard" color="#5369f8" error-color="#ff5c75" 
							nextButtonText="Proximo" backButtonText="Voltar" finishButtonText="Finalizar">
							<tab-content title="" :before-change="() => validateStep('step1')">
								<Step1 ref="step1" @on-validate="mergePartialModels" />
							</tab-content>
							<tab-content title="" :before-change="() => validateStep('step2')">
								<Step2 ref="step2" @on-validate="mergePartialModels" />
							</tab-content>
							<tab-content title="">
								<div class="row" v-if="!showWelcome">
									<div class="col-12">
										<div class="text-center">
											<h2 class="mt-0">
												<i class="mdi mdi-check-all"></i>
											</h2>
										</div>
									</div>
									<div class="col-12">
										<div class="card-wrapper" style="margin-left: -34px"></div>
											<div class="row">
												<div class="col-12">
												</div>
												<div class="col-12 col-lg-4 offset-lg-4">
													<form id="cardForm">
														<div class="row" style="margin-top: 10px">
														<div class="col-12 col-lg-12">
														<b-form-group label-for="cardNumber"  :class="{ 'has-error': $v.card.number.$error }">
														<label> Número <span class="text-danger">*</span> </label>
														<input class="form-control" id="cardNumber" name="number"
														type="tel" v-model="card.number" 
														:class="{ 'is-invalid': $v.card.number.$error }" />														<div v-if="$v.card.number.$error" class="invalid-feedback">
														<span v-if="!$v.card.number.required || !$v.card.number.minLength">Este campo é obrigatório.</span>
														</div>
														</b-form-group>
														</div>
														<div class="col-12 col-lg-12">
														<b-form-group label-for="cardName"  :class="{ 'has-error': $v.card.name.$error }">
														<label> Nome do Titular <span class="text-danger">*</span> </label>
														<input class="form-control" id="cardName" name="name"
														type="text" v-model="card.name" 
														:class="{ 'is-invalid': $v.card.name.$error }" />														<div v-if="$v.card.name.$error" class="invalid-feedback">
														<span v-if="!$v.card.name.required">Este campo é obrigatório.</span>
														</div>
														</b-form-group>
														</div>
														<div class="col-6 col-lg-6">
														<b-form-group label-for="cardExpiry"  :class="{ 'has-error': $v.card.expiry.$error }">
														<label> Expira <span class="text-danger">*</span> </label> 
														<input class="form-control" id="cardExpiry"  name="expiry" type="tel"
														v-model="card.expiry" v-mask="'##/##'" :class="{ 'is-invalid': $v.card.expiry.$error }" />														<div v-if="$v.card.expiry.$error" class="invalid-feedback">
														<span v-if="!$v.card.expiry.required || !$v.card.expiry.minLength">Este campo é obrigatório.</span>
														</div>
														</b-form-group>
														</div>
														<div class="col-6 col-lg-6">
														<b-form-group label-for="cardCVC"  :class="{ 'has-error': $v.card.cvc.$error }">
														<label> CVC <span class="text-danger">*</span> </label>
														<input class="form-control" id="cardCVC"  name="cvc"
														type="tel" v-model="card.cvc" 
														:class="{ 'is-invalid': $v.card.cvc.$error }" />														<div v-if="$v.card.cvc.$error" class="invalid-feedback">
														<span v-if="!$v.card.cvc.required || !$v.card.cvc.minLength">Este campo é obrigatório.</span>
														</div>
														</b-form-group>
														</div>
														</div>
													</form>
												</div>
											</div>
										</div>
									</div>
								<div class="col-12" v-else>
									<div class="text-center">
										<h2 class="mt-0">
											<i class="mdi mdi-check-all"></i>
										</h2>
										<h3 class="mt-0">Bem vindo {{ client.name }}!</h3>
										<p class="mb-2 mx-auto">
											Parabéns pela assinatura, em poucos instantes você receberá um
											email com instruções sobre como, quando e onde usar seu plano e
											também como gerenciá-lo.
										</p>
									</div>
								</div>
							</tab-content>
							
							<b-button slot="prev" variant="outline-dark" :disabled="!!client.id">Voltar</b-button>
							<b-button slot="next" variant="outline-primary"> 
								{{ wizard.activeTabIndex != 2 ? 'Proximo' : 'Revisar' }}
							</b-button>
							<b-button slot="finish" variant="outline-success" :disabled="!!client.id"
								@click.prevent="showTerms()">
								Finalizar
							</b-button>
						</form-wizard>
					</div>
				</div>
			</div>
		</div>
		<b-modal id="terms-modal" scrollable title="Termos e condições"
			title-class="font-18" hide-header-close no-close-on-backdrop>
			<p>Cras mattis consectetur purus sit amet fermentum. Cras justo
				odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
				risus, porta ac consectetur ac, vestibulum at eros.
			</p>
			<p>Cras mattis consectetur purus sit amet fermentum. Cras justo
				odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
				risus, porta ac consectetur ac, vestibulum at eros.
			</p>
			<p>Cras mattis consectetur purus sit amet fermentum. Cras justo
				odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
				risus, porta ac consectetur ac, vestibulum at eros.
			</p>
			<p>Cras mattis consectetur purus sit amet fermentum. Cras justo
				odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
				risus, porta ac consectetur ac, vestibulum at eros.
			</p>
			<p>Cras mattis consectetur purus sit amet fermentum. Cras justo
				odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
				risus, porta ac consectetur ac, vestibulum at eros.
			</p>
			<p>Cras mattis consectetur purus sit amet fermentum. Cras justo
				odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
				risus, porta ac consectetur ac, vestibulum at eros.
			</p>
			<p>Cras mattis consectetur purus sit amet fermentum. Cras justo
				odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
				risus, porta ac consectetur ac, vestibulum at eros.
			</p>
			<p>Cras mattis consectetur purus sit amet fermentum. Cras justo
				odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
				risus, porta ac consectetur ac, vestibulum at eros.
			</p>
			<p>Cras mattis consectetur purus sit amet fermentum. Cras justo
				odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
				risus, porta ac consectetur ac, vestibulum at eros.
			</p>
			<p>Cras mattis consectetur purus sit amet fermentum. Cras justo
				odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
				risus, porta ac consectetur ac, vestibulum at eros.
			</p>
			<p>Cras mattis consectetur purus sit amet fermentum. Cras justo
				odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
				risus, porta ac consectetur ac, vestibulum at eros.
			</p>
			<p>Cras mattis consectetur purus sit amet fermentum. Cras justo
				odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
				risus, porta ac consectetur ac, vestibulum at eros.
			</p>
			<p>Cras mattis consectetur purus sit amet fermentum. Cras justo
				odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
				risus, porta ac consectetur ac, vestibulum at eros.
			</p>
			<p>Cras mattis consectetur purus sit amet fermentum. Cras justo
				odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
				risus, porta ac consectetur ac, vestibulum at eros.
			</p>
			<p>Cras mattis consectetur purus sit amet fermentum. Cras justo
				odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
				risus, porta ac consectetur ac, vestibulum at eros.
			</p>
			<p>Cras mattis consectetur purus sit amet fermentum. Cras justo
				odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
				risus, porta ac consectetur ac, vestibulum at eros.
			</p>

			<div class="row mb-3">
				<div class="col-12">
					<div class="custom-control custom-checkbox text-center">
						<input id="terms" type="checkbox" v-model="terms"
						class="custom-control-input"/>
						<label class="custom-control-label" for="terms">
							Eu concordo com os termos e condições
						</label>
					</div>
				</div>
			</div>
			<template v-slot:modal-footer>
				<b-button variant="outline-success" :disabled="!terms" @click.prevent="saveClient()">Finalizar</b-button>
			</template>
		</b-modal>
	</Layout>
</template>
