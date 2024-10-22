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
        window.location.href = "index.html";
        
    } else {
       
        messError.textContent = "Erreur de connexion, veuillez vérifier vos identifiants.";
        console.error("Erreur de connexion :", response.status);
    }
}


form.addEventListener('submit', connect);

