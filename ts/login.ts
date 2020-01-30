
let login = () => {
    let email:string = (<HTMLInputElement>document.getElementById("userEmail")).value;
    let password:string= (<HTMLInputElement>document.getElementById("loginPassword")).value;
    let loginData: object = { email, password };
    
    let http = new XMLHttpRequest();
    http.onreadystatechange= function(){
        if (this.readyState == 4 && this.status == 200) {
            // if (this.responseText == 'success') {   
            //     alert(`Registration ${this.responseText}`);
                window.open("./index.html")
            // }
        }
    };
    http.open("POST", "http://127.0.0.1:3000/login");
    http.setRequestHeader("content-type", "application/json;charset=UTF-8" )
    http.send(JSON.stringify(loginData));

}