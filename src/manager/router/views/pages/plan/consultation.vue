<script>
import appConfig from '@manager-src/app.config'
import Layout from '@manager-layouts/main'
import PageHeader from '@manager-components/page-header'
import Multiselect from 'vue-multiselect'
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'

import { personMethods, categoryMethods, consultationMethods } from '@manager-state/helpers'

export default {
  page: {
    title: 'Consulta',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader, Multiselect },
  data() {
    return {
      isLoading: false,
      qtd: 0,
      consultation: {
        vet: '',
        complaint: '',
        consult_type: '',
        observations: ''
      },
      services: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      client: {
        name: '',
        id: '',
        pets: []
      },
      pet: {},
      categories: [],
      clients: [],
      states: ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 
        'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
      ],
      consult_types: [
        { key: 'elective_consultation', label: 'Consulta Eletiva' },
        { key: 'emergency_consultation', label: 'Consulta Emergêncial' },
        { key: 'internment', label: 'Internamento' },
        { key: 'vaccine', label: 'Vacina' },
      ],
      vets: [
        { id: 1, name: 'Edi' },
        { id: 2, name: 'Lehi' },
        { id: 3, name: 'Murilo' },
      ],
      title: 'Nova Consulta',
      items: [
        {
          text: 'Dashboard',
          href: '/',
        },
        {
          text: 'Consulta',
          active: true,
        },
      ],
    }
  },
  created() {
    this.fetchCategories().then(resp => this.categories = resp.data)
  },
  computed: {
    showPets () {
      return !!(this.client && this.client.pets.length && !this.pet.id)
    },
    availableCategories () {
      let arr = []

      this.categories.filter(c => {
        arr.push({
          ...c,
          services: this.servicesByCategory(c),
          need_days: this.calcNeedDays(c)
        })
      })

      return arr
    }
  },
  methods: {
    ...personMethods,
    ...categoryMethods,
    ...consultationMethods,
    calcNeedDays(category) {
      let need_days = category.need - moment().diff(this.pet.accession_date, 'days')
      return need_days < 0 ? 0 : need_days
    },
    truncateString(str, num) {
      return str.length <= num ? str : str.slice(0, num) + '...'
    },
    servicesByCategory(category){
      return this.pet.services.filter(service => {
        if (service.category_id == category.id) {
          service.name = this.truncateString(service.name, 25)
          return service 
        }
      })
    },    
    asyncFind(query) {
      if (query.length > -1) {
        this.isLoading = true
        this.search(query).then(response => {
          this.clients = response.data
          this.isLoading = false
        })
      }
    },
    onSelect(item) {
      this.getPersonInfo(item.id).then(response => this.client = response.data)
    },
    minus(service_id) {
      let count = this.services[service_id]
      count = count - 1
      if (count <= 0) count = 0

      this.$set(this.services, service_id, count)
    },
    plus(service_id) {
      let count = this.services[service_id]
      count = count + 1

      this.$set(this.services, service_id, count)
    },
    selectPet (index) {
      if (this.client.pets.length == 1 && index) index = 1
      this.pet = this.client.pets[index]
    },
    save() {
      let services = []
      Object.keys(this.services).filter(key => {
        if(this.services[key] > 0) services.push({ service_id: key, quantity: this.services[key]})
      })
      const payload = {
        ...this.consultation,
        services,
        pet_id: this.pet.id,
        establishment_id: this.pet.id,
        person_id: this.$attrs.user.person.id,
        establishment_id: this.$attrs.user.person.establishment.id,
      }
      this.createConsultation(payload)
    },
    resetConsultation () {
      this.consultation = {
        vet: '',
        complaint: '',
        consult_type: '',
        observations: '',
      }
      this.services = []
      this.client = {
        name: '',
        id: '',
        pets: []
      }
      this.pet = {}
    },
    autoSelectPet (client, old) {
      if (old.id && client.id != old.id && this.pet.id) {
        this.resetConsultation()
        this.client = client
      }
      if (client.pets.length == 1) this.pet = this.client.pets[0]
    }
  },
  watch: {
    client: 'autoSelectPet'
  },
  validations: {
    consultation: {
      vet: { required },
      complaint: { required },
      consult_type: { required },
      observations: { required },
    }
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
            <div class="row align-items-center">
              <div class="col-xl-12 col-lg-12">
                <multiselect v-model="client" selectLabel="" placeholder="" :hide-selected="true"
                  selectedLabel="Selecionado" deselectLabel="Remover" :searchable="true"
                  selectLabel="Precione enter para selecionar" @select="onSelect"
                  :options="clients" track-by="id" label="name" @search-change="asyncFind"
                  placeholder="Busque um cliente por nome, email, telefone ou CPF:" :loading="isLoading">
                  <template slot="noOptions" slot-scope="props">Lista vazia</template>
                  <template slot="noResult" slot-scope="props">Registro não encontrado</template>
                  <template slot="option" slot-scope="props">
                    <div class="option__desc" style="line-height: 1.3;">
                      <span class="option__title">
                        <strong>Nome:</strong> {{ props.option.name }} - {{ props.option.cpf }}
                      </span><br>
                      <span class="option__small">
                        <strong>Contato</strong> {{ props.option.email }} / {{ props.option.phone }}
                      </span><br>
                      <span class="option__small">
                        <strong>Quantidade de pets:</strong> {{ props.option.pets }}
                      </span>
                    </div>
                  </template>
                </multiselect>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-3" v-if="showPets" v-for="(pet, index) in client.pets">
        <div class="card card-selectable" @click="selectPet(index)">
          <div class="card-body pb-0">
            <div class="text-center mt-3">
              <img src="@assets/images/users/avatar-7.jpg" alt class="avatar-xl rounded-circle"/>
              <h5 class="mt-2 mb-0">{{ pet.name }}</h5>
              <div class="mt-4 pt-3 border-top text-left">
                <p class="text-muted mb-2">
                  Hi I'm Shreyu. I am user experience and user interface designer. I
                  have been working on UI & UX since last 10 years.
                </p>

                <p class="mb-2">
                  <label class="badge badge-soft-success">Consulta</label>
                  <label class="badge badge-soft-success ml-1">Exames Laboratoriais</label>
                  <label class="badge badge-soft-dark ml-1">Exames De Imagem</label>
                  <label class="badge badge-soft-dark ml-1">Cirurgia</label>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-3" v-if="pet.id">
        <div class="card">
          <div class="card-body pb-0">
            <div class="text-center mt-3">
              <img src="@assets/images/users/avatar-7.jpg" alt class="avatar-xl rounded-circle"/>
              <h5 class="mt-2 mb-0">{{ pet.name }}</h5>
              <div class="mt-4 pt-3 border-top text-left">
                <p class="text-muted mb-2">
                  Hi I'm Shreyu. I am user experience and user interface designer. I
                  have been working on UI & UX since last 10 years.
                </p>

                <p class="mb-2">
                  <label class="badge mr-1" :class="{'badge-soft-success': category.need_days <= 0, 
                    'badge-soft-dark': category.need_days > 0}" v-for="category in availableCategories">
                    {{ category.name }}
                  </label>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-9" v-if="pet.id">
        <div class="card">
          <div class="card-body">
            <h4 class="mb-1 header-title mt-0">Informações Médicas</h4>
            <div class="row">
              <div class="col-12 col-md-6">
                <b-form-group :class="{ 'has-error': $v.consultation.consult_type.$error }" >
                  <label> Tipo de consulta <span class="text-danger">*</span> </label>
                  <multiselect v-model="consultation.consult_type" :class="{ 'is-invalid': $v.consultation.consult_type.$error }"
                    selectLabel="" placeholder="" selectedLabel="Selecionado" deselectLabel="Remover"
                    :options="consult_types" label="label"></multiselect>
                  <div v-if="$v.consultation.consult_type.$error" class="invalid-feedback">
                    <span v-if="!$v.consultation.consult_type.required">Este campo é obrigatório.</span>
                  </div>
                </b-form-group>
              </div>
              <div class="col-12 col-md-6">
                <b-form-group :class="{ 'has-error': $v.consultation.vet.$error }" >
                  <label> Veterinário <span class="text-danger">*</span> </label>
                  <multiselect v-model="consultation.vet" :class="{ 'is-invalid': $v.consultation.vet.$error }"
                    selectLabel="" placeholder="" selectedLabel="Selecionado" deselectLabel="Remover"
                    :options="vets" track-by="id" label="name"></multiselect>
                  <div v-if="$v.consultation.vet.$error" class="invalid-feedback">
                    <span v-if="!$v.consultation.vet.required">Este campo é obrigatório.</span>
                  </div>
                </b-form-group>
              </div>
              <div class="col-12">
                <b-form-group :class="{ 'has-error': $v.consultation.complaint.$error }" >
                  <label> Queixa do cliente <span class="text-danger">*</span> </label>
                  <b-form-textarea id="example-textarea" size="lg" rows="2" v-model="consultation.complaint"></b-form-textarea>
                  <div v-if="$v.consultation.complaint.$error" class="invalid-feedback">
                    <span v-if="!$v.consultation.complaint.required">Este campo é obrigatório.</span>
                  </div>
                </b-form-group>
              </div>
              <div class="col-12">
                <b-form-group :class="{ 'has-error': $v.consultation.observations.$error }" >
                  <label> Observações <span class="text-danger">*</span> </label>
                  <b-form-textarea id="example-textarea" size="lg" rows="2" v-model="consultation.observations"></b-form-textarea>
                  <div v-if="$v.consultation.observations.$error" class="invalid-feedback">
                    <span v-if="!$v.consultation.observations.required">Este campo é obrigatório.</span>
                  </div>
                </b-form-group>
              </div>
              <div class="col-12 text-right">
                <b-button class="mr-1" slot="next" variant="outline-primary" @click.prevent="resetConsultation()"> 
                  Limpar
                </b-button>
                <b-button slot="next" variant="outline-primary" @click.prevent="save()"> 
                  Salvar consulta
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-if="consultation.consult_type">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <b-tabs class="navtab-bg" pills justified>
              <div v-for="category in availableCategories">
                <b-tab :title="category.name">
                  <template slot="title"> 
                    {{ category.name }}
                    <b-badge pill variant="primary" v-if="category.need_days">
                      em {{ category.need_days == 1 ? `${category.need_days} dia` : `${category.need_days} dias` }}
                    </b-badge>
                  </template>
                  <div class="row">
                    <div class="col-2 text-center" v-for="service in category.services">
                      <span class="text-muted text-uppercase font-size-12 font-weight-bold"> {{ service.name }} </span>
                      <div class="input-group bootstrap-touchspin bootstrap-touchspin-injected mb-2">
                        <span class="input-group-btn input-group-prepend">
                          <button class="btn btn-primary bootstrap-touchspin-down" 
                            type="button" @click="minus(service.id)" :disabled="category.need_days > 0">-</button>
                        </span>
                        <input data-toggle="touchspin" type="text" v-model="services[service.id]" class="form-control text-center" disabled="true" >
                        <span class="input-group-btn input-group-append">
                          <button class="btn btn-primary bootstrap-touchspin-up" ty
                            pe="button" @click="plus(service.id)" :disabled="category.need_days > 0">+</button>
                        </span>
                      </div>
                    </div>
                  </div>
                </b-tab>
              </div>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
<style>
  .card-selectable:hover {
    border: solid 1px purple;
  }
</style>