let gallerimg = fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(data => {
    const gallery = document.querySelector("#portfolio .gallery");


    data.forEach(item => {
      gallery.innerHTML += `
        <figure data-id="${item.id}" data-category="${item.category.id}">
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
    const filters = document.querySelector("#portfolio #filt1")

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
  modal.querySelector('.modal2').addEventListener('click', stopPropagation)
  openModalGall();
}

const closeModal = function(e){
  if (modal === null) return
  if (e) e.preventDefault()
  modal.style.display ="none"
  modal.setAttribute('aria-hidden', 'true')
  modal.removeAttribute('aria-modal')
  modal.removeEventListener('click', closeModal)
  modal.querySelector('.modal-close').removeEventListener('click', closeModal)
  modal.querySelector('.modal-stop').removeEventListener('click', stopPropagation)
  modal.querySelector('.modal2').removeEventListener('click', stopPropagation)
  modal = null;
  
};
const stopPropagation = function (e) {
  e.stopPropagation()
}

document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal)
  
})


//delete
const token = window.sessionStorage.getItem('token');

const deleteImage = (id, container) => {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization':  `Bearer ${token}`,
    }
  })
  .then(response => {
    if (response.ok) {
      container.remove(); 
      const galleryItem = document.querySelector(`#portfolio .gallery figure[data-id="${id}"]`);
      if (galleryItem) galleryItem.remove();
      console.log("Image supprimée avec succès.");
    } else {
      console.error("Erreur lors de la suppression de l'image.");
    }
  })
  .catch(error => console.error("Erreur:", error));
};


fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(data => {
    const gall = document.getElementById("galModal");

    data.forEach(item => {
      
      const imgContainer = document.createElement('div');
      imgContainer.classList.add('img-container');
      imgContainer.innerHTML = `
        <figure data-id="${item.id}" data-category="${item.category.id}">
          <img src="${item.imageUrl}" alt="${item.title}">
          <i class="fa-solid fa-trash-can delete-icon" data-id="${item.id}"></i>
        </figure>
      `;

     gall.appendChild(imgContainer);

      
      const deleteIcon = imgContainer.querySelector('.delete-icon');
      deleteIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        const imageId = event.target.getAttribute('data-id');
        deleteImage(imageId, imgContainer); 
      });
    });
  })
  .catch(error => console.error("Erreur:", error));

  //modal2
  async function addModal() {
    try {
      const response = await fetch("http://localhost:5678/api/categories");
      if (response.ok) {
        const categories = await response.json();
        const categoryOptions = categories.map(category => 
          `<option value="${category.id}">${category.name}</option>`
        ).join("");
        
        document.querySelector("#category").innerHTML = `<option value="" selected disabled hidden></option>${categoryOptions}`;
      } else {
        console.error("Erreur lors de la récupération des catégories");
      }
    } catch (error) {
      console.error("Erreur réseau ou serveur :", error);
    }
  }
    
  
  
const addPhoto = document.querySelector("#addPhoto");
const backMod = document.querySelector(".modal-back");

addPhoto.addEventListener("click", switchMod);
backMod.addEventListener("click", switchMod);

async function switchMod(){
  
  const modalGal = document.querySelector(".modal-stop");
  const modalAdd = document.querySelector(".modal2");

  if (
    modalGal.style.display ==="block" ||
    modalGal.style.display ===""
  ) {
    modalGal.style.display="none";
    modalAdd.style.display = "block";

    await addModal();

  } else {
    modalGal.style.display="block";
    modalAdd.style.display="none";
    
  }
}
async function openModalGall(){
  
  const modalGal = document.querySelector(".modal-stop");
  const modalAdd = document.querySelector(".modal2");

  
   
    modalGal.style.display="block";
    modalAdd.style.display = "none";

    await addModal();

  
} 
document.querySelectorAll(".modal-close").forEach(closeButton => {
  closeButton.addEventListener("click", closeModal);
});



