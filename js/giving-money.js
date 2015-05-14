var radius = -1;
var center = (0, 0);
$(document).ready(function(){

    Parse.initialize("zzdE55sBIepHMixSzU0qrjyTksfhO8WrcoYq7aFD",
                   "u9jsLS5Njj9UC0RsEyRIdUcOzB91vSiBnf3RZbpT");
    var currentUser = getCookie("username");
   $("#give_form").submit(function() {
        var transfer = Parse.Object.extend("MoneyShare");
        var gift = new transfer();
        gift.set("SenderID", currentUser);
        gift.set("ReceiverID", $("#cemail").val());
        gift.set("Amount", parseFloat($("#amount").val()));
        if($("#sTime").val() == ""){
          gift.set("startTime", null);
        } else {
          gift.set("startTime", new Date($("#sTime").val()));
        }
        if($("#eTime").val() == ""){
          gift.set("endTime", null);
        } else {
          gift.set("endTime", new Date($("#eTime").val()));
        }
        gift.set("Location", new Parse.GeoPoint(center.k, center.D));
        gift.set("radius", radius);
        gift.save(null, {
            success: function(gift) {
                //alert("works");
            },
            error: function(gift, error) {
                //alert(error.code);
            }
        });
    });

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    };
    $(".username").html(getCookie("username")).show();

    google.maps.event.addDomListener(window, 'load', initialize);
    


});

function showTimeRestriction(){
  $("#time-restriction").show();

}

function hideTimeRestriction(){
  $("#time-restriction").hide();

}

function showLocRestriction(){
  $("#map-canvas").show();

}

function hideLocRestriction(){
  $("#map-canvas").hide();

}

var map;
function initialize() {
  var mapOptions = {
    zoom: 8
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
    mapOptions);

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

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
    radius = circle.getRadius();
    center = circle.getCenter();
/*    alert(radius + " " + center);*/
  });

  var input = /** @type {HTMLInputElement} */ (
    document.getElementById('pac-input'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(input));

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



var x = document.getElementById("demo");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude;  
}


function loadSendMoney(){
    var money = Parse.Object.extend("MoneyShare");
    var query = new Parse.Query(money);
    query.equalTo("ReceiverID", "Ella");
    query.find({
      success: function(results) {
        //alert("Successfully retrieved " + results.length + " scores.");
        // Do something with the returned Parse.Object values
        var total = 0;
        for (var i = 0; i < results.length; i++) { 
          total += results[i].get("Amount");
        }
        $("#moneyLeft").html("$" + total);
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
}

