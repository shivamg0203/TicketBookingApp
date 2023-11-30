import {logins} from './website/static/logins.js';
import  {signup}  from './website/static/signups.js';
import {admin, adminvenue, adminsummary} from './website/static/admin.js';
import {home, user, bookticket, allorder, userprofile} from './website/static/UserHome.js';
const myDiv = document.createElement('div');
const AboutComponent = { template: '<div>About Component</div>' };

const router = new VueRouter({
  routes: [
    { path: '/', component: signup, meta: {auth: false }},
    { path: '/about', component: AboutComponent, meta: {auth: false } },
    { path: '/login', component: logins, meta: {auth: false } },
    // { path: '/admin', component: admin, meta: {auth: true },children: [{path: 'home',component: adminh,},{path: '',component: adminhome,},{path:'venue',component:adminvenue} ]},
    // { path: '/admin', component: admin, meta: {auth: true },children: [{path: '',component: adminhome,},{path:'venue',component:adminvenue}, { path: 'show', component: adminshow, meta: {auth: true } } ]},
    { path: '/admin', component: admin, meta: {auth: true },children: [{path: '',component: adminvenue,},{path:'summary',component:adminsummary},  ]},
    // { path: '/admin/show', component: adminshow, meta: {auth: true } },
    // { path: '/admin/venue', component: admin, meta: {auth: true } },
    { path: '/user', component: home, meta: {auth: true },children: [{path: '',component: user,},{path:'book/*',component:bookticket},{path:'profile',component:userprofile}, { path: 'order', component: allorder, meta: {auth: true } } ] }
  ]
});

router.beforeEach((to, from, next)=>{
  if (to.meta.auth && !localStorage.getItem('token')){
    next('/login')
  }
  else {
    next()
  }
})

new Vue({
  el: '#app',
  router,
  component:{
    logins
  }
});

export default router