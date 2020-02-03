$(document).ready(function() {
  let isLogged = sessionStorage.getItem("isLogged");
  let userName = `${sessionStorage.getItem("userFName")} ${sessionStorage.getItem("userLName")}`;
  let userEmail = sessionStorage.getItem("userEmail");
  // greeting user with name
  $("#userName").text(userName);
  console.log(isLogged);
  // display user info
  if (isLogged == "true") {
  $.ajax({
    url: `http://localhost:3000/userinfo?email=${userEmail}`,
    method: "GET",
    success: function(res) {
      if ([res].length > 0) {
        let dob = new Date(res.dob);
        $("#dob").text(dob.toLocaleDateString());
        $("#about").text(res.about);
        $("#phone").text(res.phone);
        $("#email").text(res.email);
        $("#gender").text(res.gender);
      } else if ([res].length < 1) {
        alert("update your info");
      }
    },
    error: function(err) {
      console.log(err);
      alert("error");
    }
  });
    console.log("logged in");
    // updating user info
    $("#updateForm").submit(function(e) {
      e.preventDefault();
      let dob = $("#dobForm").val();
      let gender = $("input[name = 'sexForm']:checked").val();
      let phone = $("#phoneForm").val();
      let about = $("#aboutForm").val();
      let email = userEmail;
      let updateData = { dob, gender, phone, about, email };
      $.ajax({
        url: "http://localhost:3000/update",
        data: updateData,
        method: "POST",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: function(res) {
          alert(res.message);
          location.reload();
        },
        error: function(err) {
          alert("error occured");
          console.log(err);
        }
      });
    });
    // LOGOUT function
    $("#logOut").on("click", function() {
      sessionStorage.setItem("isLogged", false);
      location.reload();
    });
    // if user tried to access this page without login
  } else if (isLogged == "false") {
    $("body").html(`<div class= "bg-danger text-white vh-100">
            <h1>You're Not Logged in !!</h1>
            <br>
            <p>Already registered with us?</p>
            <a href="./index.html" class="btn btn-info">Login</a>
            </div>`);
  }
});
