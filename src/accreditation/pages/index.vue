<script>
import { required } from 'vuelidate/lib/validators'
import { FormWizard, TabContent } from 'vue-form-wizard'

import appConfig from '@accreditation-src/app.config'
import Layout from '@accreditation-layouts/main'
import PageHeader from '@accreditation-components/page-header'

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
			cardOptions: {}
		}
	},
	validations: {},
	mounted() {},
	computed: {},
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
						appsd
					</div>
				</div>
			</div>
		</div>
	</Layout>
</template>
