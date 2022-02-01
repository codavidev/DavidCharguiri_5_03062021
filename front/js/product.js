const productUrlString = window.location.search; // Recuperation de la chaine de requete dans l'url
const productUrlObject = new URLSearchParams(productUrlString); // Recuperation des parametres d'url
const id = productUrlObject.get("id"); // Initialisation de la variable id (id recuperé dans l'url de la page produit)
// Recuperation des données du produit depuis l'API grace à son id
const fetchProduct = async () => {
    await fetch(`http://localhost:3000/api/products/${id}`)
    .then((res) => res.json()
    ).then((promise) => {
        let product = promise;
        displayProduct(product); // Lance la fonction d'affichage du produit
    });
}; fetchProduct(); // Lance la fonction de recuperation des données du produit depuis l'API
// Function affichage produit
const displayProduct = (product) => {
    let pageTitleElt = document.querySelector("title"); // Titre de la page (onglet)
    pageTitleElt.textContent = product.name;
    let imgContainer = document.querySelector(".item__img"); //Image
    let imgElt = document.createElement("img");
    imgElt.setAttribute("src", product.imageUrl);
    imgElt.setAttribute("alt", product.altTxt);
    imgContainer.appendChild(imgElt);
    let titleElt = document.getElementById("title"); // Nom
    titleElt.textContent = product.name;
    let priceElt = document.getElementById("price"); // Prix
    priceElt.textContent = product.price;
    let descriptionElt = document.getElementById("description"); // Description
    descriptionElt.textContent = product.description;
    let colorSelect = document.getElementById("colors"); // Couleurs
    // Boucle pour créer les options des couleurs
    product.colors.forEach((color) => {
        let colorOption = document.createElement("option"); // Crée l'element option
        colorOption.setAttribute("value", color); // Ajoute l'attribut "value", avec couleur comme valeur
        colorOption.textContent = color; // Insere les options de  dans le DOM
        colorSelect.appendChild(colorOption); // Ajoute <option> comme enfant de <select>
    });
};
// Enregistre dans le locale storage le panier au format json (sous forme de chaine de caracteres)
function saveToLocalStorage(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}
// Recupere le panier 
function getCart() {
   let cart = localStorage.getItem("cart");
    if (cart == null) {
        return [];
    } else {
        return JSON.parse(cart);
    }
}
// Ajout de la selection au panier apres verification de l'id et couleur
function addCart(dataToCart) {
    let cart = getCart(); // On recupere le panier 
    let foundProduct = cart.find(p => p.id == dataToCart.id && p.color == dataToCart.color); // trouve le meme produit dans le panier que sur la page (meme id et meme couleur)
    if (foundProduct != undefined) { // si le meme produit est deja dans le panier,
        foundProduct.quantity += dataToCart.quantity; // lui ajoute la quantité de la selection
    } else {
        cart.push(dataToCart); // sinon ajoute un nouveau produit au panier 
    }
    saveToLocalStorage(cart); // Enregistre le panier dans localStorage 
}
// Function de recuperation des données "à ajouter au panier"
function toAddToCart(cart) {
    // Selection du bouton "Ajouter au panier"
    let addButton = document.getElementById("addToCart");
    // Creation d'un ecouteur d'evenement sur le bouton "Ajouter au panier"
    addButton.addEventListener("click", (e) => {
        // Recuperation des options selectionnées par l'utilisateur
        let imageUrl = document.querySelector(".item__img img").src;
        let altTxt = document.querySelector(".item__img img").alt;
        let name = document.getElementById("title").textContent;
        let color = document.getElementById("colors").value;
        let quantity = document.getElementById("quantity").value;
        // Alerte si couleur ou quantité non selectionnées
        if (color == null || color === "" || quantity == null || quantity === "0") {
            alert("SVP choisissez une couleur et la quantité");
            return;
        } else {
            let dataToCart = { // Creation de l'objet avec les données/options selectionnées par l'utilisateur 
                id: id,
                imageUrl: imageUrl, 
                altTxt: altTxt,
                name: name,
                color: color,
                quantity: Number(quantity),
            }
            addCart(dataToCart); // Lance la fonction d'ajout de la selection au panier apres verification de l'id et couleur 
        }
    });
} toAddToCart(); // Lance la fonction "à ajouter au panier"
