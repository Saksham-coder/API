function locate(){
    fetch('https://ipapi.co/json/')
    .then(response =>{
        return response.json();
    })
    .then(data => {
        console.log(data)
        console.log(data.ip)
        document.querySelector("p").innerText = data.ip;
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


