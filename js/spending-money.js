var clock;
var lat = 0;
var lon = 0;
var username = getCookie("username");
var map;
var citymap = [[38.986918, -76.942554, 15]];
var tableData = "";
var currentAllowance = -1;
var atmMachines = [];

$(document).ready(function(){
    Parse.initialize("zzdE55sBIepHMixSzU0qrjyTksfhO8WrcoYq7aFD",
                   "u9jsLS5Njj9UC0RsEyRIdUcOzB91vSiBnf3RZbpT");

    loadSendMoney();

    google.maps.event.addDomListener(window, 'load', initialize);

    runClock();

    $(".username").html(getCookie("username")).show();
});

function openApp(){
  if(currentAllowance == 0){
    alert("Error: Insufficient Funds.");
  } else {
    tlat = lat.toString().replace(".", "%2E");
    tlon = lon.toString().replace(".", "%2E");
    var url = "allowance://allowance.com/?accountName="+username+"&lat="+tlat+"&lon="+tlon;
    //alert(url);
    //window.location.href = url;
    window.location = url;
  }
  
}

function runClock(){
  var currentDate = new Date();

    // Set some date in the future. In this case, it's always Jan 1
    var futureDate  = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2);

    // Calculate the difference in seconds between the future and current date
    var diff = futureDate.getTime() / 1000 - currentDate.getTime() / 1000;

    // Instantiate a coutdown FlipClock
    clock = $('#clock').FlipClock(diff, {
        clockFace: 'DailyCounter',
        countdown: true
    });
}

function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
};



// citymap['chicago'] = {
//   center: new google.maps.LatLng(41.878113, -87.629798),
//   population: 2714856
// };
// citymap['newyork'] = {
//   center: new google.maps.LatLng(40.714352, -74.005973),
//   population: 8405837
// };
// citymap['losangeles'] = {
//   center: new google.maps.LatLng(34.052234, -118.243684),
//   population: 3857799
// };
// citymap['vancouver'] = {
//   center: new google.maps.LatLng(49.25, -123.1),
//   population: 603502
// };

var cityCircle;


function initialize() {
  var mapOptions = {
    zoom: 12
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      
      var pos = new google.maps.LatLng(lat,
                                       lon);

      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'Current Location'
      });

      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }



  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.MARKER,
        google.maps.drawing.OverlayType.CIRCLE,
        google.maps.drawing.OverlayType.POLYGON,
        google.maps.drawing.OverlayType.POLYLINE,
        google.maps.drawing.OverlayType.RECTANGLE
      ]
    },
    markerOptions: {
      icon: 'images/beachflag.png'
    },
    circleOptions: {
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      clickable: false,
      editable: true,
      zIndex: 1
    }
  });
  drawingManager.setMap(map);
  google.maps.event.addListener(drawingManager, 'circlecomplete', function(circle) {
    var radius = circle.getRadius();
    var center = circle.getCenter();
    //alert(radius + " " + center);
  });

  var input = /** @type {HTMLInputElement} */ (
    document.getElementById('pac-input'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));
  loadAvailableMoney(function(){
    for (var i = 0; i < citymap.length; i++) {
      var populationOptions = {
        strokeColor: '#00ff00',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#00ff00',
        fillOpacity: 0.35,
        map: map,
        center: new google.maps.LatLng(citymap[i][0], citymap[i][1]),
        radius: citymap[i][2] * 100
      };
      // Add the circle for this city to the map.
      cityCircle = new google.maps.Circle(populationOptions);
    }
  });
     
  loadATM(function(){
    //alert(atmMachines);
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    for(var i = 0; i < 100; i++){
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(atmMachines[i]["lat"], atmMachines[i]["lon"]),
        map: map,
        title: 'Hello World!',
        icon: 'img/moneymarker.png'
      });
    }
  });


}


function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}



function loadSendMoney(){
    var money = Parse.Object.extend("MoneyShare");
    var query = new Parse.Query(money);
    query.equalTo("ReceiverID", username);
    query.find({
      success: function(results) {
        //alert("Successfully retrieved " + results.length + " scores.");
        // Do something with the returned Parse.Object values
        var total = 0;
        tableData = '<table class="table table-hover"><thead><tr><th>#</th><th>Sender</th><th>Description</th><th>Amount</th><th>Expiration Time</th></tr></thead><tbody>'
        for (var i = 0; i < results.length; i++) { 
          total += results[i].get("Amount");
          if(results[i].get("Location") != undefined && results[i].get("radius") != -1){
            citymap.push([results[i].get("Location").latitude, results[i].get("Location").longitude, results[i].get("radius")]);
          }
          
          tableData += '<tr><td>' + (i+1) + '</td><td>' + results[i].get("SenderID") ;
          if(results[i].get("Description") != undefined){
            tableData += '</td><td>' + results[i].get("Description");
          } else {
            tableData += '</td><td>A description is not available';
          }

          if(results[i].get("Amount") != undefined){
            tableData += '</td><td>' + results[i].get("Amount").toFixed(2);
          } else {
            tableData += '</td><td>An amount is unavailable';
          }

          if(results[i].get("endTime") != undefined){
             tableData += '</td><td>' + results[i].get("endTime") + '</td></tr>';
           } else {
              tableData += '</td><td> No expiration date</td></tr>';
           }
        }
        //alert(citymap);
        tableData += '</tbody></table>';
        $("#table").html(tableData);
        $("#totalMoney").html("$" + total.toFixed(2));
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
}

function loadAvailableMoney(callback){
  Parse.Cloud.run("getTotalAvailableMoney", {"receiverId":username, "lat" : lat, "lon" : lon}, {
        success: function(result){
          currentAllowance = result;
            $("#moneyLeft").html("$" + result);
            callback();
        },
        failure: function(error){
          alert(error);
        }
    });
}

function loadATM(callback){
  Parse.Cloud.run("getAtmGeo", {"lat" : 38.986918, "lon" : -76.942554, "radius":10}, {
        success: function(result){
           atmMachines = result;
           callback();
        },
        failure: function(error){
          alert(error);
        }
    });
  
}