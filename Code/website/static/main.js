import {logins} from './logins.js';
import  {signup}  from './signups.js';
import {admin, adminvenue, adminsummary} from './admin.js';
import {home, bookticket, allorder, userprofile, usershome} from './UserHome.js';
const myDiv = document.createElement('div');
const AboutComponent = { template: '<div>About Component</div>' };



// Handle the beforeinstallprompt event
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the default behavior, which is to show the browser's installation prompt
  event.preventDefault();
  
  // Store the event for later use
  deferredPrompt = event;

  // You can choose to show your own custom "Add to Home Screen" button or UI element
  // Make this element visible or trigger it when appropriate for your app
  // For example:
  // addtohomescreenButton.style.display = 'block';
});

// Add an event listener to your custom "Add to Home Screen" button (if you have one)
// let addtohomescreenButton = document.getElementById('addtohomescreenButton')
addtohomescreenButton.addEventListener('click', () => {
  if (deferredPrompt) {
    // Show the installation prompt to the user
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }

      // Clear the deferredPrompt variable
      deferredPrompt = null;
    });
  }
});


const router = new VueRouter({
  routes: [
    { path: '/', component: signup, meta: {auth: false }},
    { path: '/about', component: AboutComponent, meta: {auth: false } },
    { path: '/login', component: logins, meta: {auth: false } },
    { path: '/admin', component: admin, meta: {auth: true },children: [{path: '',component: adminvenue,},{path:'summary',component:adminsummary}, ]},
    // { path: '/admin/show', component: adminshow, meta: {auth: true } },
    // { path: '/admin/venue', component: admin, meta: {auth: true } },
    // { path: '/user', component: home, meta: {auth: true },children: [{path: '',component: user,},{path:'book/*',component:bookticket},{path:'profile',component:userprofile}, { path: 'order', component: allorder, meta: {auth: true } } ] }
    {path:'/usershome' ,component: usershome, meta: {auth: true}},
    { path: '/user', component: home, meta: {auth: true },children: [{path:'book/*',component:bookticket},{path:'profile',component:userprofile}, { path: 'order', component: allorder, meta: {auth: true } } ] }
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

// import  signupTemplate  from './signup.js';
// import {login} from './logins.js';
// // import Vue from 'vue'
// // document.body.appendChild(myDiv);
// const myDiv = document.createElement('div');
// // const HomeComponent = { template: '<div>Home Component</div>' };
// const AboutComponent = { template: '<div>About Component</div>' };
// // const HomeComponent = { template: '<div>Home Component</div>' };
// // const SignupComponent = { template: createHtml(signupTemplate)}

// // function createHtml(reqTemp){
// //     myDiv.innerHTML = reqTemp;
// //     return myDiv
// // }

// const router = new VueRouter({
//     routes: [
//         { path: '/', component: signupTemplate },
//         { path: '/about', component: AboutComponent },
//         { path: '/login', component: login}
//     ]
// });

// new Vue({
//     el: '#app',
//     mode: 'history',
//     router
// });

export default router









