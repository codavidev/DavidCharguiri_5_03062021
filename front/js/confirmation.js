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

