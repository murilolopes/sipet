<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

import appConfig from '@manager-src/app.config'
import Layout from '@manager-layouts/main'

import StatChart from '@manager-components/widget-stat-chart'
import Overview from '@manager-components/overview'
import Member from '@manager-components/member'
import Task from '@manager-components/task'
import Chat from '@manager-components/chat'

import {
	revenueAreaChart,
	targetsBarChart,
	salesDonutChart,
	ordersData,
} from './data'

export default {
	page: {
		title: 'Dashboard',
		meta: [{ name: 'description', content: appConfig.description }],
	},
	components: {
		VuePerfectScrollbar,
		Layout,
		StatChart,
		Overview,
		Member,
		Task,
		Chat,
	},
	data() {
		return {
			revenueAreaChart: revenueAreaChart,
			targetsBarChart: targetsBarChart,
			salesDonutChart: salesDonutChart,
			ordersData: ordersData,

			maxHeight: '328px',
			overviewData: [
				{
					class: 'border-bottom py-4',
					icon: 'users',
					value: '12.000',
					title: 'Total de visitantes',
				},
				{
					class: 'border-bottom py-4',
					icon: 'box',
					value: '2.370',
					title: 'Total de produtos visualizados',
				},
				{
					class: 'py-4',
					icon: 'shopping-bag',
					value: 'R$ 210,50',
					title: 'Ticket médio'
				}
			],
			statChart: [
				{
					mainTitle: 'Receita',
					value: 'R$ 2.100',
					subValue: '10.21%',
					chartColor: '#5369f8',
				},
				{
					mainTitle: 'Produtos Vendidos',
					value: '1065',
					subValue: '5.05%',
					chartColor: '#f77e53',
				},
				{
					mainTitle: 'Novos Clientes',
					value: '11',
					subValue: '25.16%',
					chartColor: '#43d39e',
				},
				{
					mainTitle: 'Proximo repasse',
					value: 'R$ 750',
					subValue: '5.05%',
					chartColor: '#ffbe0b',
				},
			],
			dateConfig: {
				mode: 'range',
			},
			selectedDate: [new Date().setDate(new Date().getDate() - 7), new Date()],
		}
	},
}
</script>

<template>
	<Layout>
		<div class="row page-title align-items-center">
			<div class="col-sm-4 col-xl-6">
				<h4 class="mb-1 mt-0">Dashboard</h4>
			</div>
			<div class="col-sm-8 col-xl-6">
				<form class="form-inline float-sm-right mt-3 mt-sm-0">
					<div class="form-group mb-sm-0 mr-2">
						<flat-pickr
							v-model="selectedDate"
							class="form-control"
							:config="dateConfig"
							name="date"
						></flat-pickr>
					</div>
					<div class="btn-group">
						<b-dropdown variant="primary" right>
							<template v-slot:button-content>
								<i class="uil uil-file-alt mr-1"></i>Download
								<i class="icon">
									<feather type="chevron-down" class="align-middle"></feather>
								</i>
							</template>
							<b-dropdown-item href="#" class="notify-item">
								<feather
									type="mail"
									class="icon-dual icon-xs mr-2 align-middle"
								></feather>
								<span>Email</span>
							</b-dropdown-item>
							<b-dropdown-item href="#" class="notify-item">
								<feather
									type="printer"
									class="icon-dual icon-xs mr-2 align-middle"
								></feather>
								<span>Print</span>
							</b-dropdown-item>
							<b-dropdown-divider></b-dropdown-divider>
							<b-dropdown-item href="#" class="notify-item">
								<feather
									type="file"
									class="icon-dual icon-xs mr-2 align-middle"
								></feather>
								<span>Re-Generate</span>
							</b-dropdown-item>
						</b-dropdown>
					</div>
				</form>
			</div>
		</div>

		<div class="row">
			<div v-for="stat of statChart" :key="stat.mainTitle" class="col-md-6 col-xl-3">
				<StatChart :main-title="stat.mainTitle" :value="stat.value" 
					:sub-value="stat.subValue" :chart-color="stat.chartColor" />
			</div>
		</div>

		<div class="row">
			<div class="col-xl-3">
				<Overview :items="overviewData" />
			</div>

			<div class="col-xl-6">
				<div class="card">
					<div class="card-body pb-0">
						<ul class="nav card-nav float-right">
							<li class="nav-item">
								<a class="nav-link text-muted" href="javascript: void(0);">Hoje</a>
							</li>
							<li class="nav-item">
								<a class="nav-link text-muted" href="javascript: void(0);">7d</a>
							</li>
							<li class="nav-item">
								<a class="nav-link active" href="javascript: void(0);">15d</a>
							</li>
							<li class="nav-item">
								<a class="nav-link text-muted" href="javascript: void(0);">1m</a>
							</li>
							<li class="nav-item">
								<a class="nav-link text-muted" href="javascript: void(0);">1y</a>
							</li>
						</ul>
						<h5 class="card-title mb-0 header-title">Receita</h5>
						<apexchart
							type="area"
							height="296"
							:series="revenueAreaChart.series"
							:options="revenueAreaChart.chartOptions"
						></apexchart>
					</div>
				</div>
			</div>

			<div class="col-xl-3">
				<div class="card">
					<div class="card-body pb-0">
						<h5 class="card-title header-title">Objetivo</h5>
						<div class="mt-3">
							<apexchart
								type="bar"
								height="282"
								:series="targetsBarChart.series"
								:options="targetsBarChart.chartOptions"
							></apexchart>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-xl-5">
				<div class="card">
					<div class="card-body">
						<h5 class="card-title mt-0 pb-2 header-title">Vendas de produtos por categorias</h5>
						<apexchart type="donut" height="304" :series="salesDonutChart.series"
							:options="salesDonutChart.chartOptions">
						</apexchart>
					</div>
				</div>
			</div>
			<div class="col-xl-7">
				<div class="card">
					<div class="card-body">
						<h5 class="card-title mt-0 mb-0 header-title">Ultimos pedidos</h5>
						<div class="table-responsive mt-4 mb-0">
							<b-table-simple class="table table-hover table-nowrap mb-0">
								<b-thead class="thead-white">
									<b-tr>
										<b-th>#</b-th>
										<b-th>Produto</b-th>
										<b-th>Cliente</b-th>
										<b-th>Preço</b-th>
										<b-th>Status</b-th>
									</b-tr>
								</b-thead>
								<b-tbody>
									<b-tr v-for="order in ordersData" :key="order.name">
										<b-td>{{ order.id }}</b-td>
										<b-td>{{ order.product }}</b-td>
										<b-td>{{ order.name }}</b-td>
										<b-td>{{ order.price }}</b-td>
										<b-td>
											<span
												class="badge"
												:class="{
													'badge-soft-warning': `${order.status}` === 'Pendente',
													'badge-soft-success':
														`${order.status}` === 'Entregue',
													'badge-soft-danger': `${order.status}` === 'Rejeitado',
												}"
												>{{ order.status }}</span
											>
										</b-td>
									</b-tr>
								</b-tbody>
							</b-table-simple>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Layout>
</template>
