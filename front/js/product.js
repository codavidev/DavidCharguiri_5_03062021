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
    let imgContainer = document.querySelector(".item__img");
    let imgElt = document.createElement("img");
    imgElt.setAttribute("src", product.imageUrl);
    imgElt.setAttribute("alt", product.altTxt);
    imgContainer.appendChild(imgElt);
    // Nom
    let titleElt = document.getElementById("title");
    titleElt.textContent = product.name;
    // Prix
    let priceElt = document.getElementById("price");
    priceElt.textContent = product.price;
    // Description
    let descriptionElt = document.getElementById("description");
    descriptionElt.textContent = product.description;
    // Couleurs
    let colorSelect = document.getElementById("colors");
    console.log(product.colors);
    // Boucle pour créer les options des couleurs
    product.colors.forEach((color) => {
        let colorOption = document.createElement("option"); // Crée l'element option
        colorOption.setAttribute("value", color);
        colorOption.textContent = color; // Insere l'html dans le DOM
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

// Ajoute la selection au panier
function addCart(dataToCart) {
    // On recupere le panier 
    let cart = getCart();
    // Pour chaque produit du panier, verifie : produit du panier le meme que la page? (le meme id plus meme couleur)
    let foundProduct = cart.find(p => p.id == dataToCart.id && p.color == dataToCart.color);
    // si le produit est deja ds le panier,
    if (foundProduct != undefined) {
        // lui ajoute la quantité de la selection
        foundProduct.quantity += dataToCart.quantity;
    } else {
        // sinon ajoute un nouveau produit au panier 
        cart.push(dataToCart);
    }
    // Enregistre le panier dans localStorage 
    saveToLocalStorage(cart);
}
  
// Function d'ajout au panier (local storage)
function addToCart(cart) {
    let addButton = document.getElementById("addToCart"); 
    console.log("voici votre panier", getCart());
    // Creation d'un ecouteur d'evenement sur le bouton "Ajouter au panier"
    addButton.addEventListener("click", (e) => {
        // Recuperation des options selectionnées par l'utilisateur
        let imageUrl = document.querySelector(".item__img img").src;
        let altTxt = document.querySelector(".item__img img").alt;
        let name = document.getElementById("title").textContent;
        let color = document.getElementById("colors").value;
        let quantity = document.getElementById("quantity").value;
        let price = document.getElementById("price").textContent;
        console.log(color, quantity, price);
        // Alerte si couleur ou quantité non selectionnées
        if (color == null || color === "" || quantity == null || quantity === "0") {
            alert("SVP choisissez une couleur et la quantité");
            return;
        } else {
                    // Creation de l'objet avec les données/options selectionnées par l'utilisateur    
            let dataToCart = {
                id: id,
                imageUrl: imageUrl, 
                altTxt: altTxt,
                name: name,
                color: color,
                quantity: Number(quantity),
            }
            console.log("voici votre selection :", dataToCart, "de type :",typeof dataToCart,);

            addCart(dataToCart);  

            console.log("voici votre nouveau panier :", getCart(), 'il contient', getCart().length,"differente(s) reference(s) de produits. Pour un total de", getCart().total );
        }
    
    });
}
    addToCart();
    console.log("voici votre nouveau panier :", getCart(), 'il contient', getCart().length,"different(s) reference(s) de produits");
