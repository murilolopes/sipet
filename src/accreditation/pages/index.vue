<script>
import { required } from 'vuelidate/lib/validators'
import { FormWizard, TabContent } from 'vue-form-wizard'

import appConfig from '@accreditation-src/app.config'
import Layout from '@layouts/wizard/main'
import PageHeader from '@components/page-header'

import Step1 from './step1'
import Step2 from './step2'
import Step3 from './step3'
import Step4 from './step4'

export default {
	page: {
		title: 'Assine',
		meta: [{ name: 'description', content: appConfig.description }],
	},
	components: { Layout, PageHeader, FormWizard, TabContent, Step1, Step2, Step3, Step4 },
	data() {
		return {
			finalObject: {},
			accreditationWizard: {
				activeTabIndex: 0
			},
		}
	},
	validations: {}, 
	mounted() {
		this.accreditationWizard = this.$refs.accreditationWizard
	},
	computed: {
		title() {
			return ['Informações pessoais', 'Informações sobre endereço', 'Cobertura', 'Finalização'][this.accreditationWizard.activeTabIndex]
		}
	},
	methods: {
		validateStep(name) {
			var refToValidate = this.$refs[name]
			return refToValidate.validate()
		},
		mergeFinalObject(model, isValid) {
			if (isValid) this.finalObject = Object.assign(this.finalObject, model)
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
						<form-wizard ref="accreditationWizard" color="#5369f8" error-color="#ff5c75" 
							nextButtonText="Proximo" backButtonText="Voltar" finishButtonText="Finalizar">
							<tab-content :before-change="() => validateStep('step1')">
								<Step1 ref="step1" @on-validate="mergeFinalObject"/>
							</tab-content>
							<tab-content :before-change="() => validateStep('step2')">
								<Step2 ref="step2" @on-validate="mergeFinalObject"/>
							</tab-content>
							<tab-content :before-change="() => validateStep('step3')">
								<Step3 ref="step3" @on-validate="mergeFinalObject"/>
							</tab-content>
							<tab-content :before-change="() => validateStep('step4')">
								<Step4 ref="step4" @on-validate="mergeFinalObject"/>
							</tab-content>

							<b-button slot="prev" variant="outline-dark">Voltar</b-button>
							<b-button slot="next" variant="outline-primary"> {{ accreditationWizard.activeTabIndex != 3 ? 'Proximo' : 'Revisar' }}</b-button>
							<b-button slot="finish" variant="outline-success"> Finalizar </b-button>
						</form-wizard>
					</div>
				</div>
			</div>
		</div>
	</Layout>
</template>
