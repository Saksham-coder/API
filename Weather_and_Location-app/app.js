function locate(){
    fetch('https://ipapi.co/json/')
    .then(response =>{
        return response.json();
    })
    .then(data => {
        a = data.city
        document.querySelector(".city").innerText = data.city;
        document.querySelector(".ip").innerText = data.ip;
    }).then( weather => {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${a}&appid=23fc2124709b1501ef16fd1cd66d0fa7`)
      .then(res =>{
        return res.json();
      })
      .then( data =>{
        description =  data.weather[0].description;
        icon = data.weather[0].icon;
        document.querySelector(".description").innerText = description
        imageURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png"
        document.querySelector(".temp1").innerText = `${Math.round(data.main.temp-273.15)}`;
        document.querySelector(".imageput").src = imageURL;
      })
    }) 
  }
  
var l =  locate();
    x=navigator.geolocation;
    x.getCurrentPosition(success,failure);
    function success(position){
      var myLat=position.coords.latitude;
      var myLong=position.coords.longitude;
      var coords=new google.maps.LatLng(myLat,myLong);
      var mapOptions={
        zoom:9,
        center:coords,
        mapTypeId:google.maps.MapTypeId.ROADMAP
      }
      var map=new google.maps.Map(document.getElementById("map"),mapOptions);
      var marker = new google.maps.Marker({map:map,position:coords});
    }
    function failure(){}


