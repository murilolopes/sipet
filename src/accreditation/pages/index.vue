<script>
import { required } from 'vuelidate/lib/validators'
import { FormWizard, TabContent } from 'vue-form-wizard'

import appConfig from '@accreditation-src/app.config'
import Layout from '@layouts/wizard/main'
import PageHeader from '@components/page-header'

import Step1 from './step1'

export default {
	page: {
		title: 'Assine',
		meta: [{ name: 'description', content: appConfig.description }],
	},
	components: { Layout, PageHeader, FormWizard, TabContent, Step1 },
	data() {
		return {}
	},
	validations: {}, 
	mounted() {},
	computed: {
		title() {
			// let index = this.$refs.acreditationWizard.activeTabIndex
			let index = 0
			let titles = ['Informações pessoais', 'Informações sobre endereço', 'Cobertura', 'Finalização'] 
			return titles[index]
		}
	},
	methods: {},
}
</script>

<template>
	<Layout>
		<PageHeader :title="title" class="text-center"/>
		<div class="row">
			<div class="col-12">
				<div class="card">
					<div class="card-body">
						<form-wizard ref="acreditationWizard" color="#5369f8" error-color="#ff5c75" 
							nextButtonText="Proximo" backButtonText="Voltar" finishButtonText="Finalizar">
							<tab-content title="asd">
								<Step1 ref="step1"/>
							</tab-content>							
							<b-button slot="prev" variant="outline-dark" >Voltar</b-button>
							<b-button slot="next" variant="outline-primary"> Proximo </b-button>
							<b-button slot="finish" variant="outline-success">
								Finalizar
							</b-button>
						</form-wizard>
					</div>
				</div>
			</div>
		</div>
	</Layout>
</template>
