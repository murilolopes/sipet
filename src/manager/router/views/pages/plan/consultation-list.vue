<script>
import appConfig from '@manager-src/app.config'
import Layout from '@manager-layouts/main'
import PageHeader from '@manager-components/page-header'
import { consultationMethods, consultationGetters } from '@manager-state/helpers'
 
export default {
	page: {
		title: 'Consultas',
		meta: [{ name: 'consultas', content: appConfig.description }],
	},
	components: { Layout, PageHeader },
	data() {
		return {
			title: 'Consultas',
			items: [
				{
					text: 'Dashboard',
					href: '/',
				},
				{
					text: 'Consultas',
					active: true,
				},
			],
			currentPage: 1,
			perPage: 10,
			pageOptions: [10, 25, 50, 100],
			fields: [
				{ key: 'consult_type_text', label: 'Tipo da consulta', sortable: true },
				{ key: 'pet_name', label: 'Pet', sortable: true },
				{ key: 'client_name', label: 'Cliente', sortable: true },
				{ key: 'vet_name', label: 'Veterinário', sortable: true },
				{ key: 'created_at', label: 'Criado há', sortable: true },
			],
		}
	},
	computed: {
		...consultationGetters
	},
	mounted() {
		this.fetchConsultations()
	},
	methods: {
		...consultationMethods,
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
						<h4 class="header-title mt-0 mb-1">Consultas</h4>
						<p class="text-muted font-13 mb-4"></p>
						<div class="row mb-md-2">
							<div class="col-sm-12 col-md-6">
								<div id="tickets-table_length" class="dataTables_length">
									<label class="d-inline-flex align-items-center">
										Mostrar&nbsp;
										<b-form-select v-model="perPage" size="sm" :options="pageOptions"></b-form-select
										>&nbsp;registros
									</label>
								</div>
							</div>
						</div>
						<div class="table-responsive mb-0">
							<b-table :items="consultations" :fields="fields" responsive="sm" :per-page="perPage" :current-page="currentPage"></b-table>
						</div>
						<div class="row">
							<div class="col">
								<div class="dataTables_paginate paging_simple_numbers float-right">
									<ul class="pagination pagination-rounded mb-0">
										<b-pagination v-model="currentPage" :total-rows="1" :per-page="perPage"></b-pagination>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Layout>
</template>