const addPhotoButton = document.getElementById("addPhotoButton");
const modalAdd = document.querySelector(".modal2");  // Modale d'ajout de photo
const styleAddContainer = document.getElementById("add-photo-form");
const backButton = document.querySelector(".modal-back");  // Bouton retour
const closeButton = document.querySelector(".modal-close"); // Bouton fermeture (croix)



  
function handlePhotoUpload() {
  
  const styleAddContainer = document.getElementById("styleAddContainer");
  
  const img = document.createElement("img");
  const fileInput = document.getElementById("photoAdd");
  let file; // On ajoutera dans cette variable la photo qui a été uploadée.
  fileInput.style.display = "none";
  fileInput.addEventListener("change", function (event) {
    file = event.target.files[0];
    const maxFileSize = 4 * 1024 * 1024;

    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      if (file.size > maxFileSize) {
        alert("La taille de l'image ne doit pas dépasser 4 Mo.");
        return;
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        // Effacer seulement l'input et le bouton sans toucher au titre et à la catégorie
        const inputAndButton = styleAddContainer.querySelectorAll('input, button, label, p');
        inputAndButton.forEach(el => el.style.display = 'none');  // Masquer l'input et le bouton
  
        // Créer un élément image et l'ajouter dans le #styleAddContainer
        const img = document.createElement("img");
        img.src = e.target.result;
        img.alt = "Image téléchargée";
        img.style.maxWidth = "100%";  // Ajuste la taille de l'image si nécessaire
        img.style.maxHeight = "169px"; // Espace entre les images
        styleAddContainer.appendChild(img);  // Ajouter l'image dans le conteneur
      };
  
      // Lire le fichier sélectionné
      reader.readAsDataURL(file);
    } else {
      alert("Veuillez sélectionner une image.");
    }
  });
  
  }

  function setupAddPhotoForm() {
    const addPictureForm = document.querySelector(".modal2");
  
    addPictureForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const submitButton = document.querySelector("#validateButton");
      submitButton.disabled = true;
  
      const fileInput = document.getElementById("photoAdd");
      const titleInput = document.getElementById("title");
      const categorySelect = document.getElementById("category");
  
      const file = fileInput.files[0];
      const titleValue = titleInput.value.trim();
      const selectedCategory = categorySelect.value;
      let errorMessage = "";
  
      if (!file) errorMessage += "Veuillez sélectionner une image.\n";
      if (!titleValue) errorMessage += "Veuillez saisir un titre.\n";
      if (!selectedCategory) errorMessage += "Veuillez sélectionner une catégorie.\n";
  
      if (errorMessage) {
        alert(errorMessage);
        submitButton.disabled = false;
        return;
      }
  
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", titleValue);
      formData.append("category", selectedCategory);
  
      try {
        const response = await fetch("http://localhost:5678/api/works", {
          method: "POST",
          headers: { Authorization: "Bearer " + token },
          body: formData,
        });
  
        if (response.status !== 201) {
          const errorText = await response.text();
          console.error("Erreur lors de l'ajout de la photo : ", errorText);
        } else {
          const data = await response.json();
          console.log("Données reçues : ", data);
  
          if (data && data.id && data.imageUrl && data.title && data.categoryId) {
            const newImageElement = document.createElement('figure');
            newImageElement.setAttribute('data-id', data.id);
            newImageElement.setAttribute('data-category', data.categoryId);
            newImageElement.innerHTML = `
              <img src="${data.imageUrl}" alt="${data.title}">
              <figcaption>${data.title} - ${data.categoryId}</figcaption>
            `;
            const gallery = document.querySelector("#portfolio .gallery");
            gallery.appendChild(newImageElement);
  
            closeModal();
          } else {
            console.error("Les données de l'image sont incomplètes ou invalides.");
          }
        }
      } catch (error) {
        console.error("Erreur réseau : ", error);
      } finally {
        submitButton.disabled = false;
      }
    });
  }
  


function resetAddPhotoModal() {
  styleAddContainer.innerHTML = `
    <div class="styleAdd" id="styleAddContainer">
      <label for="file"><i class="fa-regular fa-image"></i></label>
      <input type="file" name="photo" id="photoAdd" accept="image/*">
      <button type="button" id="addPhotoButton">+ ajouter photo</button>
      <p>jpg, png : 4mo max</p>
    </div>
    <label for="title">Titre</label>
    <input type="text" name="title" id="title">
    <label for="category">Catégorie</label>
    <select name="category" id="category">
    </select>
    <hr>
            <div id="addPhoto1">
                <button type="submit" id="validateButton" >Valider</button>
            </div>
  `;

  addModal();

 
  handlePhotoUpload();
  setupAddPhotoForm();
  
  const newAddPhotoButton = document.getElementById("addPhotoButton");
  newAddPhotoButton.addEventListener("click", () => {
    document.getElementById("photoAdd").click();
  });
}



backButton.addEventListener("click", () => {
  modalAdd.style.display = "none";
  resetAddPhotoModal(); 
});


closeButton.addEventListener("click", () => {
  modalAdd.style.display = "none";
  resetAddPhotoModal(); 
});


document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    modal = target;
    resetAddPhotoModal(); 
    modal.addEventListener('click', closeModal);
  });
});




