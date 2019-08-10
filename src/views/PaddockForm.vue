<!--suppress JSUnusedGlobalSymbols -->
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container fill-height>
    <v-layout column>
      <!-- header y subtítulo -->
      <v-flex>
        <v-layout row justify-space-between>
          <!-- mensaje de bienvenida -->
          <v-flex
            :mb-4="$vuetify.breakpoint.smAndUp"
            class="dashboard-header-container">
            <v-layout column>
              <v-flex>
                <h1 class="app-header">Alta de rancho</h1>
                <p class="app-header-sub grey--text text--darken-3">
                  Introduce los datos requeridos
                </p>
              </v-flex>
            </v-layout>
          </v-flex>
          <!-- número de vacas, visible en md and down -->
          <v-flex
            hidden-xs-only
            align-self-center>
            <v-layout row justify-end>
              <v-card
                color="primary"
                min-width="40%"
                dark
                style="font-family: Cabin, sans-serif;"
              >
                <v-card-title style="font-size: 35px">5</v-card-title>
                <v-card-text style="font-size: 18px">Ranchos en sistema</v-card-text>
              </v-card>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <!-- campos de datos del animal -->
      <v-form ref="paddockForm" v-model="valid" class="cabin-font">
        <v-container>
          <v-layout
            wrap
            :row="$vuetify.breakpoint.lgAndUp"
            :column="$vuetify.breakpoint.mdAndDown"
            :justify-space-around="$vuetify.breakpoint.lgAndUp">
            <!-- Nombre del rancho -->
            <v-flex
              lg5
              md5
              sm12
              xs12>
              <v-text-field
                v-model="name"
                clearable
                class="form-text-input"
                label="Nombre"
                outlined
                required
                :rules="nameRules"></v-text-field>
            </v-flex>
            <!-- fin de nombre del rancho -->
            <!-- dirección del rancho -->
            <v-flex
              lg5
              md5
              sm12
              xs12>
              <v-text-field
                v-model="address"
                clearable
                class="form-text-input"
                label="Dirección"
                outlined
                required
                :rules="addressRules"></v-text-field>
            </v-flex>
            <!-- fin de dirección del rancho -->
          </v-layout>
        </v-container>
      </v-form>
      <!-- fin de campos del animal -->
      <v-flex align-self-center class="cabin-font">
        <v-layout
          :column="$vuetify.breakpoint.xsOnly"
          :row="$vuetify.breakpoint.smAndUp"
          :align-center="$vuetify.breakpoint.xsOnly"
          :justify-center="$vuetify.breakpoint.smAndUp">
          <v-flex
            :mb-4="$vuetify.breakpoint.xsOnly">
            <v-btn
              color="blue darken-4"
              dark
              class="form-action-button"
              solo>Registrar rancho</v-btn>
          </v-flex>
          <v-flex>
            <v-btn
              color="red darken-2"
              dark
              class="form-action-button"
              @click="resetPaddockForm"
              solo>Limpiar los campos</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<!--suppress ES6ShorthandObjectProperty, ES6ShorthandObjectProperty -->
<script>
import moment from 'moment';

export default {
  name: 'PaddockForm',
  computed: {
  },
  watch: {
  },
  data() {
    return {
      valid: false, // indica si la forma es válida o no
      // reglas para el input de nombre del rancho
      nameRules: [
        v => (v && v.length !== 0) || 'El nombre del rancho es requerido',
      ],
      // reglas para el input de dirección del rancho
      addressRules: [
        v => (v && v.length !== 0) || 'La dirección del rancho es requerida',
      ],
      name: '', // nombre del rancho
      address: '', // dirección del rancho
    };
  },
  methods: {
    /**
     * Permite borrar todos los campos del formulario
     */
    resetPaddockForm() {
      // noinspection JSUnresolvedVariable
      this.$refs.paddockForm.reset();
    },
  },
  created() {
    moment.locale('es');
  },
};
</script>

<style scoped>
  .dashboard-header-container {
    margin: 0 1rem 0 1rem;
  }
  .sidebar-container p {
    font-size: 20px;
  }
  .form-action-button {
    margin: 0 2rem;
    font-family: Cabin, sans-serif;
  }
  .form-text-input {
    font-family: Cabin, sans-serif;
  }
  @media (max-width: 600px) {
    .app-header {
      font-size: 25px;
      font-weight: 500;
    }
    .app-header-sub {
      font-family: Cabin, sans-serif;
      font-size: 15px;
    }
  }
</style>
