<script>
import { required, minLength } from 'vuelidate/lib/validators'

import Multiselect from 'vue-multiselect'

export default {
  components: {
    Multiselect
  },
  data() {
    return {
      pet: {
        name: '',
        species: '',
        breed: '',
        gender: '',
        birthdate: '',
        weight: '',
        color: '',
        pedigree: true,
        categories: [],
      },
      genders: [
        {value: '0', label: 'Macho'},
        {value: '1', label: 'Fêmea'},
      ],
      species: [
        {value: '0', label: 'Canino'},
        {value: '1', label: 'Felino'},
        {value: '2', label: 'Outros'},
      ],
      pets: [],
      breeds: [],
      categories: [],
      colors: ["Chocolate", "Branco", "Preto", "Cinzento", "Dourado", "Creme", 
        "Azul", "Vermelho", "Fulvo", "Castanho", "Amarelo", "Caramarelo"]
    }
  },
  validations: {
    pet: {
      name: { required },
      species: { required },
      breed: { required },
      gender: { required },
      birthdate: { 
        required, 
        minLength: minLength(10),
        date: async (value) => { 
          if (value.length == 10) return moment(value, 'DD/MM/YYYY', true).isValid()
          return true
        }
     },
      weight: { required },
      color: { required },
      categories: { required, minLength: minLength(3) },
    }
  }, 
  mounted() {
    this.$api.get('pets_breeds').then(resp => this.breeds = resp.data )
    this.$api.get('categories').then(resp => this.categories = resp.data )
  },
  computed: {
    filtered_breeds() {
      if (!this.pet.species) return []
      this.pet.breed = null
      return this.breeds[(this.pet.species.value == 0 ? 'dog' : 'cat') + '_breeds']
    },
  },
  methods: {
    numberParaReal(value){
      let formated = "R$ " + (value/100).toFixed(2).replace(".",",");
      return formated;
    },
    addPet() {
      this.pets.push(this.pet)
      this.pet = {
        name: '',
        species: '',
        breed: '',
        gender: '',
        birthdate: '',
        weight: '',
        color: '',
        pedigree: '',
        categories: [],
      }
    },
    deletePet(index) {
      this.pets.splice(index, 1)
    },
    editPet(index) {
      let pet = this.pets.splice(index, 1)[0]
      this.pet = pet
    },
    getCategoryName(category) {
      return this.categories.filter(c => c.id == category)[0].name
    },
    pet_specie(pet) {
      return this.species.filter(specie => specie.value == pet.species.value)[0].label
    },
    pet_gender(pet) {
      return this.genders.filter(gender => gender.value == pet.gender.value)[0].label
    },
    validate() {
      this.$v.pet.$touch()
      var isValid = !this.$v.pet.$invalid || (this.$v.pet.$invalid && !!this.pets.length)
      if (!this.$v.pet.$invalid) this.addPet()
      
      this.$emit('on-validate', { pets: this.pets }, isValid)
      return isValid
    },
  },
}
</script>

