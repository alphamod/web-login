// export { };
// let password:string = (<HTMLInputElement>document.getElementById("userPassword")).value


let register = () => {
    let firstName: string = (<HTMLInputElement>document.getElementById("firstName")).value;
    let lastName: string = (<HTMLInputElement>document.getElementById("lastName")).value;
    let email: string = (<HTMLInputElement>document.getElementById("userEmail")).value;
    let password: string = (<HTMLInputElement>document.getElementById("userPassword")).value;
    let confirmPassword: string = (<HTMLInputElement>document.getElementById("confirmPassword")).value
    if (password === confirmPassword) {
        let jsonData: object = { firstName, lastName, email, password };
        let http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == 'success') {
                alert(`Registration ${this.responseText}`);
                document.getElementById('registerForm').innerHTML = `<h1 class="my-5 py-5">Registration Success! \n go to Login Page</h1>`
                window.open("./login.html")
            }
        }
    };
    http.open("POST", "http://127.0.0.1:3000/register");
    http.setRequestHeader("content-type", "application/json;charset=UTF-8")
    http.send(JSON.stringify(jsonData));
    } else {
        document.getElementById('passMsg').innerText = 'passwords do not match'
    }
    
};