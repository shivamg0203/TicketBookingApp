import router from "./main.js";
var logins = Vue.component('logins', {
    template: `
    <div id='parent-div'>
    <nav class="navbar sticky-top bg-gradient navbar-expand-lg bg-body-tertiary " id="header">
        <div class="container-fluid">
            <a class="navbar-brand" href="#"><img src="../static/logo.png" alt="Comany Logo" width="80" height="40" title="Movie N More"></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>
    </nav><form  @submit.prevent="loginuser()" > 
    <div class="a-box container">
        <h1 @click="s()">Sign-in </h1>
        <div class="form-group">
        <label for="exampleFormControlInput1">Username</label>
        <input type="username" ref="loginusername" v-model="username" class="form-control" id="loginusername" name="loginusername" placeholder="Type Username" >
        </div>
        
        <div class="form-group">
            <label for="exampleFormControlInput1">Password</label>
            <input :type="showPassword ? 'text' : 'password'"  v-model="password"  ref="loginpassword" class="form-control" id="loginexampleFormControlInput1" name='loginpassword' placeholder="Enter Password">
        </div>

        <div  class="form-group form-check">
            <input type="checkbox" v-model="showPassword" ref='showpword' class="form-check-input" id="exampleCheck1">
            <label class="form-check-label" for="exampleCheck1">Show Password</label>
        </div>

        <div class="form-group form-check">
            <input type="checkbox" v-model="isAdmin" ref="adminCheck" class="form-check-input" id="adminCheck">
            <label class="form-check-label" for="adminCheck">I am an Admin.</label>
        </div>
        
        <div ref='loginmsg' class="loginmsg">
        </div>

        <div class="_9bq4">
            <router-link to="/"><a aria-label="Don't have an account? Create Now." class="_9bq5">Don't have an account? Create Now.</a></router-link>
        </div>
        <br/>
        <button v-bind:disabled='loginDisabled' type="submit" name='login' class="btn btn-block btn-primary w-100 " id="loginbtn">Submit</button>
        <br/>
        <br/>
    </div>   
    <br/> 
  </form><footer>

  <ul class="footerlist">
      <li><b>About</b></li>
      <li><a href="#">Terms and Condition</a></li>
      <li><a href="#">Privacy Policy</a></li>
      <li><a href="#">Purchase Policy</a></li>
  </ul>
  <ul class="footerlist">
      <li class="heading"><b>Choose Language</b></li>
      <li class="lang">English</li>
      <li class="lang">Malayalam</li>
      <li class="lang">Tamil</li>
  </ul>
  <ul class="footerlist">
      <li class="heading"><b>Upcoming Movies</b></li>
      <li class="lang">Movie 1</li>
      <li class="lang">Movie 2</li>
      <li class="lang">Movie 3</li>
  </ul>


  <ul class="footerlist">
      <li class="heading">Apps</li>
      <li><a href="#"><img alt="Get it on Google Play" src="https://data.justickets.co/assets/en-play-badge.png" data-reactid=".0.2.2.1.0.0" height="30px" width="121px"></a></li>
      <li><a href="#"><img alt="Download on the App Store" src="https://cdn.freebiesupply.com/logos/large/2x/available-on-the-app-store-logo-png-transparent.png" height="30px" width="121px"></a></li>
  </ul>

  <ul class="footerlist">
      <li><b>Mail-to</b></li>
      <li><a href="#">donotreply@example.com</a></li>
      <li>Alan Shepard</li>
  </ul>

</footer></div>
    `,
    data() {
      return {
        username: '',
        password: '',
        showPassword: false,
        isAdmin: true,
        create: 'Create Account',
        loginDisabled: true
      };
    },
    computed:{

    },
    watch:{

    },

    methods: {
      disablelogin(){
        if (!this.username || !this.password){
          this.loginDisabled=true;
        }
        else{
          this.loginDisabled=false;
        }
      },
      // showPassword(){
      //     console.log('clicked')
      //     if (this.$refs.loginpassword.checked ) {
      //             this.$refs.loginpassword.type = "text";
      //         } else {
      //             this.$refs.loginpassword.type = "password";
      //         }
      //     },
      
      checkloginfields(){
          if(!this.username || !this.password){
              this.$refs.loginmsg.style.color='red';
              this.$refs.loginmsg.textContent='Wrong Credentials';
              return false;
          }
          return true
      },
      loginuser(){
          this.checkloginfields()
          console.log(this.username)
          console.log(this.password)
          console.log(this.isAdmin)
          axios.post('http://127.0.0.1:5173/api/signin', {
              username: this.username,
              password: this.password,
              role:this.isAdmin
              // Role:this.$refs.adminCheck.
          })
          .then(function (response) {
              console.log(response);

              const jsonresponse=JSON.parse(response.data)
              const token = jsonresponse.access_token;
              const role = jsonresponse.role;
              localStorage.setItem('token', token);

              console.log(token)
              let axiosconfig = {
                headers: {Authorization : `Bearer ${localStorage.getItem('token')}`}
              };
              if (response.status == 200 && role == 'Admin'){
                console.log('success')
                console.log(role)
                router.push('/admin')
              }
              else if(response.status == 200 && role == 'User'){
                console.log('success user')
                console.log('role')
                router.push('/usershome')
              }
              else{
                alert(jsonresponse.message)
                // console.log(response.data['message'])
                // console.log(typeof response.data)
                // console.log(response.data.message)
                console.log('None match')
              }

          })
          .catch(function (error) {
              console.log(error);
              alert(error)
          });
          
      }
  }, 
  watch:{
    username(newUsername) {
      this.disablelogin();
    },
    password(newPassword) {
      this.disablelogin();
    },
  }
  });
export {logins}  