<template>
  <div>
    <div class="row">
      <div class="col-12 col-md-6">
        <b-form-group label-for="name" :class="{ 'has-error': $v.pet.name.$error }">
          <label> Nome <span class="text-danger">*</span> </label>
          <b-form-input id="petName" v-model="pet.name" 
            :class="{ 'is-invalid': $v.pet.name.$error }">
          </b-form-input>
          <span v-if="$v.pet.name.$error && !$v.pet.name.required"
            class="help-block invalid-feedback">
            Este campo é obrigatório
          </span>
        </b-form-group>
      </div>
      <div class="col-12 col-md-6">
          <b-form-group label-for="species" :class="{ 'has-error': $v.pet.species.$error }">
            <label> Espécie <span class="text-danger">*</span> </label>
            <multiselect track-by="label" label="label" v-model="pet.species" 
              :class="{ 'is-invalid': $v.pet.species.$error }" :options="species"
              selectLabel="" placeholder="" selectedLabel="Selecionado" deselectLabel="Remover">
            </multiselect>
            <div v-if="$v.pet.species.$error" class="invalid-feedback">
              <span v-if="!$v.pet.species.required">Este campo é obrigatório.</span>
            </div>
          </b-form-group>
        </div>
      <div class="col-12 col-md-6">
        <b-form-group label-for="breed":class="{ 'has-error': $v.pet.breed.$error }">
          <label> Raça <span class="text-danger">*</span> </label>
          <multiselect v-model="pet.breed" :options="filtered_breeds"
            :class="{ 'is-invalid': $v.pet.breed.$error }"
            selectLabel="" placeholder="" selectedLabel="Selecionado" deselectLabel="Remover">
            <span slot="noOptions">Selecione uma Espécie</span>
          </multiselect>
          <div v-if="$v.pet.breed.$error" class="invalid-feedback">
            <span v-if="!$v.pet.breed.required">
              Esse campo é obrigatório.
            </span>
          </div>
        </b-form-group>
      </div>
      <div class="col-12 col-md-6">
        <b-form-group label-for="genders" :class="{ 'has-error': $v.pet.gender.$error }">
          <label> Gênero <span class="text-danger">*</span> </label>
          <multiselect track-by="label" label="label" v-model="pet.gender" 
            :class="{ 'is-invalid': $v.pet.gender.$error }"
            selectLabel="" placeholder="" selectedLabel="Selecionado" deselectLabel="Remover"
            :options="genders"></multiselect>
          <div v-if="$v.pet.gender.$error" class="invalid-feedback">
            <span v-if="!$v.pet.gender.required">
              Esse campo é obrigatório.
            </span>
          </div>
        </b-form-group>
      </div>
      <div class="col-6 col-md-3">
        <b-form-group label-for="birthdate" :class="{ 'has-error': $v.pet.birthdate.$error }">
          <label> Nascimento <span class="text-danger">*</span> </label>
          <input class="form-control" v-mask="'##/##/####'" id="petBirthdate" 
            type="tel" v-model="pet.birthdate" 
            :class="{ 'is-invalid': $v.pet.birthdate.$error }">
          </input>
          <div v-if="$v.pet.birthdate.$error" class="invalid-feedback">
            <span v-if="!$v.pet.birthdate.required || !$v.pet.birthdate.minLength">Este campo é obrigatório. </span>
            <span v-if="!$v.pet.birthdate.date">Data inválida. </span>
          </div>
        </b-form-group>
      </div>
      <div class="col-6 col-md-3">
        <b-form-group label-for="weight" :class="{ 'has-error': $v.pet.weight.$error }">
          <label> Peso <span class="text-danger">*</span> </label>
          <the-mask class="form-control" :mask="['##.# Kg', '#.# Kg', '.# Kg']" id="weight" 
            type="tel" v-model="pet.weight" 
            :class="{ 'is-invalid': $v.pet.weight.$error }">
          </the-mask>
          <span v-if="$v.pet.weight.$error && !$v.pet.weight.required"
            class="help-block invalid-feedback">
            Este campo é obrigatório
          </span>
        </b-form-group>
      </div>
      <div class="col-6 col-md-3">
        <b-form-group label-for="colors" :class="{ 'has-error': $v.pet.color.$error }">
          <label> Cor <span class="text-danger">*</span> </label>
          <multiselect v-model="pet.color" :options="colors"
            :class="{ 'is-invalid': $v.pet.color.$error }"
            selectLabel="" placeholder="" selectedLabel="Selecionado" deselectLabel="Remover">
          </multiselect>
          <div v-if="$v.pet.color.$error" class="invalid-feedback">
            <span v-if="!$v.pet.color.required">
              Esse campo é obrigatório.
            </span>
          </div>
        </b-form-group>
      </div>
      <div class="col-6 col-md-3">
        <b-form-group label-for="pedigree">
          <label> Possui Pedigree? </label>
          <b-form-checkbox v-model="pet.pedigree" name="check-button" switch>
            {{ pet.pedigree ? 'Sim' : 'Não'}}
          </b-form-checkbox>
        </b-form-group>
      </div>
      <div class="col-12">
        <b-form-group label-for="pedigree">
          <label> Monte seu plano escolhendo no mínimo 3 tipos de serviços</label>
          <div class="row">
            <div class="col-2" v-for="(category, index) in categories" :key="index">
              <b-form-group label-for="pedigree" :class="{ 'is-invalid': $v.pet.categories.$error }">
                <b-form-checkbox v-model="pet.categories" :value="category.id">{{ category.name }}</b-form-checkbox>
              </b-form-group>
            </div>
          </div>
        </b-form-group>
      </div>
    </div>
    <div class="row">
      <div class="col-12" align="center">
        <button @click.prevent="addPet()" class="btn btn-success" :disabled="$v.pet.$invalid">
          Adicionar outro pet
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-12" align="center">
        <div class="row">
          <div class="col-12 col-md-6 col-lg-3" style="margin-top: 15px;" v-for="(pet, index) in pets">
            <div class="card" align="center">
              <div class="card-body pb-0" style="border: 1px solid; border-color: #5369f8">
                <div class="text-center mt-3">
                  <img src="@assets/images/users/avatar-7.jpg" alt
                    class="avatar-xl rounded-circle"/>
                  <h5 class="mt-2 mb-0">{{ pet.name }}</h5>
                  <h6 class="text-muted font-weight-normal mt-2 mb-4">
                    <b-badge v-for="category in pet.categories" variant="primary" class="mr-1 mt-1">{{ getCategoryName(category) }}</b-badge>
                  </h6>

                  <button @click.prevent="editPet(index)" class="btn btn-primary btn-sm mr-1">Editar</button>
                  <button @click.prevent="deletePet(index)" class="btn btn-white btn-sm">Remover</button>

                  <div class="pt-3 text-left">
                    <p class="text-muted mb-4">
                      {{pet.name}}, é um {{pet_specie(pet)}} da raça {{pet.breed}}, {{pet_gender(pet)}}, nascido em
                      {{pet.birthdate}} pesando {{pet.weight}} kgs e de cor {{pet.color}}. {{pet.pedigree ? 'Possui Pedigree' : 'Não possui Pedigree'}}!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
