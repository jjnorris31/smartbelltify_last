import Vue from 'vue';
import Router from 'vue-router';
import firebase from './firebase';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: 'login',
    },
    {
      path: '/',
      redirect: 'login',
    },
    {
      path: '/',
      component: () => import('./views/LoginHome.vue'),
      children: [
        {
          path: 'login',
          component: () => import('./views/Login.vue'),
        },
      ],
    },
    {
      path: '/apphome',
      component: () => import('./views/AppHome.vue'),
      meta: {
        authenticated: true,
      },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('./views/Dashboard.vue'),
        },
        {
          path: 'animalform',
          name: 'animalform',
          component: () => import('./views/AnimalForm.vue'),
        },
        {
          path: 'paddockform',
          name: 'paddockform',
          component: () => import('./views/PaddockForm.vue'),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const user = firebase.auth.currentUser;
  // cada ruta que tenga como meta authenticated
  const auth = to.matched.some(record => record.meta.authenticated);
  // si no está autenticado entonces no avances de login
  if (auth && !user) {
    next({ path: '/login' });
    // si está autenticado, ve a dashboard
  } else if (!auth && user) {
    next({ name: 'dashboard' });
  } else {
    next();
  }
});

export default router;
