$(document).ready(function() {
    Parse.initialize("zzdE55sBIepHMixSzU0qrjyTksfhO8WrcoYq7aFD",
        "u9jsLS5Njj9UC0RsEyRIdUcOzB91vSiBnf3RZbpT");
    var currentUser = getCookie("username");
    $(".login-form").submit(function() {
        var username = $("#login-username").val();
        var password = $("#login-password").val();
        var user = new Parse.User();
        user.set("username", username);
        user.set("password", password);
        user.logIn(null, {
            success: function(user) {
                alert("This works");
            },
            error: function(user, error) {
                alert("This does not work");
            }
        });
        document.cookie = "username=" + username;
    });
    $(".signup-form").submit(function() {
        var username = $("#signup-username").val();
        var password = $("#signup-password").val();
        var user = new Parse.User();
        user.set("username", username);
        user.set("password", password);
        user.signUp(null, {
            success: function(user) {
                alert("This works");
            },
            error: function(user, error) {
                alert("This does not work " + error
                    .message);
            }
        });
        document.cookie = "username=" + username;
    });
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
    $(".profile-ava.pull-right").append(getCookie("username"));
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

