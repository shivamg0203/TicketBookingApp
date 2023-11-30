import router from './main.js';
var signup = Vue.component('signup', {
    template: `
    <div id='signupdiv'>
    <nav class="navbar sticky-top bg-gradient navbar-expand-lg bg-body-tertiary " id="header">
        <div class="container-fluid">
            <a class="navbar-brand" href="#"><img src="../static/logo.png" alt="Comany Logo" width="80" height="40" title="Movie N More"></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            
        </div>
    </nav>
    <form  @submit.prevent="signup()" > 
    <div class="a-box container width=device-width">
        <h1 v-text='create'></h1>
        <div class="form-group">
        <label for="exampleFormControlInput1">Username</label>
        <input v-model="uname"  type="username" class="form-control" id="username" name="signupusername" placeholder="Username" >
        </div>
        
        <div class="form-group">
            <label for="exampleFormControlInput1">Password</label>
            
            <label for="exampleFormControlInput1" ref="infobutton"></label>
            <input v-model="pword" type="password" class="form-control" id="signuppassword" name="signuppassword" placeholder="Type Password">
        </div>
        
        <div class="form-group">
            <label for="exampleFormControlInput1">Confirm Password</label>
            <label for="exampleFormControlInput1" ref="forinfo"></label>
            <input v-model="checkpword" type="password" class="form-control" id="signupconfirmpassword" name="signupconfirmpassword" placeholder="Retype Password" >
        </div>
        
        <div class="form-group">
            <label for="exampleFormControlInput1">Email</label>
            <input v-model="email" type="email" class="form-control" id="signupemail" name="signupemail" placeholder="Email Address" >
        </div>

        
        <div class="_9bq4">
            <router-link to="/login"><a aria-label="Don't have an account? Create Now." class="_9bq5">Already have your account? Sign-in Now</a></router-link>
            
        </div>
        <br/>
        <button type="submit" class="btn btn-block btn-success w-100">Submit</button>
        <br/>   
    <br/>   
    </div> 
    <br/>   
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
        uname: '',
        pword: '',
        checkpword: '',
        email: '',
        create: 'Create Account'
      };
    },
    methods: {
      signup() {
        this.passlen();
        this.checkpass();
        this.createaccount();
      },

      passlen() {
        let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;   //password must have atleast 1 alphabetical character, 1 digit and 1 symbol and length greter than 8 
        let k = this.$refs.infobutton;
        if (!passwordRegex.test(this.pword)) {
          k.innerHTML = 'Must be at least 8 chars long.';
          k.style.color = 'red';
        } else {
          return true;
        }
      },
      checkpass() {
        let k = this.$refs.forinfo;
        if (this.passlen) {
          if (this.checkpword != this.pword) {
            k.innerHTML = 'Password Do Not Match';
            k.style.color = 'red';
          } else return true;
        } else return false;
      },
      createaccount() {
        if(!this.checkpass()){
          alert('Passwords didn\'t match')
          return false;
        }
        if(!this.passlen()){
          alert('Password Must be at least 8 chars long.')
          return false;
        }
        axios
          .post('http://127.0.0.1:5173/api/', {
            username: this.uname,
            password: this.pword,
            email: this.email
          })
          .then(function(response) {
            console.log(response);
            let jsonresponse = JSON.parse(response.data)
            console.log(response.status);
            if (jsonresponse.message == 'Success! Account Created' && response.status==200){
              alert(jsonresponse.message+' Logging User')  
            }
            else{
              alert(jsonresponse.message)
              // router.push('/')
            }
          })
          .catch(function(error) {
            console.log(error);
            alert(error)
          });
  
        console.log(this.uname);
        console.log(this.pword);
        console.log(this.checkpword);
        console.log(this.email);
      },
    },
    
    watch:{

    },
  });
  
export {signup}  
  
    