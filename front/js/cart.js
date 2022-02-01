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
// Initialisation du tableau des données des produits renvoyé par l'API
let meubleData = [];
// Recupere les données des produits depuis l'API
const fetchMeuble = async () => {
    await fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((promise) => {
        meubleData = promise;
    });
}; fetchMeuble();

// Affiche les prix depuis l'API 
const priceDisplay = async (priceElt, productOfCart) => {
    // recupere les donnnées des produits depuis l'API pour avoir les prix
    await fetchMeuble();
    // trouve le produit avec id correspondant dans les données récupérées de l'API
    let foundProduct = meubleData.find(p => p._id === productOfCart.id);
    // affiche le prix du produit à l'unité
    priceElt.textContent = foundProduct.price + " €";
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

    // Fonction pour recuperer les prix depuis l'API
    // pour chaque produit du panier, 
    priceDisplay(priceElt, productOfCart);
    
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
    let calculTotalQuantity = 0; // declaration - initialisation à zero de la quantité total
    if (cart.length == undefined || cart.length == null || cart.length == 0) { // si aucun produit affiche 0
            totalQuantity.textContent = 0;
            localStorage.removeItem("cart"); // supprime le panier du localStorage (lorsque tous les produits sont supprimés du panier)
        } else { // sinon calcul la quantité total de produits du panier 
            getCart().forEach((productOfCart) => { // Pour chaque produit du panier,
                calculTotalQuantity += productOfCart.quantity; //  à chaque tour de boucle, ajoute la quantité d'un produit du panier à la quantité total
                totalQuantity.textContent = calculTotalQuantity; // affiche la quantité total dans l'element avec id totalQuantité
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
    } else {
    getCart().forEach((productOfCart) => {
        let foundProduct = meubleData.find(p => p._id === productOfCart.id); // trouve l'id correspondant à l'id du produit du panier, dans les données de l'API
        calculTotalPrice += productOfCart.quantity * foundProduct.price; // Calcul le prix total
        totalPrice.textContent = calculTotalPrice;
    });
    }
}; calculCartPrice();
// Suppression du produit du panier
let articles = document.getElementsByClassName("cart__item");
let removeBtn = document.querySelectorAll(".deleteItem");

  for (let i = 0; i < removeBtn.length; i++) { // Boucle qui ajoute un eventListener sur tous les boutons "Supprimer"
    let remove = removeBtn[i];
    remove.addEventListener("click", () => { // ecoute l'evenement du click sur bouton "Supprimer"
      cart.splice(i, 1); // supprime le produit du localStorage 
      articles[i].remove();// supprime l'article du DOM
      localStorage.setItem("cart", JSON.stringify(cart)); // met à jour le localstorage
      location.reload(); // recharge la page
      calculCartQuantity(); // lance la fonction qui va mettre à jour la quantité total et
      calculCartPrice(); // le prix 
    });
  }
// Changement de la quantité du produit 
  for (let i = 0; i < articles.length; i++) { // Boucle qui ajoute un eventListener sur tous les articles affichés dans le panier
    let article = articles[i];
    article.addEventListener("change", (e) => { // ecoute l'evenement du changement de la valeur de l'input quantite
      console.log(cart[i].quantity);
      cart[i].quantity = parseInt(e.target.value); // envoie la quantité selectionnée dans le panier
      if (cart[i].quantity == 0) { // cas particulier si quantité = zero alors declanchement de suppression de produit
        cart.splice(i, 1); 
        articles[i].remove(); // supprime l'article du DOM
        location.reload(); // recharge la page 
        calculCartPrice(); // lance la fonction qui va mettre à jour le prix
      }
      localStorage.setItem("cart", JSON.stringify(cart)); // met à jour le localstorage
      calculCartQuantity(); // lance la fonction qui va mettre à jour la quantité total et
      calculCartPrice(); // le prix
    });
  }

/************* FORMULAIRE **************/ 

// Crée un objet à remplir à partir des données saisies et validées
let contact = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  email: "",
};
let products = []; // Crée un tableau vide pour reception d'id des produits du panier (apres submit des inputs validés)
let form = document.querySelector(".cart__order__form"); // Recuperer le formulaire
// Recuperer les inputs
let inputFirstName = document.getElementById("firstName");
let inputLastName = document.getElementById("lastName");
let inputAddress = document.getElementById("address");
let inputCity = document.getElementById("city");
let inputEmail = document.getElementById("email");
let btnCommander = document.getElementById("order"); // Bouton "Commander"
// Création de l'objet contenat les expressions regulieres
let regExps = {
  firstNameRegExp: new RegExp("^[a-zA-Zàâäéèêëïîôöùûüÿç-]+$", "g"),
  lastNameRegExp: new RegExp("^[a-zA-Zàâäéèêëïîôöùûüÿç-]+$", "g"),
  addressRegExp: new RegExp("[0-9]{1,4}[ ,-][ a-zA-Zàâäéèêëïîôöùûüÿç-]+$", "g"),
  cityRegExp: new RegExp("[0-9]{1,5}[ ,-][ a-zA-Zàâäéèêëïîôöùûüÿç-]+$", "g"),
  emailRegExp: new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$"),
};
// Création de l'objet contenat les messages d'erreurs
let errorMsgs = {
  firstNameErrorMsg: "Veuillez entrer votre prenom en lettres",
  lastNameErrorMsg: "Veuillez entrer votre nom en lettres",
  addressErrorMsg: "Veuillez entrer votre adresse valide (ex: 3, rue de la mer)",
  cityErrorMsg: "Veuillez entrer votre ville (ex: 06000 Nice)",
  emailErrorMsg: "Veuillez entrer une adresse email valide (ex: votremail@gmail.com)",
};
// Validation formulaire
function checkInput (input, errorMsg, contactProp) {
    let inputErrorMsgElt = document.getElementById(input.id + "ErrorMsg");
    errorMsg = input.id + "ErrorMsg";
    let inputRegExp = regExps[input.id + "RegExp"];
    let inputTest = inputRegExp.test(input.value); // Teste da valeur du champ par rapport à la RegExp correspondante
    contactProp = input.id;
    if (inputTest) { // si le test renvoie vrai, envoie la valeur saisie dans le formulaire à {contact}
      contact[`${contactProp}`] = input.value;
      inputErrorMsgElt.textContent = "";
    } else { // sinon, ajoute le message d'erreur
      inputErrorMsgElt.textContent = errorMsgs[errorMsg];
      contact[`${contactProp}`] = "";
    }
}
for (let input of form) { // Pour chaque input du formulaire,
  input.addEventListener("change", (e) => { // Ajoute un ecouteur d'evenement au changement de la valeur 
    checkInput(input, errorMsgs.errorMsg, input.id); // Lance la fonction de verification de données saisies dans le formulaire de contact 
    console.log(contact);
  })
};
// Ajoute un ecouteur d'evenement sur le bouton "Commander"
btnCommander.addEventListener("click", (e) => {
  e.preventDefault();
    // Si toutes les données de {contact} sont remplis et validées, 
    if (contact.firstName && contact.lastName && contact.address && contact.city && contact.email) {
      for (let i = 0; i < cart.length; i = i + 1) { // pour chaque produit du panier ...
        products.push(cart[i].id); // ... ajout de l'id dans le tableau products à envoyer à l'API
        getOrderId(); // Lance la fonction d'envoie de la requete fetch POST à l'API pour recuperer le numero de commande "orderId" retourné
          }
    } else {
      e.preventDefault();
    }
});
// Crée l'objet des données de contact et tableau d'id des produits à envoyer à l'API
let sendOrder = {contact, products}; 
// Envoie de contact et products à l'API
function getOrderId() {
  fetch("http://localhost:3000/api/products/order"  , {
      method: "POST",
      body: JSON.stringify(sendOrder),
      headers: {
          "content-type": "application/json",
      }   
    })
    // Recuperation de reponse de l'API    
    .then(res => {
        return res.json();
    }).then((data) => {
      window.location.href = `./confirmation.html?id=${data.orderId}`;
    }).catch((error) => {
        console.log(error);
    })
};




