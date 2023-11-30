import router from './main.js';
const axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
};
// var adminshow = Vue.component('adminshow', {template: `

// <div v-else-if='pageAddress=="edit"'class="container mt-5">
//   <form id='editshowform' @submit.prevent="editShow()">
//   <div class="a-box container">
//     <h1>Edit Show Details</h1>
//     <div class="form-group">
//       <label for="showName">Show Name:</label>
//       <input type="text" v-model="editShow.showname" class="form-control" id="showName" required>
//     </div>
  
//     <div class="form-group">
//       <label for="rating">Rating:</label>
//       <input type="number" v-model="editShow.rating" class="form-control" id="rating" min="1" max="10" step="0.1" required>
//     </div>
    
//     <div class="form-group">
//       <label for="time">Duration:</label>
//       <input type="time" v-model="editShow.duration" class="form-control" id="duration" required>
//     </div>
//     <div class="form-group">
//       <label for="dateTime">DateTime:</label>
//       <input type="datetime-local" v-model="editShow.dateTime" class="form-control" id="dateTime" min="2023-01-01T00:00" required>
//     </div>
  
//     <div class="form-group">
//       <label for="tags">Tags: Ex- a, b, c, d (Comma seperated)</label>
//       <input type="text" v-model="editShow.tags" class="form-control" id="tags" required>
//     </div>
  
//     <div class="form-group">
//       <label for="price">Price:</label>
//       <input type="number" v-model="editShow.price" class="form-control" id="price" required>
//     </div>
  
  
//     <button type="submit" class="btn btn-primary">Submit</button>
//     <router-link to ="/admin"><button type='button' class="btn btn-primary">Back</button></router-link>
    
//     </div>
//     </form>
//     </div>
//     <div v-else>
//       <h1>Invalid ACCEESS</h1>
//     </div>
//     `, 
//   data(){ return{
//     pageAddress:"",
    
//   }},
  
//   methods:{
    
//   },})
var adminsummary = Vue.component('adminsummary', {template: `<div class="container">
<h1 style="margin-left:35%;">Movie List</h1>
 
<br/>
<table class="table table-success table-striped"  border="1" cellpadding="10" cellspacing="0" width="100%" height="200" align="center" bgcolor="#e6e6e6">
    <caption>All Movies</caption>
<thead>   
<tr>
  <th> Theatre Name </th>
  <th> City </th>
  <th> Place </th>
  <th> Capacity </th>
  <th>No. of Shows</th>
  <th>Total Bookings</th>
  <th>Average Rating</th>
  <th>Export</th>
</tr>
</thead>
<tbody>
  <tr v-for="dataObj in dataoftheatre">
  <td v-text="dataObj['name']" ></td>
  <td v-text="dataObj['city']" ></td>
  <td v-text="dataObj['place']" ></td>
  <td v-text="dataObj['capacity']" ></td>
  <td v-text="dataObj['no_of_show']" ></td>
  <td v-text="dataObj['no_of_booking']" > </td>
  <td v-text="dataObj['rated']"></td>
  <td><button type="button" @click="exportdata(dataObj['id'], dataObj['name'], dataObj['city'], dataObj['place'], dataObj['capacity'], dataObj['no_of_show'], dataObj['no_of_booking'], dataObj['rated'])">Export</button></td>
  </tr>
</tbody>
</table>

</div>`,data(){
  return{
    dataoftheatre:[]
  }
},
 methods:{
  fetchsummary(){
    console.log("fetchsummary")
   axios.get('http://127.0.0.1:5173/api/venue',axiosConfig).then((response)=>{
        console.log(response)
        this.dataoftheatre = response.data
        // console.log(JSON.parse(response.data).message)
        if(response.data== []){
          alert("An error occurred")
        }
      }).catch((error)=>{console.error(error);alert(error)})
  },
  exportdata(id, name, city, place, capacity, no_of_show, no_of_booking, rated){
    console.log(id, name, city, place, capacity, no_of_show, no_of_booking, rated)
    axios.post('http://127.0.0.1:5173/api/job', {
      'id':id,
      "name":name,
      "city":city,
      "place":place,
      "capacity":capacity,
      'no_of_show':no_of_show,
      "no_of_booking":no_of_booking,
      "rated":rated
        // Role:this.$refs.adminCheck.
    },axiosConfig).then(function (response) {
        console.log(response)
        alert(response.data.message)
    }).catch((error)=>console.error(error))

  }
},

mounted(){
  this.fetchsummary()
}
})

