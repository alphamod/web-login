$(document).ready(function () {
    $("#loginForm").submit(function (e) {
        e.preventDefault();
        let email = $("#userEmail").val();
        let password = $("#loginPassword").val();
        let loginData = { email, password };
        $.ajax({
            url: "http://localhost:3000/login",
            data: loginData,
            method: "POST",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: function (res) {
                console.log(res)
                if (res.isLogged === true) {
                    let { isLogged, userFName, userLName, userEmail } = res;
                    // let sessData = { isLogged, userFName, userLName, userEmail }
                    sessionStorage.setItem("isLogged", isLogged);
                    sessionStorage.setItem("userFName", userFName);
                    sessionStorage.setItem("userLName", userLName);
                    sessionStorage.setItem("userEmail", userEmail);
                    alert("logged in");
                    window.location.replace("./profile.html");
                }
            },
            error: function (err) {
                console.log(err);
                alert(err.responseJSON.error);
            }

        })
    
    });
});
