// router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import ContentPageLayout from '@/layouts/ContentPageLayout.vue'
import AuthPageLayout from '@/layouts/AuthPageLayout.vue'
import SignInPage from '@/views/auth/SignInPage.vue'
import FoodListPage from '@/views/food-list/FoodListPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/sign-in',
  },
  {
    path: '/sign-in',
    name: 'sign-in',
    meta: { layout: AuthPageLayout },
    component: SignInPage,
  },
  {
    path: '/food-list',
    name: 'food-list',
    meta: { layout: ContentPageLayout },
    component: FoodListPage,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/sign-in',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  console.log('Routing:', to.name, 'Logged in:', authStore.authState.isLoggedIn);

  if (!authStore.authState.isLoggedIn && to.name !== 'sign-in') {
    console.log('Redirecting to sign-in');
    next({ name: 'sign-in' });
  } else if (authStore.authState.isLoggedIn && to.name === 'sign-in') {
    console.log('Redirecting to food list');
    next({ name: 'food-list' });
  } else {
    next();
  }
});


export default router
