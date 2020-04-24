<script>
import appConfig from '@manager-src/app.config'
import Layout from '@manager-layouts/main'
import PageHeader from '@manager-components/page-header'

import UserCard from './user-card'
import FormPerson from './form_person'
import FormEstablishment from './form_establishment'
import FormBankAccount from './form_bank_account'

import { authComputed } from '@manager-state/helpers'

export default {
	page: {
		title: 'Minha conta',
		meta: [{ name: 'description', content: appConfig.description }],
	},
	components: {
		Layout,
		PageHeader,
		UserCard,
		FormPerson,
		FormEstablishment,
		FormBankAccount,
	},
	data() {
		return {
			title: 'Minha conta',
			items: [
				{
					text: 'Dashboard',
					href: '/',
				},
				{
					text: 'Minha conta',
					active: true,
				},
			],
		}
	},
	computed: {
		...authComputed
	}
}
</script>

<template>
	<Layout>
		<PageHeader :title="title" :items="items" />
		<div class="row">
			<div class="col-lg-3">
				<UserCard />
			</div>

			<div class="col-lg-9">
				<div class="card">
					<div class="card-body">
						<b-tabs class="navtab-bg" pills justified>
							<b-tab title="Dados Pessoais" active>
								<FormPerson />
							</b-tab>
							<b-tab title="Estabelecimento">
								<FormEstablishment />
							</b-tab>
							<b-tab title="Conta Bancária">
								<FormBankAccount />
							</b-tab>
						</b-tabs>
					</div>
				</div>
			</div>
		</div>
	</Layout>
</template>
