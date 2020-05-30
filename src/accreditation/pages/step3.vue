<script>
import { required, minLength, email, sameAs } from "vuelidate/lib/validators";
import Multiselect from "vue-multiselect";

import { categoryMethods } from "@manager-state/helpers";

export default {
  components: {
    Multiselect
  },
  data() {
    return {
      selectedCategory: {},
      all_categories: [],
      categories: [],
      selectedServices: []
    };
  },
  validations: {},
  mounted() {
    this.getCategories()
  },
  methods: {
    ...categoryMethods,
    getCategories() {
      this.$api("/categories").then(resp => {
        this.all_categories = resp.data;
      });
    },
    selectAllServicesByCategory(category_id) {
      let count = 0;
      let category = this.all_categories.filter(c => {
        if (c.id == category_id) return c;
      })[0];

      category.services.filter(s => {
        this.selectedServices.filter(ss => {
          if (s.id == ss) count++;
        });
      });

      if (count > 0) {
        let intersection = [];
        category.services.filter(x => {
          if (this.selectedServices.includes(x.id)) intersection.push(x.id);
        });

        intersection.forEach(i => {
          let index = this.selectedServices.indexOf(i);
          this.selectedServices.splice(index, 1);
        });
        return true;
      }

      this.all_categories.filter(c => {
        if (c.id == category_id)
          c.services.filter(s => this.selectedServices.push(s.id));
      });
    },
    canSelectAll(category_id) {
      return this.hasSelectedService(category_id)
        ? "Remover selecionados"
        : "Selecionar todos";
    },

    hasSelectedService(category_id) {
      let count = 0;
      let selectedCategory = this.all_categories.filter(c => {
        if (c.id == category_id) return c;
      })[0];

      console.log(1, selectedCategory)
      if (selectedCategory.id)
        selectedCategory.services.filter(s => {
          this.selectedServices.filter(ss => {
            if (s.id == ss) count++;
          });
        });
      return !!count;
    },
    validate() {
      this.$v.client.$touch();
      var isValid = !this.$v.client.$invalid;
      this.$emit("on-validate", {}, isValid);
      return isValid;
    }
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <b-tabs class="navtab-bg" pills justified>
              <div v-for="category in all_categories">
                <b-tab :title="category.name">
                  <template slot="title">
                    {{ category.name }}
                  </template>
                  <div class="row">
                    <div class="col-12 text-center" style="margin-bottom: 30px">
                      <b-button
                        variant="outline-success"
                        @click="selectAllServicesByCategory(category.id)"
                      >
                        {{ canSelectAll(category.id) }}
                      </b-button>
                    </div>
                    <div
                      class="col-3 text-center"
                      v-for="service in category.services"
                    >
                      <div
                        class="input-group bootstrap-touchspin bootstrap-touchspin-injected mb-2"
                      >
                        <b-form-checkbox
                          v-model="selectedServices"
                          :value="service.id"
                          >{{ service.name }}</b-form-checkbox
                        >
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
  </div>
</template>
