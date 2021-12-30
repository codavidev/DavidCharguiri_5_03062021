// Recuperation de la chaine de requete dans l'url
const productUrlString = window.location.search;
console.log(productUrlString);

// Extraction de l'id dans l'url
const productUrlObject = new URLSearchParams(productUrlString);
console.log(productUrlObject);

const id = productUrlObject.get("id");
console.log(id);

const fetchProduct = async () => {
    await fetch(`http://localhost:3000/api/products/${id}`)
    .then((res) => res.json()
    ).then((promise) => {
        let product = promise;
        console.log(product);
        displayProduct(product);
    });
};

fetchProduct();

// Function affichage produit
const displayProduct = (product) => {
    //Image
    let imgElt = document.querySelector(".item__img");
    imgElt.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    // Nom
    let titleElt = document.getElementById("title");
    titleElt.innerHTML = product.name;
    // Prix
    let priceElt = document.getElementById("price");
    priceElt.innerHTML = product.price;
    // Description
    let descriptionElt = document.getElementById("description");
    descriptionElt.innerHTML = product.description;
    // Couleurs
    let colorSelect = document.getElementById("colors");
    console.log(product.colors);
    // Boucle pour créer les options des couleurs
    product.colors.forEach((color) => {
        let colorOption = document.createElement("option"); // Crée l'element option
        colorOption.innerHTML = `<option value="${color}">${color}</option>`; // Insere l'html dans le DOM
        colorSelect.appendChild(colorOption); // Ajoute <option> comme enfant de <select>
    });
    
};
