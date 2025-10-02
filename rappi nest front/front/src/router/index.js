import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import Profile from '../views/Profile.vue';
import Login from '@/views/Login.vue';
import Client from '@/views/Client.vue';
import Inicio from '@/views/Inicio.vue';
import Admin from '@/views/Admin.vue';
import Addresses from '@/views/Addresses.vue';
const routes = [
  { path: '/register', name: 'Register', component: Register },
  { path: '/admin', name: 'Admin', component: Admin },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/login', name: 'Login', component: Login },
  { path: '/client', name: 'Client', component: Client },
  { path: '/addresses', name: 'Addresses', component: Addresses },
  { path: '/', name: 'Inicio', component: Inicio }


];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
