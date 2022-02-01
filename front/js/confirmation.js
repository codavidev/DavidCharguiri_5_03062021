// Recuperation de la chaine de requete dans l'url de la page
const productUrlString = window.location.search;
// Initialisation du parametre d'url de la page
const productUrlObject = new URLSearchParams(productUrlString);
// Extraction de l'id dans l'url
const id = productUrlObject.get("id");
// Affiche sur la page le numero de commande recupéré dans l'url
const displayOrderId = document.getElementById("orderId");
displayOrderId.textContent = id;

let cart = localStorage.getItem("cart");
// Supprime le panier du localStorage
localStorage.removeItem("cart");


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
  
  
  
  
  