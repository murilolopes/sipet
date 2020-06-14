<script>
import { required, minLength, email, sameAs } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";

export default {
  components: {
    Multiselect
  },
  data() {
    return {
      services: []
    };
  },
  mounted() {
    this.getCategories();
  },
  validations: {},
  methods: {
    validate() {
      // this.$v.client.$touch()
      // var isValid = !this.$v.client.$invalid
      this.$emit("on-validate", {}, true);
      return true;
    },
    getCategories() {
      this.$api("/categories").then(resp => {
        resp.data.filter(c => {
          c.services.filter(s => {
            this.services[s.id] = s;
          });
        });
      });
    },
    getServiceName(id) {
      return this.services[id].name;
    }
  },
  computed: {
    address() {
      let adr = this.$attrs.accreditation;
      return `${adr.address}, ${adr.number}, ${adr.neighborhood} - ${adr.city}/${adr.state}`;
    }
  }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col-6">
        <div class="card">
          <div class="card-body">
            <strong>Nome:</strong> {{ $attrs.accreditation.name }}<br />
            <strong>CPF:</strong> {{ $attrs.accreditation.cpf }}<br />
            <strong>Nascimento:</strong> {{ $attrs.accreditation.birthdate }}<br />
            <strong>Telefone para contato:</strong>{{ $attrs.accreditation.phone }}<br />
            <strong>Email:</strong>{{ $attrs.accreditation.credential_attributes.email }}<br>
            <span v-if="$attrs.accreditation.vet"><strong>CRMV:</strong> {{ $attrs.accreditation.crmv }}/{{ $attrs.accreditation.crmv_uf }}<br /></span>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="card">
          <div class="card-body">
            <strong>Nome Fantasia:</strong> {{ $attrs.accreditation.fantasy_name }}<br />
            <strong>CNPJ:</strong> {{ $attrs.accreditation.cnpj }}<br />
            <strong>Telefone para contato:</strong>{{ $attrs.accreditation.companyPhone }}<br />
            <strong>Endereço:</strong> {{ address }}<br />
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <strong>Porte(s) do estabelecimento:</strong><br />
            <ul id="list">
              <li id="list-item" v-for="item in $attrs.accreditation.categories">
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <strong>Serviços prestados:</strong><br />
            <ul id="list">
              <li id="list-item" v-for="id in $attrs.accreditation.selectedServices">
                {{ getServiceName(id) }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#list {
  display: inline-grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  width: 100%;
  list-style-type: none;
}

#list-item {
  display: inline-block;
}
</style>
