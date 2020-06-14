<script>
import { required, minLength, email, sameAs } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";
import InputText from "@components/inputs/text";
import { EventBus } from "./../../plugins/event-bus.js";

export default {
  components: {
    Multiselect,
    InputText
  },
  data() {
    return {
      accredited: {
        accreditationType: 0,
        vet: false,
        name: "",
        cpf: "",
        birthdate: "",
        phone: "",
        crmv: "",
        crmv_uf: "",
        credential_attributes: {
          credential_type: "client",
          email: "",
          password: "",
          password_confirmation: ""
        }
      },
      states: [
        "AC",
        "AL",
        "AP",
        "AM",
        "BA",
        "CE",
        "DF",
        "ES",
        "GO",
        "MA",
        "MT",
        "MS",
        "MG",
        "PA",
        "PB",
        "PR",
        "PE",
        "PI",
        "RJ",
        "RN",
        "RS",
        "RO",
        "RR",
        "SC",
        "SP",
        "SE",
        "TO"
      ],
      nameMessages: [
        { key: "required", message: "Este campo é obrigatório. " }
      ],
      cpfMessages: [{ key: "required", message: "Este campo é obrigatório. " }],
      birthdateMessages: [
        { key: "required", message: "Este campo é obrigatório. " },
        { key: "date", message: "Data inválida. " }
      ],
      phoneMessages: [
        { key: "required", message: "Este campo é obrigatório. " },
        { key: "minLength", message: "Número de telefone incompleto. " }
      ],
      emailMessages: [
        { key: "required", message: "Este campo é obrigatório. " },
        { key: "email", message: "Email inválido. " },
        { key: "isUnique", message: "Email já cadastrado. " }
      ],
      passwordMessages: [
        { key: "required", message: "Este campo é obrigatório. " },
        {
          key: "minLength",
          message: "Senha deve conter no minimo 8 caracteres. "
        }
      ],
      passwordConfirmationMessages: [
        { key: "required", message: "Este campo é obrigatório. " },
        { key: "sameAsPassword", message: "Senha deve ser identica. " }
      ],
      crmvMessages: [
        { key: "required", message: "Este campo é obrigatório. " }
      ],
      crmvUfMessages: [
        { key: "required", message: "Este campo é obrigatório. " }
      ]
    };
  },
  validations: {
    accredited: {
      name: { required },
      cpf: { required },
      birthdate: {
        required,
        date: async value => {
          if (value.length == 10)
            return moment(value, "DD/MM/YYYY", true).isValid();
          return true;
        }
      },
      phone: { required, minLength: minLength(15) },
      crmv: { required },
      crmv_uf: { required },
      credential_attributes: {
        email: {
          email,
          required,
          async isUnique(value) {
            if (
              value === "" ||
              !this.$v.accredited.credential_attributes.email.email
            )
              return true;
            if (this.$v.accredited.credential_attributes.email.email) {
              const response = await this.$api.post("clients/by_email", {
                email: value
              });
              return !response.data;
            }
          }
        },
        password: { required, minLength: minLength(8) },
        password_confirmation: { required, sameAsPassword: sameAs("password") }
      }
    }
  },
  methods: {
    validate() {
      this.$v.accredited.$touch();
      var isValid = !this.$v.accredited.$invalid;
      this.$emit("on-validate", this.accredited, true);
      return true;
    }
  },
  watch: {
    "accredited.accreditationType"(val) {
      EventBus.$emit("accreditationType", !this.accredited.accreditationType);
    }
  }
};
</script>

<template>
  <div>
    <form class="form-horizontal">
      <div class="row">
        <div class="col-12 col-md-6">
          <InputText
            v-model="$v.accredited.name.$model"
            label="Nome"
            required
            :validations="$v.accredited.name"
            :errorMessages="nameMessages"
          />
        </div>
        <div class="col-12 col-md-6">
          <InputText
            v-model="$v.accredited.cpf.$model"
            label="CPF"
            required
            :validations="$v.accredited.cpf"
            :errorMessages="cpfMessages"
            type="tel"
            mask="###.###.###-##"
          />
        </div>
        <div class="col-12 col-md-6">
          <InputText
            v-model="$v.accredited.birthdate.$model"
            label="Nascimento"
            required
            :validations="$v.accredited.birthdate"
            :errorMessages="birthdateMessages"
            type="tel"
            mask="##/##/####"
          />
        </div>
        <div class="col-12 col-md-6">
          <InputText
            v-model="$v.accredited.phone.$model"
            label="Telefone"
            required
            :validations="$v.accredited.phone"
            :errorMessages="phoneMessages"
            type="tel"
            mask="(##) #####-####"
          />
        </div>
        <hr />
        <div class="col-12 col-md-6">
          <InputText
            v-model="$v.accredited.credential_attributes.email.$model"
            label="Email"
            required
            :validations="$v.accredited.credential_attributes.email"
            :errorMessages="emailMessages"
            type="email"
          />
        </div>
        <div class="col-12 col-md-3">
          <InputText
            v-model="$v.accredited.credential_attributes.password.$model"
            label="Senha"
            required
            :validations="$v.accredited.credential_attributes.password"
            :errorMessages="passwordMessages"
            type="password"
          />
        </div>

        <div class="col-12 col-md-3">
          <InputText
            v-model="
              $v.accredited.credential_attributes.password_confirmation.$model
            "
            label="Confirmação de senha"
            required
            :validations="
              $v.accredited.credential_attributes.password_confirmation
            "
            :errorMessages="passwordConfirmationMessages"
            type="password"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-6 text-center">
          <b-form-group>
            <h4 class="font-size-15 mt-3 text-center">
                Você atuará como veterinário no estabelecimento em questão?
            </h4>
            <b-form-checkbox
              v-model="accredited.vet"
              name="check-button"
              switch
            >
              {{ accredited.vet ? "Sim" : "Não" }}
            </b-form-checkbox>
          </b-form-group>
        </div>
        <div class="col-3" v-if="accredited.vet">
            <InputText
              v-model="$v.accredited.crmv.$model"
              label="CRMV"
              required
              :validations="$v.accredited.crmv"
              :errorMessages="crmvMessages"
            />
        </div>
        <div class="col-3" v-if="accredited.vet">
          <InputText
            v-model="$v.accredited.crmv_uf.$model"
            label="UF"
            required
            :validations="$v.accredited.crmv_uf"
            :errorMessages="crmvUfMessages"
          />
        </div>
      </div>
    </form>
  </div>
</template>
