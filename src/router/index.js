import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import SignUp from '@/components/SignUp.vue'
import UsersList from '@/components/UsersList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
      
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/users',
      name: 'users',
      component: UsersList
    }
  ],
})

export default router
