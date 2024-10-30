const email = document.querySelector("form #email");
const password = document.querySelector("form #password");

const form = document.querySelector("form");
const messError = document.querySelector("p");

async function connect(event) {
    event.preventDefault(); 

   
    let user = { 
        email: email.value, 
        password: password.value 
    };

    let response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user) 
    });

    if (response.ok) {
        
        let result = await response.json();
        console.log(result);
        window.sessionStorage.loged = true;
        window.location.href = "index.html";
        
    } else {
       
        messError.textContent = "Erreur dans l’identifiant ou le mot de passe";
        console.error("Erreur de connexion :", response.status);
    }
}


form.addEventListener('submit', connect);

