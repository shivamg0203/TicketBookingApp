import router from './main.js';
import footerview from './footer.js'



const axiosconfig = {
  headers: {Authorization : `Bearer ${localStorage.getItem('token')}`}
};

var usershome = Vue.component('UserHome', {
  template: `<div id='userhome'><nav class="navbar sticky-top bg-gradient navbar-expand-lg bg-body-tertiary " id="header">
  <div class="container-fluid">
      <a class="navbar-brand" href="#"><img src="../static/logo.png" alt="Comany Logo" width="80" height="40" title="Movie N More"></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item ">
              <router-link to="/usershome"><a class="nav-link active skewwing" aria-current="page">Home</a></router-link>
              </li>
              <li class="nav-item">
                  <router-link to="/user/order"><a class="nav-link skewwing">Orders</a></router-link>
              </li>
              <li class="nav-item">
                  <router-link to="/user/profile"><a class="nav-link skewwing">Profile</a></router-link>
              </li>
            
          </ul>
          <div class="searchinnav">
            <form class="d-flex" @submit.prevent="filterVbylocation(selectedLocation)">
              <select class="form-control" v-model="selectedLocation">
                <option value="All" >All</option>
                <option v-for="location in locationList":key="location" :value="location">{{ location }}</option>
              </select>
              <button class="btn btn-outline-success" type="submit">Search</button>
            </form>
          </div>
                         
          <div class="searchinnav">
              <form class="d-flex" @submit.prevent="filterVbytag(selectedTag)" >
              <select class="form-control" v-model="selectedTag">
                  <option value="All" >All</option>
                  <option  v-for="tag in tagList" :key="tag" :value="tag">{{ tag }}</option>
                </select>
                <button class="btn btn-outline-success" name="moviesearch" type="submit">Search</button>
            </form>
        </div>
          <form @submit.prevent='logoutUser()'>
            <button type="submit" value='Logout9' name='logout' class="btn btn-danger">Logout<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-power" viewBox="0 0 16 16">
              <path d="M7.5 1v7h1V1h-1z"/>
              <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812z"/>
            </svg></button>
          </form>
  </div>
  </div>
  </nav>
  
  <div class="carousel" id="allsjow">
  <!-- <h2>Other Shows</h2> -->
  <div v-for="venue in venuedata"  class="carousel-container" style="justify-content:center!important">
  
    <div class="card mb-3" style="width:60rem">
      <div class="card-body">
        <h5 class="card-title">Venue Details</h5>
        <p class="card-text text-secondary" v-text='"Venue Place :  "+venue[0].place+",  City :  "+venue[0].city+", Total Capacity :  "+venue[0].capacity+", Name: "+venue[0].name' ></p>

        <div class="card" v-if="venue.length >1"> 
          <div style="background-color:#d8d8d8;border-width:1px;border-style:solid" v-for="show in venue.slice(1)">
          <div class="p-0 card" style='display:contents'>
          <p class="m-0 text-primary" v-text='"Name " +show.name+", Rated "+show.rating'></p>
          <p class="m-0 text-primary" v-text='"Price: "+show.price'></p>
          <p class="m-0 text-primary" v-text='"Duration: "+show.duration+"hr"'></p>
          <p class="m-0 text-primary" v-text='"Seat Available "+show.seat_available'></p>
          <template v-if="show.seat_available>0">
          <router-link :to='"user/book/"+venue[0].id+"/"+show.id'>
              <button type="button" style="padding-left:3rem" class="text-info">
                  Book Now
              </button>
          </router-link>
          </template>
          <template v-else>
              <button type="button" style="padding-left:3rem" class="text-info" disabled>
                  Already Booked
              </button>
          </template>

          <!--<router-link :to='"user/book/"+venue[0].id+"/"+show.id'><button type="button" style="padding-left:3rem" class="text-info">Book</button></router-link>-->
          </div>
          </div> 
        </div>
        <div v-else>
        <h2 class="text-secondary">No Shows Present</h2>  
        </div>
      </div>
    </div>
  </div>
</div>
  <footerview></footerview>
  </div>`,
  data(){
    return {
        priceList:[],
        locationList:[],
        // newvenuelist:[],
        selectedTag:"All",
        selectedLocation:"All",
        venuedata:[],
        value:'',
        type:'',
        tagList:[]
    }
  },
  methods:{
    fetchVenue(){
      console.log(this.$root)
        let axiosconfig = {
          headers: {Authorization : `Bearer ${localStorage.getItem('token')}`}
        };
        axios.get('http://127.0.0.1:5173/api/show',axiosconfig).then((response)=>{
    
          this.venuedata = JSON.parse(response.data).data
          console.log(this.venuedata)
          localStorage.setItem('allvenuedata',JSON.stringify(this.venuedata))
          localStorage.getItem('allvenuedata')
          // return this.venuedata
          // console.log(vendata)
        }).catch((error)=>{console.error(error);console.log(error.response.data.msg); if(error.response.data.msg=='Token has expired'){ alert(`${error.response.data.msg}. Signing Out`); home.options.methods.logoutUser()}})
      },
      logoutUser(){
        let axiosconfig = {
          headers: {Authorization : `Bearer ${localStorage.getItem('token')}`}
        };
        axios.get('http://127.0.0.1:5173/checkauth', axiosconfig).then(function (res){
            //     console.log(res);
        localStorage.removeItem('token')
        if (JSON.parse(res.data.message).message== true){
          console.log(localStorage.getItem('token'))
          // console.warn(res.data)
          // console.warn(res.data.message)
        router.push('/login')
        }
        else{
        router.push('/login')
        }

        }).catch((err)=>{alert(err);localStorage.removeItem('token');router.push('/login');console.error(err)});
      },
      getTagsAndLocations(){
        axios.get('http://127.0.0.1:5173/getlist',axiosconfig).then((response)=>{

          console.log(response.data)
          this.priceList=response.data.price
          this.locationList=response.data.location
          this.tagList= response.data.tag
        }).catch((error)=>{console.error(error);console.log(error.response.data.msg); if(error.response.data.msg=='Token has expired'){ alert(`${error.response.data.msg}. Signing Out`); home.options.methods.logoutUser()}})

      },
      filterVbytag(f){
        // user.options.methods.venuebylocation("price",f)
        console.log(this.venuedata)
        this.venuebylocation("tag", f)
        // this.venuebylocation('price',f)
      },
      filterVbylocation(p){
        console.log(this.venuedata)
        this.venuebylocation("location", p)
        // this.venuebylocation('location',p)
        // console.log(this)
        // user.options.methods.venuebylocation("location",p)
      },
      venuebylocation(type,f){
        console.log(this)
        console.log(this.venuedata)
        // console.log(user.options.data().venuedata)
        console.log(JSON.stringify(this.venuedata))
        axios.get(`/userfiltervenue/${type}/${f}`, axiosconfig)
        .then(response => {
          console.log(response)
          console.log(response.data)
          console.log(response.data.data)
          console.log(this.venuedata)
          console.log()
          this.venuedata = response.data.data
          // Vue.set(user.options.data().venuedata, response.data.data); // Assuming the response contains an array
          // user.options.data().venuedata = JSON.parse(response.data).data; // Assuming the response contains an array
        })
        .catch(error => {
          console.error(error);
        });
      },
      
  },
  mounted(){
    this.getTagsAndLocations()
    this.fetchVenue()
  }
})


