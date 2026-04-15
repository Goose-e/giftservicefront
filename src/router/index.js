import { createRouter, createWebHistory } from 'vue-router';

import Home from '../views/Main.vue';
import authorizationPage from '../views/Autorization.vue';
import registrationPage from '../views/Registration.vue';
import Profil from '../views/Profil.vue';
import UserCompanies from '../views/UserCompanies.vue';
import Company from '../views/Company.vue';
import WaterCalculator from '../views/WaterCalculator.vue';

const routes = [
  { path: '/', component: Home, name: 'main' },
  { path: '/authorization', component: authorizationPage, name: 'authorization' },
  { path: '/registration', component: registrationPage, name: 'registration' },
  { path: '/profil', component: Profil, name: 'profil' },
  { path: '/usercompanies', component: UserCompanies, name: 'UserCompanies' },
  { path: '/companypage/:code', component: Company, name: 'UserCompany' },
  { path: '/water', component: WaterCalculator, name: 'water' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
