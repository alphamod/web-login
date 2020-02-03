$(document).ready(function() {
    $("#registerForm").submit(function (e) {
        e.preventDefault();
        let firstName = $("#firstName").val();
        let lastName = $("#lastName").val();
        let email = $("#userEmail").val();
        let password = $("#userPassword").val();
        let confirmPassword = $("#confirmPassword").val();
        if (password === confirmPassword) {
            let jsonData = { firstName, lastName, email, password };
            $.ajax({
                url: "http://localhost:3000/register",
                data: jsonData,
                method: "POST",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                success: function (res) {
                    alert(res.message);
                    window.location.href = "./index.html"

                },
                error: function (err) {
                    console.log(err);
                    alert(`${err.responseJSON.error}`);

                }
            })
            $("#regBtn").html("Please Wait...").attr('disabled', 'disabled');

    return true;
        } else if (password !== confirmPassword) {
            $('#passMsg').text('Passwords do not match');
        }
    });
});
