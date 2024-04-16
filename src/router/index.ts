import {
  createRouter,
  createWebHistory,
  type RouterOptions,
  type RouteRecordRaw,
} from 'vue-router'
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
    redirect: '/food-list',
  },
]

const routerOptions: RouterOptions = {
  history: createWebHistory(),
  routes,
}

export const router = createRouter(routerOptions)
