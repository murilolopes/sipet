<script>
import { required, minLength, email, sameAs } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";

export default {
  components: {
    Multiselect
  },
  data() {
    return {};
  },
  mounted() {},
  validations: {},
  methods: {
    validate() {
      // this.$v.client.$touch()
      // var isValid = !this.$v.client.$invalid
      this.$emit("on-validate", {}, true);
      return true;
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
            <strong>Nome:</strong> {{ $attrs.accreditation.name }} <strong>Nascimento:</strong> {{ $attrs.accreditation.name }}<br>
            <strong>CPF:</strong> {{ $attrs.accreditation.cpf }}<br>
            <!-- <strong>Email:</strong> {{ $attrs.accreditation.credential_attributes.email }} -->
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="card">
          <div class="card-body">
            <strong>Nome Fantasia:</strong> {{ $attrs.accreditation.name }}<br>
            <strong>CNPJ:</strong> {{ $attrs.accreditation.cpf }}<br>
            <!-- <strong>Telefone para contato:</strong> {{ $attrs.accreditation.credential_attributes.email }} -->
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            informações de servicos prestados pelo estabelecimento
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
