import Vue from 'vue';
import Vuex from 'vuex';
import firebase from './firebase';
import router from './router';
import moment from 'moment';

Vue.use(Vuex);
Vue.use(firebase);

export default new Vuex.Store({
  state: {
    paddock: '',
    paddocks: '',
    animals: '',
    user: '',
  },
  getters: {
    getPaddockSelected(state) {
      return state.paddock;
    },
    getPaddocks(state) {
      return state.paddocks;
    },
    getAnimals(state) {
      return state.animals;
    },
    getUser(state) {
      return state.user;
    },
  },
  mutations: {
    changeSelectedPaddock(state, paddock) {
      state.paddock = paddock;
    },
    loadPaddocks(state, paddocks) {
      state.paddocks = paddocks;
    },
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    /**
     * Obtiene el último rancho seleccionado por el usuario
     * @param context
     */
    loadLastPaddockSelected(context) {
      firebase.firestore.collection('users').doc('firstUser').get().then((snapshot) => {
        context.commit('changeSelectedPaddock', snapshot.data().paddockSelected);
      });
    },
    /**
     * Obtiene todos los ranchos previamente registrados por el usuario
     * @param context
     */
    fireListenUserPaddocks(context) {
      const user = firebase.firestore.collection('users').doc('firstUser');
      user.collection('paddocks').onSnapshot((onSnapshot) => {
        const tempPaddocksArray = [];
        onSnapshot.forEach((doc) => {
          tempPaddocksArray.push(doc.data());
        });
        context.commit('loadPaddocks', tempPaddocksArray);
      });
    },
    /**
     * Cambia el último rancho seleccionado en la base de datos
     * y cambia el estado del mismo
     * @param context
     * @param payload
     */
    changeLastPaddockSelected(context, payload) {
      firebase.firestore.collection('users').doc('firstUser').set({
        paddockSelected: payload.userPaddockSelected,
      });
      context.commit('changeSelectedPaddock', payload.userPaddockSelected);
    },
    signIn(context, payload) {
      firebase.auth.signInWithEmailAndPassword(payload.user, payload.password).then((user) => {
        context.commit('setUser', user);
        router.push('/apphome/dashboard');
      });
    },
    signUp(context, payload) {
      firebase.auth.createUserWithEmailAndPassword(payload.user.email, payload.user.password)
        .then((event) => {
          firebase.firestore.collection('users').doc(event.user.uid).set({
            firstName: payload.user.name,
            lastName: payload.user.lastName,
            email: payload.user.email,
            paddockSelected: payload.paddock,
            phone: payload.user.phone,
          }).then(() => {
            const firstPaddock = {
              name: payload.paddock,
              address: payload.user.address,
            };
            firebase.firestore.collection('users').doc(event.user.uid).collection('paddocks').add(firstPaddock);
          });
        }).catch((error) => {
        // eslint-disable-next-line no-console
          console.log(error);
        });
    },
    firstUserSet(context) {
      context.commit('setUser', firebase.auth.currentUser);
    },
    signOut(context) {
      firebase.auth.signOut().then(() => {
        context.commit('setUser', null);
        router.push('/');
      });
    },
    saveAnimal(context, payload) {
      const firestoreUserRef = firebase.firestore.collection('users').doc(firebase.auth.currentUser.uid).collection('animals');
      if (payload.sex === 'Toro') {
        firestoreUserRef.add({
          id: payload.id,
          sex: payload.sex,
          birthday: payload.birthday,
          group: payload.group,
          breed: payload.breed,
        })
          .then((newAnimal) => {
            firestoreUserRef.doc(newAnimal.id).collection('history').add({
              name: 'Animal agregado',
              description: '¡Nuevo animal en el rancho!',
              type: 'newAnimal',
              date: moment().format('MM-DD-YYYY'),
            });
          });
      } else if (payload.sex === 'Vaca') {
        // vaquilla
        if (payload.heifer && payload.reproductiveStage === '') {
          firestoreUserRef.add({
            id: payload.id,
            sex: payload.sex,
            birthday: payload.birthday,
            group: payload.group,
            breed: payload.breed,
            lastChildBirth: '',
            dryDays: '0',
            pregnantDate: '',
            isPregnant: false,
            lactationCycle: '0',
            milkState: 'Ninguno',
            dim: '0',
            lastHeatDate: '',
          })
            .then((newAnimal) => {
              firestoreUserRef.doc(newAnimal.id).collection('history').add({
                name: 'Animal agregado',
                description: '¡Nuevo animal en el rancho!',
                type: 'newAnimal',
                date: moment().format('MM-DD-YYYY'),
              });
            });
        } else if (!payload.heifer && payload.reproductiveStage === 'Ninguno') {
          // vaca con 0 ciclos de gestación y 0 eventos
          const tempDryDays = moment().diff(moment(payload.birthday).add(390, 'days'), 'days');
          firestoreUserRef.add({
            id: payload.id,
            sex: payload.sex,
            birthday: payload.birthday,
            group: payload.group,
            breed: payload.breed,
            lastChildBirth: '',
            dryDays: tempDryDays,
            pregnantDate: '',
            isPregnant: false,
            lactationCycle: '0',
            milkState: 'Seca',
            dim: '0',
            lastHeatDate: '',
          })
            .then((newAnimal) => {
              firestoreUserRef.doc(newAnimal.id).collection('history').add({
                name: 'Animal agregado',
                description: '¡Nuevo animal en el rancho!',
                type: 'newAnimal',
                date: moment().format('MM-DD-YYYY'),
              });
            });
        } else if (!payload.heifer && payload.reproductiveStage !== 'Ninguno') {
          const tempDryDays = moment().diff(moment(payload.birthday).add(390, 'days'), 'days');
          firestoreUserRef.add({
            id: payload.id,
            sex: payload.sex,
            birthday: payload.birthday,
            group: payload.group,
            breed: payload.breed,
            lastChildBirth: '',
            dryDays: tempDryDays,
            pregnantDate: payload.pregnantDate,
            isPregnant: payload.isPregnant,
            lactationCycle: '0',
            milkState: 'Seca',
            dim: '0',
            lastHeatDate: payload.lastHeatDate,
          })
            .then((newAnimal) => {
              const newAnimalRef = firestoreUserRef.doc(newAnimal.id);
              newAnimalRef.collection('history').add({
                name: 'Animal agregado',
                description: '¡Nuevo animal en el rancho!',
                type: 'newAnimal',
                date: moment().format('MM-DD-YYYY'),
              });
              if (payload.reproductiveStage !== 'Gestación') {
                newAnimalRef.collection('heatEvents').add(payload.events.firstEventItem);
              }
              newAnimalRef.collection('history').add(payload.history.firstHistoryItem);
            });
        }
      }
    },
  },
});