var home = Vue.component('Home', {
template: `<div id='userhome'><nav class="navbar sticky-top bg-gradient navbar-expand-lg bg-body-tertiary " id="header">
<div class="container-fluid">
    <a class="navbar-brand" href="#"><img src="../static/logo.png" alt="Comany Logo" width="80" height="40" title="Movie N More"></a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item ">
            <router-link to="/usershome"><a class="nav-link active skewwing" aria-current="page">Home</a></router-link>
            </li>
            <li class="nav-item">
                <router-link to="/user/order"><a class="nav-link skewwing">Orders</a></router-link>
            </li>
            <li class="nav-item">
                <router-link to="/user/profile"><a class="nav-link skewwing">Profile</a></router-link>
            </li>
          
        </ul>
        <!--<div class="searchinnav">
          <form class="d-flex" @submit.prevent="filterVbylocation(selectedLocation)">
            <select class="form-control" v-model="selectedLocation">
              <option value="All" >All</option>
              <option v-for="location in locationList":key="location" :value="location">{{ location }}</option>
            </select>
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>-->
                       
        <!--<div class="searchinnav">
            <form class="d-flex" @submit.prevent="filterVbytag(selectedTag)" >
            <select class="form-control" v-model="selectedTag">
                <option value="All" >All</option>
                <option  v-for="tag in tagList" :key="tag" :value="tag">{{ tag }}</option>
              </select>
              <button class="btn btn-outline-success" name="moviesearch" type="submit">Search</button>
          </form>
      </div>-->
        <form @submit.prevent='logoutUser()'>
          <button type="submit" value='Logout9' name='logout' class="btn btn-danger">Logout<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-power" viewBox="0 0 16 16">
            <path d="M7.5 1v7h1V1h-1z"/>
            <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812z"/>
          </svg></button>
        </form>
</div>
</div>
</nav>

<router-view></router-view>
<footerview></footerview>
</div>`,
    data(){
        return {
          // allvenuedata:localStorage.getItem('allvenuedata')
          priceList:[],
          locationList:[],
          newvenuelist:[],
          selectedTag:"All",
          selectedLocation:"All",
          tagList:[]
        }
    },
    methods:{
      logoutUser(){
        let axiosconfig = {
          headers: {Authorization : `Bearer ${localStorage.getItem('token')}`}
        };
        axios.get('http://127.0.0.1:5173/checkauth', axiosconfig).then(function (res){
            //     console.log(res);
        localStorage.removeItem('token')
        if (JSON.parse(res.data.message).message== true){
          console.log(localStorage.getItem('token'))
          // console.warn(res.data)
          // console.warn(res.data.message)
        router.push('/login')
        }
        else{
        router.push('/login')
        }

        }).catch((err)=>{alert(err);localStorage.removeItem('token');router.push('/login');console.error(err)});
      },

      getTagsAndLocations(){
        axios.get('http://127.0.0.1:5173/getlist',axiosconfig).then((response)=>{

          console.log(response.data)
          this.priceList=response.data.price
          this.locationList=response.data.location
          this.tagList= response.data.tag
        }).catch((error)=>{console.error(error);console.log(error.response.data.msg); if(error.response.data.msg=='Token has expired'){ alert(`${error.response.data.msg}. Signing Out`); home.options.methods.logoutUser()}})

      },
      filterVbytag:(f)=>{
        user.options.methods.venuebylocation("tag",f)
        console.log(this)
        // this.venuebylocation('price',f)
      },
      filterVbylocation:(p)=>{
        // this.venuebylocation('location',p)
        console.log(this)
        user.options.methods.venuebylocation("location",p)
      },


    },
    watch:{
      
    },
    mounted(){

      this.getTagsAndLocations()

      // user.options.methods.fetchVenue()
    }
  })


  var bookticket=
  Vue.component('bookticket', {template: 
    `<div><div class="a-box container">
    <form @submit.prevent="confirmBooking">

      <div class="form-group mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="text" v-model="name" class="form-control" disabled >
      </div>
      <div class="form-group mb-3">
        <label for="available_seat" class="form-label">Available Seats</label>
        <input type="number" v-model="seats" class="form-control" disabled >
      </div>
      <div class="form-group mb-3">
        <label for="number" class="form-label">Number of Seats</label>
        <input type="number" v-model="noOfSeat" class="form-control" >
      </div>
      <div class="form-group mb-3">
        <label for="price" class="form-label">Price per Seat</label>
        <input type="text" v-model="price" class="form-control" disabled >
      </div>
      <div class="form-group mb-3">
        <label for="total" class="form-label">Total Price</label>
        <input type="number" v-model="total" class="form-control" disabled >
      </div>
      <button type="submit" class="btn btn-primary">Confirm Booking</button>
    </form>
  </div>
  </div>`,
  data(){
    return{
      par:this.$route.params.pathMatch,
      total:0,
      noOfSeat:0,
      duration: new Date(),
      name: '',
      tags:'',
      price: 0,
      seats: 1,
      rating: 0,
    }
  },
  methods:{
    
    getroute(){
      console.log(this.$route.params.pathMatch)
    },
    confirmBooking(){
      let Vid =Number(this.par.split('/')[0])
      let Sid =Number(this.par.split('/')[1])
      if (this.seats<this.noOfSeat || this.seats==0 || this.noOfSeat==0){
        alert("Invalid number of seats")
        return false
      }
      let axiosconfig = {
        headers: {Authorization : `Bearer ${localStorage.getItem('token')}`},
        data: {
          // 'VId':q,
          'SId':Sid,
          'VId':Vid,
          'Seats':this.noOfSeat
        }
      };
      axios.post('http://127.0.0.1:5173/api/order', axiosconfig.data, axiosconfig).then(function(response){
            console.log(response.data)
            console.log(JSON.parse(response.data))
            alert(JSON.parse(response.data).message)
            router.push('/usershome')
      }).catch((error)=>{alert(error);console.error(error)})

    },
    async fetchData(){
      // this.fetchVenue()
      for (const venue of JSON.parse(localStorage.getItem('allvenuedata'))){
        if (venue[0].id==Number(this.par.split('/')[0])){
          console.log(venue)
        for (let i = 1; i < venue.length; i++) {
          if (venue[i].id==Number(this.par.split('/')[1])){
            console.log(venue[i].id)
            console.log(venue[i])
            this.price=venue[i].price
            this.name=venue[i].name
            this.duration=venue[i].duration
            this.rating=venue[i].rating
            this.tags=venue[i].tags
            this.seats=venue[i].seat_available
            this.dateTime=venue[i].dateTime
            console.log(this.name)
            console.log("Updatedfound")
          }
        }  
       
        }
      }
    },
  },
   mounted(){
 
    this.fetchData()
  }, 
  watch:{
    noOfSeat(newValue, oldValue) {
      
      this.total = newValue*this.price
      console.log(`Value changed from ${oldValue} to ${newValue}`);
  }
  }
})

  var allorder=Vue.component('user', {template:`<div>
  <div v-if="orderData[0]!=undefined" class="container mt-5">
  <h2 class="text-secondary">Data Showcase</h2>
  <table  class="table table-bordered">
      <thead>
          <tr>
              <th>Venue Name</th>
              <th>Show Name</th>
              <th>Time</th>
              <th>Seats</th>
              <th>Rated</th>

          </tr>
      </thead>
      <tbody v-for="od in orderData">
          <tr>
              <td v-text='od.theatre_name'></td>
              <td v-text='od.show_name'></td>
              <td v-text='od.show_time'></td>
              <td v-text='od.seats'></td>
              <td ><template v-if="od.rated === 0">
                <button class="btn btn-sm btn-primary" @click="rateShow(od)">Rate Now</button>
                </template>
                <template v-else>
                  {{ od.rated }}
                </template></td>
          </tr>
          <!-- Repeat more rows as needed -->
      </tbody>
  </table>
</div>
<div v-else>
<h1 style="justify-content:center!important;color:wheat;display:flex;"> No Data to Show</h1>
</div>
  </div>`
  ,data() {
    return {
        p: 'p',
        orderData:[],
        data:[],
        timing:'',
        showName:'',
        venueName:'',
        seats: 0
    };
},
methods: {
    fetchOrders() {
      let axiosconfig = {
        headers: {Authorization : `Bearer ${localStorage.getItem('token')}`}
      };
        axios.get('http://127.0.0.1:5173/api/order', axiosconfig)
            .then((response) => {
                this.orderData=response.data
                console.log(this.orderData)
                
            }).catch((error) => {
                console.error(error);
                console.log(error.response.data.msg);
                if (error.response.data.msg == 'Token has expired') {
                    alert(`${error.response.data.msg}. Signing Out`);
                    home.options.methods.logoutUser();
                }
            });
    },
    rateShow(od){
      let u= prompt('Enter a rating from 1 to 10')
      let axiosConfig = {
        headers: {Authorization : `Bearer ${localStorage.getItem('token')}`}
      };
      if (this.validateDecimalInput(u)) {
        
        axios.patch('http://127.0.0.1:5173/api/order', {
            id:od.id,
            rated:u
              // Role:this.$refs.adminCheck.
          },axiosConfig).then(function (response) {
              console.log(response)
              alert(JSON.parse(response.data).message);
              location.reload()
              // this.updateTemp("infos")
      }).catch((error)=>console.error(error))


        console.log("Input is valid!");
      } else {
        alert("You entered out of range value");
      }
    },
    validateDecimalInput(input) {
      const value = parseFloat(input);
      if (!isNaN(value) && value >= 1 && value <= 10 && value === Math.round(value * 10) / 10) {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted(){
    this.fetchOrders()
  }
  })

  var userprofile = Vue.component('userprofile', {
    template: `<div>
    <div class="profile">
      <div class="user-icon">
        <img src="../static/user-icon.png" alt="User Icon">
      </div>
      <div class="user-details">
        <h2 class="text-primary" v-text='data.name'>  </h2>
        <p class="text-primary" v-text='data.email'>  </p>
        <p class="text-primary" v-text='data.role'>  </p>
        <p class="text-primary" v-text='data.role_desc'>  </p>
        <p class="text-primary" v-text='"You will receive your monthly report in the beginning of every month on your "+data.email'> </p>
        <!-- Add other user details here -->
      </div>
      </div>
      </div>`,
    data(){

    return {
      data:[],
      page:true,
      isChecked: Boolean()
    }
  },
  methods:{
    getuserdata(){
    axios.get('http://127.0.0.1:5173/api/signin', axiosconfig).then((res)=>{
      this.data=res.data
      console.log(this.data)

      }).catch((err)=>{console.log(err)});
    },
    

      },
      mounted(){
        this.getuserdata()
      },
      watch: {
    }})

 export {home, bookticket, allorder, userprofile, usershome};   