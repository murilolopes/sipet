<script>
import Layout from '@manager-layouts/default'
import { authMethods } from '@manager-state/helpers'
import appConfig from '@manager-src/app.config'
import InputText from "@components/inputs/text";

export default {
	page: {
		title: 'Entrar',
		meta: [{ name: 'description', content: `Entrar em ${appConfig.title}` }],
	},
	components: { Layout },
	data() {
		return {
			email: 'muriloangelo10@gmail.com',
			password: '123123123',
			authError: null,
			loading: false,
			isAuthError: false,
		}
	},
	methods: {
		...authMethods,
		tryToLogIn() {
			this.loading = true
			this.authError = null
			return this.logIn({
				email: this.email,
				password: this.password,
			})
				.then((token) => {
					this.isAuthError = false
					this.$router.push(
						this.$route.query.redirectFrom || { name: 'Dashboard' }
					)
				})
				.catch((error) => {
					this.authError = 'Email ou senha inválidos. Tente novamente!'
					this.isAuthError = true
					this.loading = false
				})
		},
	},
}
</script>

<template>
	<Layout>
		<div class="account-pages my-5">
			<div class="container">
				<div class="row justify-content-center">
					<div class="col-xl-5">
						<div class="card">
							<div class="card-body p-0">
								<div class="row">
									<div class="col-md-12 p-5">
										<div class="mx-auto mb-5">
											<a routerLink="/">
												<img src="@assets/images/logo.png" alt height="24" />
												<h3 class="d-inline align-middle ml-1 text-logo">SiPet</h3>
											</a>
										</div>

										<h6 class="h5 mb-0">Bem Vindo!</h6>
										<p class="text-muted mt-1">
											Digite seu email e senha para acessar o painel administrativo.
										</p>

										<b-alert v-model="isAuthError" variant="danger" dismissible>{{ authError }}</b-alert>

										<b-form class="authentication-form" @submit.prevent="tryToLogIn">
											<div class="form-group">
												<label class="form-control-label">Email</label>
												<div class="input-group input-group-merge">
													<div class="input-group-prepend">
														<span class="input-group-text">
															<feather type="mail" class="align-middle icon-dual"></feather>
														</span>
													</div>
													<b-form-input id="input-1" v-model="email" type="text" required placeholder="Enter email"></b-form-input>
												</div>
											</div>
											<div class="form-group mt-4">
												<label class="form-control-label">Senha</label>
												<router-link to="forget-password" class="float-right text-muted text-unline-dashed ml-1">
													Esqueceu sua senha?
												</router-link>
												<div class="input-group input-group-merge">
													<div class="input-group-prepend">
														<span class="input-group-text">
															<feather type="lock" class="align-middle icon-dual"></feather>
														</span>
													</div>
													<b-form-input id="password" v-model="password" type="password" required></b-form-input>
												</div>
											</div>
											<b-form-group id="button-group" class="mt-4 mb-1">
												<b-button :disabled="loading" type="submit" variant="primary" class="btn-block">
													{{ loading ? 'Entrando...'  : 'Entrar'}}
												</b-button>
											</b-form-group>
										</b-form>
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
