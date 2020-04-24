<template>
	<div class="card">
		<div class="card-body">
			<div class="text-center mt-3">
				<img src="@assets/images/users/avatar-7.jpg" alt class="avatar-lg rounded-circle"/>
				<h5 class="mt-2 mb-0">{{ currentUser.person.name }}</h5>
				<h6 class="text-muted font-weight-normal mt-2 mb-0">
					Administrador
				</h6>
				<h6 class="text-muted font-weight-normal mt-1 mb-4">
					{{ currentUser.person.city }}, {{ currentUser.person.state }}
				</h6>
			</div>
			<div class="mt-3 pt-2 border-top">
				<h4 class="mb-3 font-size-15">Informações de contato</h4>
				<div class="table-responsive">
					<table class="table table-borderless mb-0 text-muted">
						<tbody>
							<tr>
								<th scope="row">Email</th>
								<td>{{ currentUser.email }}</td>
							</tr>
							<tr>
								<th scope="row">Telefone</th>
								<td>{{ currentUser.person.phone }}</td>
							</tr>
							<tr>
								<th scope="row">Endereço</th>
								<td>
									{{ completeAddress }}
								</td>
							</tr>
							<tr>
								<th scope="row">CEP</th>
								<td>
									{{ currentUser.person.zipcode }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { authComputed } from '@manager-state/helpers'

export default {
	computed: {
		...authComputed,
		completeAddress () {
			let person = this.currentUser.person
			return `${person.address}, ${person.number}, ${person.neighborhood} - ${person.city}/${person.state}`
		}
	}
}
</script>