import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Global Navigation Guard para proteger as rotas
  Router.beforeEach((to) => {
    const isAuthenticated = !!localStorage.getItem('access_token');

    if (to.path !== '/login' && !isAuthenticated) {
      // Se tentar acessar rota protegida sem estar logado -> vai pro login
      return '/login';
    } else if (to.path === '/login' && isAuthenticated) {
      // Se tentar ir pro login já estando logado -> vai pra raiz
      return '/';
    }

    // Tudo certo, pode seguir
    return true;
  });

  return Router;
});
