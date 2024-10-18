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
    
    filters.innerHTML += `<i id="all" data-category="all">Tous</i>`;
    
   
    dataFil.forEach(item => {
      filters.innerHTML += `
        <i id="${item.id}" data-category="${item.id}">${item.name}</i>
      `;
      });
      
      filters.addEventListener("click", (event) => {
        const category = event.target.getAttribute("data-category");
       
        
        const galleryItems = document.querySelectorAll("#portfolio .gallery figure");
       
        document.querySelectorAll("#portfolio p i").forEach(filter => {
          filter.classList.remove("active");
        });
  
       
        event.target.classList.add("active");
    
        galleryItems.forEach(item => {
          if (category==="all" ||item.getAttribute("data-category") === category) {
            item.style.display =  "block" ;

          } 
          else  {
           item.style.display =  "none" ;
            
          }
        
          });

        })
  })
  .catch(error => console.error("Erreur:", error));  

 

 



  


  



    
  
