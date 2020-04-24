<script>
import Layout from '@manager-layouts/default'
import { authMethods } from '@manager-state/helpers'
import appConfig from '@manager-src/app.config'

export default {
	page: {
		title: 'Esqueci minha senha',
		meta: [
			{ name: 'description', content: `Forget Password to ${appConfig.title}` },
		],
	},
	components: { Layout },
	data() {
		return {
			email: '',
			error: null,
			tryingToReset: false,
			isResetError: false,
			isSuccess: false,
			successMessage: null,
		}
	},
	computed: {},
	methods: {
		...authMethods,
		tryToReset() {
			this.tryingToReset = true
			this.error = null

			return this.resetPassword({
				email: this.email,
				// config: 'client-config',
				// redirect_url: 'reset-password'
			})
				.then((data) => {
					this.tryingToReset = false
					this.isResetError = false
					this.isSuccess = true
					this.successMessage = 'Enviamos, deve chegar em instantes!'
					this.email = ''
				})
				.catch((error) => {
					this.tryingToReset = false
					this.error = 'Email não encontrado.'
					this.isResetError = true
					this.isSuccess = false
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
									<div class="col-12 p-5">
										<div class="mx-auto mb-5">
											<a href="/">
												<img src="@assets/images/logo.png" alt height="24" />
												<h3 class="d-inline align-middle ml-1 text-logo">
													SiPet
												</h3>
											</a>
										</div>

										<h6 class="h5 mb-0">Redefinir Senha</h6>
										<p class="text-muted mt-1">
											Digite seu email e te enviaremos as instruções para resetar sua senha.
										</p>

										<b-alert v-model="isResetError" variant="danger" dismissible>{{ error }}</b-alert>
										<b-alert v-model="isSuccess" variant="success" dismissible>{{ successMessage }}</b-alert>

										<form action="#"class="authentication-form" @submit.prevent="tryToReset">
											<div class="form-group">
												<label class="form-control-label">Email</label>
												<div class="input-group input-group-merge">
													<div class="input-group-prepend">
														<span class="input-group-text">
															<feather type="mail" class="icon-dual"></feather>
														</span>
													</div>
													<input id="email" v-model="email" type="email" required class="form-control" placeholder=""/>
												</div>
											</div>

											<div class="form-group mb-0 text-center">
												<button class="btn btn-primary btn-block" type="submit" :disabled="tryingToReset">
													{{ tryingToReset ? 'Enviando...' : 'Enviar'}}
												</button>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>

						<div class="row mt-3">
							<div class="col-12 text-center">
								<p class="text-muted">
									Voltar para
									<router-link tag="a" to="/login" class="text-primary font-weight-bold ml-1">Login</router-link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Layout>
</template>

<style lang="scss" module></style>
