let gallerimg = fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(data => {
    const gallery = document.querySelector("#portfolio .gallery");


    data.forEach(item => {
      gallery.innerHTML += `
        <figure data-category="${item.category.id}">
          <img src="${item.imageUrl}" alt="${item.title}">
          <figcaption>${item.title} - ${item.category.name}</figcaption>
        </figure>
      `;
    });

  })
  .catch(error => console.error("Erreur:", error));

let filt = fetch("http://localhost:5678/api/categories")
  .then(response => response.json())
  .then(dataFil => {
    const filters = document.querySelector("#portfolio p")

    if (window.sessionStorage.loged === "true") {
      filters.style.display = 'none'; 
    } else {
      filters.innerHTML += `<button id="all" data-category="all">Tous</button>`;}

    


    dataFil.forEach(item => {
      filters.innerHTML += `
        <button id="${item.id}" data-category="${item.id}">${item.name}</button>
      `;
    });

    filters.addEventListener("click", (event) => {
      const category = event.target.getAttribute("data-category");


      const galleryItems = document.querySelectorAll("#portfolio .gallery figure");

      document.querySelectorAll("#portfolio p button").forEach(filter => {
        filter.classList.remove("active");
      });


      event.target.classList.add("active");

      galleryItems.forEach(item => {
        if (category === "all" || item.getAttribute("data-category") === category) {
          item.style.display = "block";

        }
        else {
          item.style.display = "none";

        }

      });

    })
  })
  .catch(error => console.error("Erreur:", error));

  //connexion//
  
  const pageConnect = window.sessionStorage.loged
  const login = document.getElementById('log');
  

  if (pageConnect === "true") {
    login.textContent = "logout";
    login.addEventListener("click",()=>{
      window.sessionStorage.loged = false;
    });
  }

  function editMode() {
    if (window.sessionStorage.loged=== 'true') {
      const edition = document.createElement('div')
      edition.className = 'edit i'
      edition.innerHTML = 
      '<p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>'
      document.body.prepend(edition)
    }
  }
editMode()


const modif = document.getElementById('edit-button');
const style = document.querySelector('#portfolio #pos');

if (window.sessionStorage.loged === "true") {
  style.classList.add('header-container')
  modif.style.display = 'block'; 
} else {
  modif.style.display = 'none';}
 
//modal//
let modal = null

const openModal = function(e){
  e.preventDefault()
  const target = document.querySelector(e.target.getAttribute('href')) 
  target.style.display = null
  target.removeAttribute('aria-hidden')
  target.setAttribute('aria-modal', 'true')
  modal = target
  modal.addEventListener('click', closeModal)
  modal.querySelector('.modal-close').addEventListener('click', closeModal)
  modal.querySelector('.modal-stop').addEventListener('click', stopPropagation)
}

const closeModal = function(e){
  if (modal === null) return
  e.preventDefault()
  modal.style.display ="none"
  modal.setAttribute('aria-hidden', 'true')
  modal.removeAttribute('aria-modal')
  modal.removeEventListener('click', closeModal)
  modal.querySelector('.modal-close').removeEventListener('click', closeModal)
  modal.querySelector('.modal-stop').removeEventListener('click', stopPropagation)
  modal = null
  
}
const stopPropagation = function (e) {
  e.stopPropagation()
}

document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal)
  
})


let galleryModal = fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(data => {
    const gall = document.getElementById("galModal");

    data.forEach(item => {
      gall.innerHTML += `
        <figure data-category="${item.category.id}">
          <img src="${item.imageUrl}" alt="${item.title}">
        </figure>
      `;
    });
  })
  .catch(error => console.error("Erreur:", error));


