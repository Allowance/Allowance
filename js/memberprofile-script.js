$(document).ready(function() {
    
    var currentUser = getCookie("username");

    $("#give_form").submit(function() {
        var transfer = Parse.Object.extend("MoneyShare");
        var gift = new transfer();
        gift.set("SenderID", currentUser);
        gift.set("RecieverID", $("#cemail").val());
        gift.set("Amount", $("#amount").val());
        gift.set("startTime", $("#sTime").val());
        gift.set("endTime", $("#eTime").val());
        gift.set("Location", center);
        gift.set("radius", radius);
        gift.save(null, {
            success: function() {
                alert("works");
            },
            error: function(gift, error) {
                alert(error.code);
            }
        });
    });

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    };
    $(".username").html(getCookie("username")).show();
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

