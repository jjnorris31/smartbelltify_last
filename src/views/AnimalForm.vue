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
                  <h1 class="app-header">Alta de animales</h1>
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
                  <v-card-title style="font-size: 35px">104</v-card-title>
                  <v-card-text style="font-size: 18px">Animales en sistema</v-card-text>
                </v-card>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <!-- campos de datos del animal -->
        <v-form ref="animalForm" v-model="valid" class="cabin-font">
          <v-container>
            <v-layout
              wrap
              :row="$vuetify.breakpoint.lgAndUp"
              :column="$vuetify.breakpoint.mdAndDown"
              :justify-space-around="$vuetify.breakpoint.lgAndUp">
              <!-- ID de control interno -->
              <v-flex
                lg5
                md5
                sm12
                xs12>
                <v-text-field
                  v-model="newAnimal.IDInternalControl"
                  clearable
                  class="form-text-input"
                  label="ID de control interno"
                  outlined
                  required
                  :rules="idRules"></v-text-field>
                </v-flex>
              <!-- fin de ID de control interno -->
              <!-- sexo del animal -->
              <v-flex lg5 md5 sm12 xs12>
                <v-select
                  v-model="newAnimal.sex"
                  :items="sex"
                  max-width="100%"
                  label="Sexo del animal"
                  outlined
                ></v-select>
              </v-flex>
              <!-- fin de sexo del animal -->
              <!-- fecha de nacimiento -->
              <v-flex lg5 md5 sm12 xs12>
                <v-menu
                  v-model="birthdayPicker"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :value="formattedBirthday"
                      label="Fecha de nacimiento"
                      append-icon="mdi-calendar-blank"
                      outlined
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="newAnimal.birthday"
                    :allowed-dates="allowedBirthdayDates"
                    no-title @input="birthdayPicker = false"
                    locale="es-419"></v-date-picker>
                </v-menu>
              </v-flex>
              <!-- fin de fecha de nacimiento -->
              <!-- raza del animal -->
              <v-flex lg5 md5 sm12 xs12>
                <v-select
                  v-model="newAnimal.breed"
                  :items="breeds"
                  max-width="100%"
                  label="Raza del animal"
                  outlined
                ></v-select>
              </v-flex>
              <!-- fin de la raza del animal -->
              <!-- grupo del animal -->
              <v-flex lg5 md5 sm12 xs12>
                <v-select
                  v-model="newAnimal.group"
                  :items="groups"
                  max-width="100%"
                  label="Grupo"
                  outlined
                ></v-select>
              </v-flex>
              <!-- fin del grupo del animal -->
              <!-- ciclo de lactancia -->
              <v-flex
                v-if="newAnimal.sex === 'Vaca' && newAnimal.firstBirthDatePassed"
                lg5
                md5
                sm12
                xs12>
                <v-select
                  v-model="newAnimal.lactationCycle"
                  :items="lactationCycles"
                  max-width="100%"
                  label="Ciclo de lactancia"
                  outlined
                ></v-select>
              </v-flex>
              <!-- fin de ciclo de lactancia -->
              <!-- fecha de último parto -->
              <v-flex
                v-if="newAnimal.sex === 'Vaca' &&
                newAnimal.firstBirthDatePassed &&
                newAnimal.lactationCycle !== '0'"
                lg5
                md5
                sm12
                xs12>
                <v-menu
                  v-model="lastChildBirthPicker"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :value="formattedLastChildBirth"
                      label="Fecha de último parto"
                      append-icon="mdi-calendar-blank"
                      outlined
                      :disabled="newAnimal.birthday === ''"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="newAnimal.lastChildBirth"
                    :allowed-dates="allowedLastChildBirthDates"
                    no-title @input="lastChildBirthPicker = false"
                    locale="es-419"></v-date-picker>
                </v-menu>
              </v-flex>
              <!-- fin de fecha de último parto -->
              <!-- etapa reproductiva -->
              <v-flex lg5 md5 sm12 xs12>
                <v-select
                  v-if="newAnimal.sex === 'Vaca' && !newAnimal.heifer"
                  v-model="reproductiveStage"
                  :items="reproductiveStages"
                  max-width="100%"
                  label="Etapa reproductiva"
                  outlined
                ></v-select>
              </v-flex>
              <!-- fin de etapa reproductiva -->
              <!-- fecha de evento de etapa reproductiva -->
              <v-flex lg5 md5 sm12 xs12
                      v-if="!(this.reproductiveStage === '' || this.reproductiveStage === 'Ninguno')">
                <v-menu
                  v-model="reproductiveStagePicker"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  full-width
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :value="formattedReproductiveStageDate"
                      :label="reproductiveDateLabel"
                      append-icon="mdi-calendar-blank"
                      outlined
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="reproductiveStageDate"
                    :allowed-dates="newAnimal.lactationCycle === '0'
                    ? allowedReproductiveStagesDates : allowedReproductiveStagesDatesCycle"
                    no-title @input="reproductiveStagePicker = false"
                    locale="es-419"></v-date-picker>
                </v-menu>
              </v-flex>
              <!-- fin de fecha de evento de etapa reproductiva -->
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
                @click="saveAnimal"
                class="form-action-button"
                solo>Registrar animal</v-btn>
            </v-flex>
            <v-flex>
              <v-btn
                color="red darken-2"
                dark
                class="form-action-button"
                @click="resetAnimalForm"
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
  name: 'AnimalForm',
  computed: {
    /**
     * Regresa el sexo del animal, útil para hacer funcionar el
     * watcher sobre esta propiedad del objeto
     */
    animalSex() {
      return this.newAnimal.sex;
    },
    animalLactationCycle() {
      return this.newAnimal.lactationCycle;
    },
    /**
     * Regresa la fecha de nacimiento del animal, útil para hacer
     * funcionar el watcher sobre esta propiedad del objeto
     */
    animalBirthday() {
      return this.newAnimal.birthday;
    },
    /**
     * Regresa la fecha de último parto del animal, útil para hacer funcionar el
     * watcher sobre esta propiedad del objeto
     */
    animalLastChildBirth() {
      return this.newAnimal.lastChildBirth;
    },
    /**
     * Regresa la fecha nacimiento del animal en formato día - mes - año
     */
    formattedBirthday() {
      return this.newAnimal.birthday ? moment(this.newAnimal.birthday).format('DD [de] MMMM [del] YYYY') : '';
    },
    /**
     * Regresa la fecha último parto del animal en formato día - mes - año
     */
    formattedLastChildBirth() {
      return this.newAnimal.lastChildBirth ? moment(this.newAnimal.lastChildBirth).format('DD [de] MMMM [del] YYYY') : '';
    },
    /**
     * Regresa la fecha de la etapa reproductiva del animal en formato día - mes - año
     */
    formattedReproductiveStageDate() {
      return this.reproductiveStageDate ? moment(this.reproductiveStageDate).format('DD [de] MMMM [del] YYYY') : '';
    },
    reproductiveDateLabel() {
      switch (this.reproductiveStage) {
        case 'PEV':
          return 'Selecciona la fecha de último celo';
        case 'Inseminada':
          return 'Selecciona la fecha de inseminación';
        case 'Gestante':
          return 'Selecciona la fecha de preñado';
        default:
          return '';
      }
    },
  },
  watch: {
    animalLastChildBirth(newDate) {
      this.calculateMilkVariables(newDate);
    },
    reproductiveStageDate(newDate) {
      this.assignReproductiveStageEvent(newDate);
    },
    reproductiveStage() {
      this.resetReproductiveStage();
    },
    /**
     * Revisa los cambios en el sexo del animal
     */
    animalSex() {
      this.changeSexAndReset();
    },
    /**
     * Revisa los cambios en la fecha de nacimiento del animal
     */
    animalBirthday(newDate) {
      this.isHeifer(newDate);
    },
    animalLactationCycle() {
      this.reproductiveStage = '';
    },
  },
  data() {
    return {
      paddockSelected: 'Seleccionar rancho', // rancho seleccionado
      paddocks: [ // ranchos disponible, versión dummy << BORRAR CUANDO YA NO SEAN NECESARIOS >>
        {
          name: 'El Pariente',
        },
        {
          name: 'El 100axo',
        },
        {
          name: 'El Mochilas',
        },
      ],
      // nuevo objeto animal
      newAnimal: {
        IDInternalControl: '', // identificador interno
        birthday: '', // nacimiento
        sex: '',
        lastChildBirth: '', // último parto
        group: '', // grupo
        breed: '', // raza
        dryDays: '', // días sin leche
        lastHeatDate: '', // fecha de último celo
        pregnantDate: '', // fecha de preñado
        isPregnant: false, // estado de preñado
        lactationCycle: '0', // ciclo de lactancia
        milkState: '', // estado de lactancia
        heifer: true, // indica si el animal no está en edad reproductiva
        firstBirthDatePassed: false, // indica si el animal ya pasó el primer parto
        dim: '', // días en leche
        events: {}, // eventos
        history: {}, // bitácora
      },
      groups: ['Establo general', 'Establo popular'], // grupos personalizados
      breeds: ['Beefmaster', 'Charolais', 'Simmental', 'Angus', 'Brangus', 'Santa Gertrudis', 'Hereford', 'Limousin',
        'Cebú Brahman', 'Belgian Blue'], // razas del animal
      sex: ['Toro', 'Vaca'], // sexo del animal
      reproductiveStages: ['PEV', 'Inseminada', 'Gestante', 'Ninguno'], // etapas reproductivas disponibles, en caso de que sea vaca
      reproductiveStage: '', // etapa reproductiva del animal, ...
      reproductiveStageDate: '', // fecha de la etapa reproductiva, ...
      lactationCycles: ['0', '1', '2', '3', '4', '5', '6', '7', '8'], // ciclos de lactancia del animal, ...
      birthdayPicker: false, // selector del calendario de fecha de nacimiento
      lastChildBirthPicker: false, // selector del calendario de último parto, ...
      reproductiveStagePicker: false, // selector del calendario de la etapa reproductiva, ...
      valid: false, // indica si la forma es válida o no
      // reglas para el input de ID
      idRules: [
        v => (v && v.length !== 0) || 'El número de identificación es requerido',
        v => /^[A-Za-z0-9]*$/.test(v) || 'Asegúrate que sean sólo números y letras',
      ],
      // reglas para el input de fecha de nacimiento
      lastChildBirthRules: [
        v => (moment().diff(moment(v)) > 1) || 'Aún no hay viajes en el tiempo',
        v => (this.newAnimal.birthday !== '' && moment(this.newAnimal.birthday).isBefore(moment(v))) || 'Revisa la fecha de nacimiento',
      ],
    };
  },
  methods: {
    changePaddock(index) {
      this.paddockSelected = this.paddocks[index].name;
    },
    /**
     * Calcula el estado de lactancia, los días en leche y los días
     * que el animal lleva sin producir leche
     * mediante su fecha de nacimiento
     * @param lastChildBirth fecha de nacimiento de la vaca
     */
    calculateMilkVariables(lastChildBirth) {
      if (lastChildBirth !== '') {
        const tempDim = moment().diff(moment(lastChildBirth), 'days');
        this.newAnimal.milkState = tempDim > 180 ? 'Seca' : 'Lactando';
        this.newAnimal.dim = tempDim >= 0 && tempDim <= 180 ? tempDim : '0';
        this.newAnimal.dryDays = tempDim > 360 ? tempDim : '0';
      }
    },
    saveAnimal() {
      let payload = {
        id: this.newAnimal.IDInternalControl,
        birthday: this.newAnimal.birthday,
        sex: this.newAnimal.sex,
        group: this.newAnimal.group,
        breed: this.newAnimal.breed,
        dryDays: this.newAnimal.dryDays,
        pregnantDate: this.newAnimal.pregnantDate,
        isPregnant: this.newAnimal.isPregnant,
        lactationCycle: this.newAnimal.lactationCycle,
        milkState: this.newAnimal.milkState,
        lastHeatDate: this.newAnimal.lastHeatDate,
        reproductiveStage: this.reproductiveStage,
        reproductiveDate: this.reproductiveStageDate,
        firstBirthDatePassed: this.firstBirthDatePassed,
        dim: this.newAnimal.dim,
        events: this.newAnimal.events,
        history: this.newAnimal.history,
        heifer: this.newAnimal.heifer,
      };

      this.$store.dispatch('saveAnimal', payload);
    },
    /**
     * Calcula si el animal aún no está en estado reproductivo
     * mediante la fecha de nacimiento y reinicia los parámetros
     * involucrados con la fecha de nacimiento
     */
    isHeifer(birthday) {
      this.newAnimal.heifer = (moment().diff(moment(birthday), 'days') < 390);
      this.newAnimal.firstBirthDatePassed = (moment().diff(moment(birthday), 'days') > 660);

      this.newAnimal.dryDays = '';
      this.newAnimal.pregnantDate = '';
      this.newAnimal.isPregnant = false;
      this.newAnimal.milkState = '';
      this.newAnimal.lastChildBirth = '';
      this.newAnimal.lastHeatDate = '';
      this.newAnimal.dim = '';
      this.newAnimal.events = {};
      this.newAnimal.lactationCycle = '0';
    },
    /**
     * Permite borrar todos los campos del formulario
     */
    resetAnimalForm() {
      // noinspection JSUnresolvedVariable
      this.$refs.animalForm.reset();
      this.newAnimal = {
        IDInternalControl: '',
        IDSiniiga: '',
        birthDay: '',
        sex: '',
        lastChildBirth: '',
        group: '',
        breed: '',
        dryDays: '',
        pregnantDate: '',
        isPregnant: false,
        lactationCycle: '',
        milkState: '',
        dim: '',
        events: {},
        history: {},
      };
      this.reproductiveStage = '';
      this.reproductiveStageDate = '';
    },
    /**
     * Al cambiar de sexo, el nuevo animal tiene que reiniciar algunos parámetros
     */
    changeSexAndReset() {
      this.newAnimal.lastChildBirth = '';
      this.newAnimal.history = {};
      this.newAnimal.group = '';
      this.newAnimal.dryDays = '';
      this.newAnimal.pregnantDate = '';
      this.newAnimal.isPregnant = false;
      this.newAnimal.events = {};
      this.newAnimal.milkState = '';
      this.newAnimal.dim = '';
      this.reproductiveStage = '';
      this.reproductiveStageDate = '';
    },
    /**
     * Valida todas los campos del formulario del animal
    validateAnimalForm() {
      // noinspection JSUnresolvedVariable
      if (this.$refs.animalForm.validate) {
      }
    },
     */
    /**
     * Calcula las fechas permitidas para el picker date de la fecha de nacimiento de la vaca
     * @param val fecha a revisar mediante la fecha actual
     * @returns {boolean} true si la fecha es permitida, false si no es así
     */
    allowedBirthdayDates: val => (moment().diff(moment(val)) > 1),
    /**
     * Calcula las fechas permitidas para el picker date de la fecha de último parto
     * @param val la fecha a revisar mediante la fecha de nacimiento
     * @returns {boolean} true si la fecha es permitida, false si no es así
     */
    allowedLastChildBirthDates(val) {
      // mayor a 660 dias (22 meses) y no mayor a la fecha actual
      return moment(val).diff(moment(this.newAnimal.birthday), 'days') >= 660 && (moment().diff(moment(val)) > 1);
    },
    allowedReproductiveStagesDates(val) {
      // mayor a 390 días (13 meses) y no mayor a la fecha actual
      return moment(val).diff(moment(this.newAnimal.birthday), 'days') >= 390 && (moment().diff(moment(val)) > 1);
    },
    allowedReproductiveStagesDatesCycle(val) {
      // mayor a 390 días (13 meses) y no mayor a la fecha actual
      return moment(val).diff(moment(this.newAnimal.lastChildBirth), 'days') >= 45 && (moment().diff(moment(val)) > 1);
    },
    resetReproductiveStage() {
      this.newAnimal.events = {};
      this.newAnimal.lastHeatDate = '';
      this.newAnimal.isPregnant = false;
      this.reproductiveStageDate = '';
    },
    /**
     * Cambia el objeto events del nuevo animal según la etapa de reproducción en la que
     * este se encuentre
     * @param eventDate la fecha del evento introducida por el usuario
     */
    assignReproductiveStageEvent(eventDate) {
      if (eventDate !== '') {
        let firstEventItem = {};
        let firstHistoryItem = {
          name: '',
          description: '',
          type: '',
          date: moment(eventDate).format('MM-DD-YYYY'),
        };
        if (this.reproductiveStage === 'PEV') {
          firstEventItem = {
            confirmed: true,
            inseminated: false,
            date: moment(eventDate).format('MM-DD-YYYY'),
          };
          firstHistoryItem.name = 'Celo perdido';
          firstHistoryItem.description = '¡Insemina la próxima vez!';
          firstHistoryItem.type = 'heat';
          this.newAnimal.lastHeatDate = moment(eventDate).format('MM-DD-YYYY');
          this.newAnimal.events.firstEventItem = firstEventItem;
        } else if (this.reproductiveStage === 'Inseminada') {
          firstEventItem = {
            confirmed: true,
            inseminated: true,
            date: moment(eventDate).format('MM-DD-YYYY'),
          };
          firstHistoryItem.name = 'Celo con inseminación';
          firstHistoryItem.description = 'La inseminaste, ¡muy bien!';
          firstHistoryItem.type = 'heat';
          this.newAnimal.lastHeatDate = moment(eventDate).format('MM-DD-YYYY');
          this.newAnimal.events.firstEventItem = firstEventItem;
        } else if (this.reproductiveStage === 'Gestante') {
          this.newAnimal.isPregnant = true;
          this.newAnimal.pregnantDate = moment(eventDate).format('MM-DD-YYYY');
          firstHistoryItem.name = 'Gestación confirmada';
          firstHistoryItem.description = 'Cuida mucho a este animal';
          firstHistoryItem.type = 'pregnant';
        }
        this.newAnimal.history.firstHistoryItem = firstHistoryItem;
      }
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