var adminvenue = Vue.component('adminvenue', {template: `<div>
<div v-if='temp=="venueform"' class="container mt-5">
    <form id='newvenueform' @submit.prevent="newVenue()">
    <div class="a-box container">
      <h1 >New Venue Details</h1>
      <div class="form-group">
        <label for="venueName">Venue Name:</label>
        <input type="text" class="form-control" v-model='venuename' id="venueName" placeholder="Enter Venue Name" required>
      </div>

      <div class="form-group">
        <label for="location">Location:</label>
        <input type="text" v-model='venuelocation' class="form-control" id="location" placeholder="Enter Location" required>
      </div>

      <div class="form-group">
        <label for="place">Place:</label>
        <input type="text" v-model='venueplace' class="form-control" id="place" placeholder="Enter Place" required>
      </div>

      <div class="form-group">
        <label for="capacity">Capacity:</label>
        <input type="number" v-model='venuecapacity' class="form-control" id="capacity" min='1' placeholder="Enter Capacity" required>
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
      <button @click='updateTemp("infos")' class="btn btn-primary">Back</button>
      </div>
      </form>
 </div>
<div v-else-if='temp=="editvenueform"' class="container mt-5">
    <form id='editvenueform' @submit.prevent="editVenue()">
    <div class="a-box container">
      <h1>Edit Venue</h1>
      <div class="form-group">
        <label for="venueName">Venue Name:</label>
        <input type="text" class="form-control" v-model='eVenue.vName' id="venueName" placeholder="Enter Venue Name" required>
      </div>

      <div class="form-group">
        <label for="location">City:</label>
        <input type="text" v-model='eVenue.vLocation' class="form-control" id="location" placeholder="Enter Location" required>
      </div>

      <div class="form-group">
        <label for="place">Place:</label>
        <input type="text" v-model='eVenue.vPlace' class="form-control" id="place" placeholder="Enter Place" required>
      </div>

      <div class="form-group">
        <label for="capacity">Capacity:</label>
        <input type="number" v-model='eVenue.vCapacity' class="form-control" id="capacity" placeholder="Enter Capacity" required>
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
      <button  @click='updateTemp("infos")' class="btn btn-primary">Back</button>
      </div>
      </form>
 </div>
 <div v-else-if='temp=="addshowform"' class="container mt-5">
  <form id='showform' @submit.prevent="addShow()">
  <div class="a-box container">
    <h1>New Show Details</h1>
    <div class="form-group">
      <label for="showName">Show Name:</label>
      <input type="text" v-model="newShow.showname" class="form-control" id="showName" required>
    </div>
  
    <div class="form-group">
      <label for="rating">Rating:</label>
      <input type="number" v-model="newShow.rating" class="form-control" id="rating" min="1" max="10" step="0.1" required>
    </div>
    
    <div class="form-group">
      <label for="time">Duration:</label>
      <input type="time" v-model="newShow.duration" class="form-control" id="duration" required>
    </div>
    <div class="form-group">
      <label for="dateTime">DateTime:</label>
      <input type="datetime-local" v-model="newShow.dateTime" class="form-control" id="dateTime" required>
    </div>
  
    <div class="form-group">
      <label for="tags">Tags: Ex- a, b, c, d (Comma seperated)</label>
      <input type="text" v-model="newShow.tags" class="form-control" id="tags" required>
    </div>
  
    <div class="form-group">
      <label for="price">Price:</label>
      <input type="number" v-model="newShow.price" class="form-control" id="price" required>
    </div>
  
  
    <button type="submit" class="btn btn-primary">Submit</button>
    <button type='button' @click='updateTemp("infos");' class="btn btn-primary">Back</button>
    
    </div>
    </form>
  </div> 
<div v-else-if='temp=="editshowform"'class="container mt-5">
    <form id='editshowform' @submit.prevent="editShow()">
    <div class="a-box container">
      <h1>Edit Show Details</h1>
      <div class="form-group">
        <label for="showName">Show Name:</label>
        <input type="text" v-model="edit.name" class="form-control" id="showName" required>
      </div>
    
      <div class="form-group">
        <label for="rating">Rating:</label>
        <input type="number" v-model="edit.rating" class="form-control" id="rating" min="1" max="10" step="0.1" required>
      </div>
      
      <div class="form-group">
        <label for="time">Duration:</label>
        <input type="time" v-model="edit.duration" class="form-control" id="duration" required>
      </div>
      <div class="form-group">
        <label for="dateTime">DateTime:</label>
        <input type="datetime-local" v-model="edit.dateTime" class="form-control" id="dateTime" min="2023-01-01T00:00" required>
      </div>
    
      <div class="form-group">
        <label for="tags">Tags: Ex- a, b, c, d (Comma seperated)</label>
        <input type="text" v-model="edit.tags" class="form-control" id="tags" required>
      </div>
    
      <div class="form-group">
        <label for="price">Price:</label>
        <input type="number" v-model="edit.price" class="form-control" id="price" required>
      </div>
    
    
      <button type="submit" class="btn btn-primary">Submit</button>
      <button type='button' @click="updateTemp('infos')" class="btn btn-primary">Back</button>
      
      </div>
      </form>
      </div>

  <div v-else class="container mt-5"  style="margin-top:1rem!important; margin-bottom:1rem!important">
  <div  @click='updateTemp("venueform")' class="symbol-container">
  <svg xmlns="http://www.w3.org/2000/svg" weight='50' height='50' fill="blue" class="bi bi-plus-circle " viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
  </svg>
  </div>
  <div class="container mt-5" v-for="venue in venuedata" style="margin-top:1rem!important; margin-bottom:1rem!important">
  
  <div class="row ">
    <div class="p-1 card m-0" style="margin:0rem; width: max-content;margin-bottom:1.2rem!important">
      <div class="card-body">
        <h5 class="card-title"  v-text="'Ref. ' + venue[0].id"></h5>
        <h6 class="card-subtitle mb-2 text-primary" v-text="venue[0].name"></h6>
          <p class="m-0 text-primary" v-text="'Place '+venue[0].place"></p>
          <p class="m-0 text-primary" v-text="' City   '+venue[0].city"></p>
          <p class="m-0 text-primary" v-text="'Total Capacity :  '+venue[0].capacity"></p>
        <div  v-if="venue.length >1"> 
        <p>Shows:</p>
        <div style="background-color:lightgreen;border-width:1px;border-style:solid" v-for="show in venue.slice(1)">
        <div class="p-0 card" style='display:contents'>
          <div class="p-0 card-body">
            <p class="m-0 text-primary" v-text='"Name- "+show.name+",Duration- "+show.duration+", Rating- "+show.rating'> </p>
            <p class="m-0 text-primary" v-text='"Tags- "+show.tags+",Price- "+show.price'> </p>
            <a class="btn btn-info show"  @click="updateTemp('editshowform');editShowData(show)" style="padding:0.1rem; margin:.1rem">Edit Show</a>
           <a class="btn btn-info show" @click='deleteShow(venue[0].id, show.id)' style="padding:0.1rem; margin:.1rem">Delete</a>
          </div>
        </div>
        </div> 
    </div>
    <div v-else><h4>No Shows</h4></div>
      
        <a class="btn btn-primary venue-link" @click="updateTemp('addshowform');linkVenue(venue[0].id);" >Add Show</a>
        <a class="btn btn-primary venue-link" @click="updateTemp('editvenueform');editVenueData(venue)" >Edit</a>
        <a class="btn btn-primary venue-link" @click="deleteVenue(venue[0].id)" >Delete</a>
      </div>
    </div> 
    </div>
    
  </div>
  </div>
  </div>`, data(){return{
  temp:'infos',
  venuedata:[],
  newShow: {
    linkVID:0,
    showname: '',
    rating: 1,
    duration: new Date(),
    dateTime:new Date(),
    tags: [],
    price: 0,
  },
  edit:{
    id:0,
    name:'',
    rating:0,
    duration: new Date(),
    dateTime:new Date(),
    tags: [],
    price: 0,
  },

  eVenue:{
  vID:Number(),  
  vCapacity:0,
  vPlace:'',
  vName:'',
  vLocation:'',
  },
  venuecapacity:0,
  venueplace:'',
  venuename:'',
  venuelocation:'',
  // venuedata:[],
  

 }}, 
methods:{
  editShow(){
    axios.patch('http://127.0.0.1:5173/api/show', {
      id:this.edit.id,
      name:this.edit.name,
      rating:this.edit.rating,
      duration:this.edit.duration,
      dateTime:this.edit.dateTime,
      tags:this.edit.tags,
      price:this.edit.price,
        // Role:this.$refs.adminCheck.
    },axiosConfig).then(function (response) {
        console.log(response)
        alert(JSON.parse(response.data).message);
        // this.updateTemp("infos")
    }).catch((error)=>console.error(error))
    // this.fetchVenue()
    this.updateTemp("infos")
  },
  deleteShow(e,f){
    let y= confirm("Are you sure you want to delete this show?");
    if (!y){
      return false
    }
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      data: {
        "VenueId":e,
        "ShowId":f
        // vId: vId
      }
    };
    axios.delete('http://127.0.0.1:5173/api/show',axiosConfig).then((response)=>{
      console.log(response)
      console.log(response.message)
      console.log(response.data)
      location.reload()
      // this.fetchVenue()
}).catch((error)=>{console.error(error)})},
  reqlocation(d){
    adminshow.options.data.pageAddress=d
  console.log(adminshow.options.data.pageAddress)
  },
  linkVenue(a){
    this.newShow.linkVID=a
    console.log(a)
    // console.log(a)
  },

  editShowData(f){
    console.log(f)
    this.edit.id=f.id,
    this.edit.name=f.name
    this.edit.rating=f.rating
    this.edit.duration=f.duration
    this.edit.dateTime=f.dateTime
    this.edit.tags=f.tags
    this.edit.price=f.price
  },
  
  updateTemp(p){
    this.temp=p;
    if(p == "infos"){
      location.reload()
    }
  },
  addShow(){

    if (this.newShow.showname=="" || this.newShow.rating=="" || this.newShow.duration==''|| this.newShow.datetime=="" || this.newShow.tags==""|| this.newShow.price <=0){
      return false
    }

    axios.post('http://127.0.0.1:5173/api/show', {
      linkVID:this.newShow.linkVID,
      showname:this.newShow.showname ,
      ratings:this.newShow.rating,
      duration:this.newShow.duration,
      dateTime:this.newShow.dateTime,
      tags:this.newShow.tags,
      price:this.newShow.price,
        // Role:this.$refs.adminCheck.
    },axiosConfig).then(function (response) {
        console.log(response)
        alert(JSON.parse(response.data).message);
}).catch((error)=>console.error(error))
  },

  editVenue(){
    axios.patch('http://127.0.0.1:5173/api/venue', {
        id:this.eVenue.vID,
        capacity:this.eVenue.vCapacity,
        place:this.eVenue.vPlace,  
        name:this.eVenue.vName, 
        location:this.eVenue.vLocation,
          // Role:this.$refs.adminCheck.
      },axiosConfig).then(function (response) {
          console.log(response)
          alert(JSON.parse(response.data).message);
          // this.updateTemp("infos")
  }).catch((error)=>console.error(error))
  // this.fetchVenue()
  this.updateTemp("infos")
  },
  editVenueData(venue){
    console.log(venue[0])
    this.eVenue.vID=venue[0].id
    this.eVenue.vCapacity=venue[0].capacity
    this.eVenue.vPlace=venue[0].place
    this.eVenue.vLocation=venue[0].city
    this.eVenue.vName=venue[0].name
  },

  deleteVenue(vId){
    // console.log(this.$root.$options.components.admin.options.methods.deleteVenue(vId))
    console.log(vId)
    admin.options.methods.deleteVenue(vId)
    this.fetchVenue()
    // this.$root.deleteVenue(vId)
  },
  newVenue(){
    this.fetchVenue()
    axios.post('http://127.0.0.1:5173/api/venue',{
        capacity:this.venuecapacity,
        place:this.venueplace,
        name:this.venuename,
        city:this.venuelocation,
          // Role:this.$refs.adminCheck.
      }, axiosConfig).then(function (response) {
          console.log(response)
          alert(JSON.parse(response.data).message);
  }).catch((error)=>console.error(error))
  }
  ,  
  fetchVenue(){
      axios.get('http://127.0.0.1:5173/api/show',axiosConfig).then((response)=>{
        this.venuedata = JSON.parse(response.data).data
        console.log(this.venuedata)
      }).catch((error)=>{console.error(error);console.log(error.response.data.msg); if(error.response.data.msg=='Token has expired'){ alert(`${error.response.data.msg}. Signing Out`); admin.options.methods.logoutAdmin()}})
    }

      
    
},mounted(){
  this.fetchVenue();
  ()=>{if(this.venuedata==[]){alert("Create a venue by clicking the plus icon")}};
}
})
var footerview = Vue.component('footerview', {template: `<footer >
<ul class="footerlist">
    <li><b>About</b></li>
    <li><a  href="#" >Terms and Condition</a></li>
    <li><a  href="#" >Privacy Policy</a></li>
    <li><a  href="#" >Purchase Policy</a></li>
</ul>
<ul class="footerlist">
    <li class="heading" ><b>Choose Language</b></li>
    <li class="lang selected" >English</li>
    <li class="lang" >Malayalam</li>
    <li class="lang" >Tamil</li>
</ul>
<ul class="footerlist">
    <li class="heading" ><b>Upcoming Movies</b></li>
    <li class="lang selected" >Movie 1</li>
    <li class="lang" >Movie 2</li>
    <li class="lang" >Movie 3</li>
</ul>


<ul class="footerlist">
    <li class="heading" >Apps</li>
    <li ><a href="#" ><img alt="Get it on Google Play" src="https://data.justickets.co/assets/en-play-badge.png" data-reactid=".0.2.2.1.0.0" height="30px" width="121px"></a></li>
    <li ><a href="#" ><img alt="Download on the App Store" src="https://cdn.freebiesupply.com/logos/large/2x/available-on-the-app-store-logo-png-transparent.png" height="30px" width="121px"></a></li>
    
</ul>    
<ul class="footerlist">
<li><b>Mail-to</b></li>
<li><a href="#">hege@example.com</a></li>

<li>Alan Shepard</li>
</ul>


</footer>`})
var admin = Vue.component('admin', {
template: `<div id='admindiv'>
<nav class="navbar sticky-top bg-gradient navbar-expand-lg bg-body-tertiary " id="header">
<div class="container-fluid">
    <a class="navbar-brand" href="#"><img src="../static/logo.png" alt="Comany Logo" width="80" height="40" title="Movie N More"></a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">

            <li  class="nav-item">
                <router-link to ="/admin"><a class="btn btn-success" style="margin:.5rem">Home</a></router-link>
            </li>    
            
            <li  class="nav-item">
                <router-link to="/admin/summary"><a class="btn btn-success" style="margin:.5rem">Summary</a></router-link>
            </li>
        </ul>  
        <form @submit.prevent='logoutAdmin()' >
            <button type="submit" id='eraseIsCityAsked' value='Logout' name='logout' class="btn btn-danger">Logout<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-power" viewBox="0 0 16 16">
              <path d="M7.5 1v7h1V1h-1z"/>
              <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812z"/>
            </svg></button>
        </form>
</div>
</div>
</nav>   
<router-view ></router-view>
<footerview></footerview>

</div>`,
    data(){
        return {

          location:'adminhome',
          showform:false,
          venueform:false,
          venuecapacity:0,
          venueplace:'',
          venuename:'',
          // venuedata:[],
          venuelocation:'',
        }
    },
    computed:{
      // pageupdate(locate){
      //   return this.location=locate
      // }
    },
    methods:{
      pageupdate(locate){
        this.location=locate
        return true
      },
      logoutAdmin(){
        axios.get('http://127.0.0.1:5173/checkauth', axiosConfig).then(function (res){
            //     console.log(res);
            if (JSON.parse(res.data.message)== true){
              console.log(res)
              console.log(res.data)
            console.log(axiosConfig)
          axios.post('http://127.0.0.1:5173/api/signout', {'':''}, axiosConfig).then(function(response){
            console.log(response)
            // console.log(response.data)
            
            // console.log(response.data.message)
            if((response.data.message)=="Successfully logged out"){
              localStorage.removeItem('token')
              console.log(localStorage.getItem('token'))
              router.push('/login')
            }
          }).catch((error)=>{alert(error);console.error(error)})
          // console.warn(res.data)
          // console.warn(res.data.message)
        }
        else{
        router.push('/admin')
        }

        }).catch((err)=>{alert(err);localStorage.removeItem('token');router.push('/login');console.error(err)});
      },
      logoutAdmin(){
        axios.get('http://127.0.0.1:5173/checkauth', axiosConfig).then(function (res){
            //     console.log(res);
            if (JSON.parse(res.data.message)== true){
              console.log(res)
              console.log(res.data)
            console.log(axiosConfig)
          axios.post('http://127.0.0.1:5173/api/signout', {'':''}, axiosConfig).then(function(response){
            console.log(response)
            // console.log(response.data)
            
            // console.log(response.data.message)
            if((response.data.message)=="Successfully logged out"){
              localStorage.removeItem('token')
              console.log(localStorage.getItem('token'))
              router.push('/login')
            }
          }).catch((error)=>{alert(error);console.error(error)})
          // console.warn(res.data)
          // console.warn(res.data.message)
        }
        else{
        router.push('/admin')
        }

        }).catch((err)=>{alert(err);localStorage.removeItem('token');router.push('/login');console.error(err)});
      },
      newVenue(){
        axios.post('http://127.0.0.1:5173/api/venue', {
            capacity:this.venuecapacity,
            place:this.venueplace,
            name:this.venuename,
            location:this.venuelocation,
              // Role:this.$refs.adminCheck.
          }).then(function (response) {
              console.log(response)
              alert(JSON.parse(response.data).message);
      }).catch((error)=>console.error(error))
      },
      

        deleteVenue(vId){
          let y= confirm("Are you sure you want to delete this venue?");
          if (!y){
            return false
          }
          let axiosConfig2 = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            data: {
              "VenueId":vId
              // vId: vId
            }
          };

          axios.delete('http://127.0.0.1:5173/api/venue',axiosConfig2).then((response)=>{
            console.log(response)
            console.log(response.message)
            console.log(response.data)
            // fetchVenue()
}).catch((error)=>{console.log(error)})}
        
        },
        mounted(){
          // this.fetchVenue();
        },
        watch: {
          venueform : function(val){
              alert("Add a new Venue by clicking the plus icon")
          }
        }      
  })
      
 export {admin, adminvenue, adminsummary};   