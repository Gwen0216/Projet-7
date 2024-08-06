"use strict";

const works_endpoint = "http://localhost:5678/api/works";
//API documentation: SWAGGER UI http://localhost:5678/api-docs/#/
const portfolioSection = document.querySelector('#js-portfolio');
const galleryDiv = document.querySelector('#js-portfolio .gallery');

// API FETCH getWorks
async function getWorks() {
    try {
        const response = await fetch(works_endpoint);
        if (!response.ok) {
            throw new Error("Sorry, I can't retrieve the works");
        }
        const data = await response.json();
        displayGallery(data);
        createFilters(data);
    } catch (error) {
        console.error(error);
    }
}

// DISPLAY GALLERY
function displayGallery(data) {
    galleryDiv.innerHTML = "";

    data.forEach((item) => {
        // Create article card
        const articleCard = document.createElement("article");
        articleCard.classList.add("articleCard");
        articleCard.setAttribute("data-category", item.category.name);

        // Create an image element for the card
        const cardImg = document.createElement("img");
        cardImg.src = item.imageUrl;
        cardImg.alt = item.title;

        // Create a figcaption element for the title of the work
        const cardTitle = document.createElement("figcaption");
        cardTitle.textContent = item.title;

        // Append the image and title elements to the article element
        articleCard.appendChild(cardImg);
        articleCard.appendChild(cardTitle);

        // Append the article element to the gallery div
        galleryDiv.appendChild(articleCard);
    });
}

// CREATE FILTERS
function createFilters(data) {
    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
        const categories = [...new Set(data.map(item => item.category.name))];

        // Create a container for the filters
        const filtersDiv = document.createElement("div");
        filtersDiv.id = "filters";
        filtersDiv.classList.add('filters');

        // Create a button for each category
        categories.forEach(category => {
            const button = document.createElement("button");
            button.textContent = category;
            button.addEventListener("click", () => filterGallery(category));
            filtersDiv.appendChild(button);
        });

        // Add an "All" button to show all items
        const allButton = document.createElement("button");
        allButton.textContent = "Tous";
        allButton.addEventListener("click", () => filterGallery("Tous"));
        filtersDiv.appendChild(allButton);

        // Insert the filters container before the gallery
        portfolioSection.insertBefore(filtersDiv, galleryDiv);
    }
}

// FILTER GALLERY
function filterGallery(category) {
    const articles = galleryDiv.querySelectorAll(".articleCard");

    articles.forEach(article => {
        if (category === "Tous" || article.getAttribute("data-category") === category) {
            article.style.display = "block";
        } else {
            article.style.display = "none";
        }
    });
}

// Call the function to get and display works
getWorks();

// Check if the user is logged in
function checkAuthToken() {
    const authToken = sessionStorage.getItem('authToken');
    if (authToken) {
        injectEditElements();
    }
}

// Inject edit elements if the user is logged in
function injectEditElements() {
    // Inject the edit button
    const editBtn = document.createElement('span');
    editBtn.id = 'editBtn';
    editBtn.innerHTML = '<a href="#"><i class="fa-regular fa-pen-to-square"></i>modifier</a>';
    const portfolioTitle = document.querySelector('#js-portfolio h2');
    portfolioTitle.appendChild(editBtn);

    // Inject the edit modal
    const editModal = document.createElement('aside');
    editModal.id = 'edit-modal';
    editModal.classList.add('hidden');
    editModal.innerHTML = `
        <div class="modal-background">
            <div class="modal-window">
                <header class="modal-header"><button class="close">&times;</button></header>
                <h1 id="gallery-edit-title">Gallerie photo</h1>
                <section class="camera-roll"><div class="gallery-roll"></div></section>
                <button id="add-picture-btn">Ajouter une photo</button>
            </div>
        </div>
    `;
    /* PART TO FIX FOR DISPLAYING MODAL
    document.body.appendChild(editModal);

    // Add event listener to the edit button to show the modal
    editBtn.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        editModal.classList.remove('hidden');
        editModal.classList.add('show');
    });

    // Add event listener to the close button to hide the modal
    editModal.querySelector('.close').addEventListener('click', () => {
        editModal.classList.remove('show');
        editModal.classList.add('hidden');
    });
    */
}

// Check for auth token on page load
document.addEventListener('DOMContentLoaded', checkAuthToken);
