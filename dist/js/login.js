var login = function () {
    var email = document.getElementById("userEmail").value;
    var password = document.getElementById("loginPassword").value;
    var loginData = { email: email, password: password };
    var http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // if (this.responseText == 'success') {   
            alert(this.responseText);
            if (JSON.parse(this.responseText).message === "login success") {
                window.open("./index.html");
            }
            // }
        } else if (this.status == 403) {
            alert("Email or Password do not match")
        };
    };
    http.open("POST", "http://127.0.0.1:3000/login");
    http.setRequestHeader("content-type", "application/json;charset=UTF-8");
    http.send(JSON.stringify(loginData));
};
