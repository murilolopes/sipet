<script>
import Layout from '@manager-layouts/default'
import { authMethods } from '@manager-state/helpers'
import appConfig from '@manager-src/app.config'
import { required, minLength, sameAs } from 'vuelidate/lib/validators'

export default {
	page: {
		title: 'Nova Senha',
		meta: [
			{ name: 'description', content: `Forget Password to ${appConfig.title}` },
		],
	},
	components: { Layout },
  validations: {
    password: {
      password: { required, minLength: minLength(8) },
      password_confirmation: { required, sameAsPassword: sameAs('password') },
    }
  },
	data() {
		return {
      password: {
        password: '',
        password_confirmation: ''
      },
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
      this.$v.password.$touch()
      if (this.$v.password.$invalid) return false;

      const { password, password_confirmation } = this.password
			this.tryingToReset = true
			this.error = null

			return this.passwordUpdate({
				headers: this.$route.query,
				password: password,
				password_confirmation: password_confirmation
			})
				.then((data) => {
					this.tryingToReset = false
					this.isResetError = false
					this.isSuccess = true
					this.successMessage = 'Senha alterada com sucesso, vamos te redirecionar para o login!'
					setTimeout(() => {
						this.$router.push({name: 'login'})
					}, 2500)
				})
				.catch((error) => {
					console.log(error)
					this.tryingToReset = false
					this.error = 'Erro, tente novamente!'
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
										<div class="mx-auto mb-4">
											<a href="/">
												<img src="@assets/images/logo.png" alt height="24" />
												<h3 class="d-inline align-middle ml-1 text-logo">
													SiPet
												</h3>
											</a>
										</div>

										<p class="text-muted">Formulário para atualizar senha.
										</p>
										<b-alert v-model="isResetError" variant="danger" dismissible>{{ error }}</b-alert>
										<b-alert v-model="isSuccess" variant="success" dismissible>{{ successMessage }}</b-alert>

										<form action="#"class="authentication-form" @submit.prevent="tryToReset">
											<div class="form-group">
												<label class="form-control-label">Nova Senha</label>
												<div class="input-group input-group-merge">
													<div class="input-group-prepend">
														<span class="input-group-text">
															<feather type="lock" class="align-middle icon-dual"></feather>
														</span>
													</div>
													<input id="password" v-model="password.password" type="password" class="form-control"
														:class="{ 'is-invalid': $v.password.password.$error }"/>
							            <div v-if="$v.password.password.$error" class="invalid-feedback">
							              <span v-if="!$v.password.password.required">
							                Esse campo é obrigatório.
							              </span>
							              <span v-if="!$v.password.password.minLength">
							                A senha deve ter {{ $v.password.password.$params.minLength.min }} caracteres.
							              </span>
							            </div>
												</div>
											</div>
											<div class="form-group">
												<label class="form-control-label">Confirmação Senha</label>
												<div class="input-group input-group-merge">
													<div class="input-group-prepend">
														<span class="input-group-text">
															<feather type="lock" class="align-middle icon-dual"></feather>
														</span>
													</div>
													<input id="password_confirmation" v-model="password.password_confirmation" 
														type="password" class="form-control" :class="{ 'is-invalid': $v.password.password_confirmation.$error }"/>
							            <div v-if="$v.password.password_confirmation.$error" class="invalid-feedback">
							              <span v-if="!$v.password.password_confirmation.required">
							                Esse campo é obrigatório.
							              </span>
							              <span v-if="!$v.password.password_confirmation.sameAsPassword">
							                A senha deve ser identica.
							              </span>
							            </div>
												</div>
											</div>

											<div class="form-group mb-0 text-center">
												<button class="btn btn-primary btn-block" type="submit">
													Enviar
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
