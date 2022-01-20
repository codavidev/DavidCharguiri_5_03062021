let cart = getCart();
// Recuperation du Panier depuis localStorage
function getCart() {
    let cart = localStorage.getItem("cart");
     if (cart == null) {
         return [];
     } else {
         return JSON.parse(cart);
     }
 }

let meubleData = [];
 // Recupere les données des produits depuis l'API
const fetchMeuble = async () => {
    await fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((promise) => {
        meubleData = promise;
        console.log(meubleData);
    });
}; fetchMeuble();

// Affiche les prix depuis l'API 
const priceDisplay = async (priceElt) => {
    // recupere les donnnées des produits depuis l'API pour avoir les prix
    await fetchMeuble();
    // pour chaque produit du panier,
    getCart().forEach((productOfCart) => {
        // trouve le produit avec id correspondant dans les données récupérées de l'API
        let foundProduct = meubleData.find(p => p._id === productOfCart.id);
        // affiche le prix du produit à l'unité
        priceElt.textContent = foundProduct.price + " €";
    });
}; 

 // Enregistre dans le locale storage le panier au format json (sous forme de chaine de caracteres)
function saveToLocalStorage(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

 // Creation des elements du DOM coresspondants
 // pour chaque produit du panier recuperé du localStorage
 getCart().forEach((productOfCart) => {
     let itemsSection = document.getElementById("cart__items");
     let articleElt = document.createElement("article");
     articleElt.setAttribute("class", "cart__item");
     articleElt.setAttribute("data-id", productOfCart.id);
     articleElt.setAttribute("data-color", productOfCart.color);
   
     itemsSection.appendChild(articleElt);
     // Image
    let imgContainer = document.createElement("div");
    imgContainer.setAttribute("class", "cart__item__img")
    articleElt.appendChild(imgContainer);
    let imgElt = document.createElement("img");
    imgElt.setAttribute("src", productOfCart.imageUrl);
    imgElt.setAttribute("alt", productOfCart.altTxt);
    imgContainer.appendChild(imgElt);
    // Contenu
    let itemContent = document.createElement("div");
    itemContent.setAttribute("class", "cart__item__content");
    articleElt.appendChild(itemContent);
    // Description
    let itemDesc = document.createElement("div");
    itemDesc.setAttribute("class", "cart__item__content__description");
    itemContent.appendChild(itemDesc);

    console.log(itemDesc);
    // Titre / nom du produit 
    let itemName = document.createElement("h2");
    itemName.textContent = productOfCart.name;
    itemDesc.appendChild(itemName);
    // Couleur
    let itemColor = document.createElement('p');
    itemColor.textContent = productOfCart.color;
    itemDesc.appendChild(itemColor);
    // Prix
    let priceElt = document.createElement("p");
    itemDesc.appendChild(priceElt);

    // Boucle pour recuperer les prix depuis l'API
    // pour chaque produit du panier, 
    priceDisplay(priceElt);
    
    // Settings
    let itemSettings = document.createElement("div");
    itemSettings.setAttribute("class", "cart__item__content__settings");
    itemContent.appendChild(itemSettings);
    // Div contenant la quantité 
    let itemQuantityContainer = document.createElement("div");
    itemQuantityContainer.setAttribute("class", "cart__item__content__settings__quantity");
    itemSettings.appendChild(itemQuantityContainer);
    // Paragraphe contenant le texte "Qté :"
    let itemQuantityP = document.createElement("p");
    itemQuantityP.textContent = "Qté :";
    itemQuantityContainer.appendChild(itemQuantityP);
    // Input contenant la quantité
    let itemQuantityInput = document.createElement("input");
    itemQuantityInput.setAttribute("type", "number");
    itemQuantityInput.setAttribute("class", "itemQuantity");
    itemQuantityInput.setAttribute("name", "itemQuantity");
    itemQuantityInput.setAttribute("min", "1");
    itemQuantityInput.setAttribute("max", "100");
    itemQuantityInput.setAttribute("value", productOfCart.quantity);
    itemQuantityContainer.appendChild(itemQuantityInput);
    // Div contenant le bouton "Supprimer"
    let itemDelete = document.createElement("div");
    itemDelete.setAttribute("class", "cart__item__content__settings__delete");
    itemSettings.appendChild(itemDelete);
    // 
    let supprimer = document.createElement("p");
    supprimer.setAttribute("class", "deleteItem");
    supprimer.textContent = "Supprimer";
    itemDelete.appendChild(supprimer);
 });
 
// Calcul la quantité total de produits du panier
const calculCartQuantity = async () => {
    let totalQuantity = document.getElementById('totalQuantity');
    console.log(totalQuantity);
    // declaration - initialisation à zero de la quantité total
    let calculTotalQuantity = 0;
    // si aucun produit affiche 0
    if (cart.length == undefined || cart.length == null || cart.length == 0) {
            totalQuantity.textContent = 0;
        }
        // sinon calcul la quantité total de produits du panier, 
        else {
            // Pour chaque produit du panier,
            getCart().forEach((productOfCart) => {
                // en ajoutant à chaque tour de boucle, la quantité d'un produit du panier à la quantité total
                calculTotalQuantity += productOfCart.quantity;
                console.log(calculTotalQuantity);
                // affiche la quantité total dans l'element avec id totalQuantité
                totalQuantity.textContent = calculTotalQuantity;
            });
}
}; calculCartQuantity();

// Calcul le prix total du panier
const calculCartPrice = async () => {
    await fetchMeuble();

    let totalPrice = document.getElementById("totalPrice");
    let calculTotalPrice = 0;
    if (cart.length == undefined || cart.length == null || cart.length == 0) {
        totalPrice.textContent = 0;
    }
    else {
    getCart().forEach((productOfCart) => {
        let foundProduct = meubleData.find(p => p._id === productOfCart.id);
        console.log(foundProduct.price);
        calculTotalPrice += productOfCart.quantity * foundProduct.price;
        console.log(calculTotalPrice);
        totalPrice.textContent = calculTotalPrice;
    });
    }
}; calculCartPrice();

