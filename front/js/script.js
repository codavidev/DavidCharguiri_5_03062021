let meubleData = [];
// Recupere les données des produits depuis l'API
const fetchMeuble = async () => {
    await fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((promise) => {
        meubleData = promise;
        console.log(meubleData);
    });
};
// Affiche les données des produits recuperé depuis l'API sur la page d'Acueil
const meubleDisplay = async () => {
    await fetchMeuble();
    let sectionItems = document.getElementById("items");
    meubleData.forEach((meuble) => { // Pour chaque meuble crée les elements html
        let aItem = document.createElement("a");// Element <a>
        aItem.setAttribute("href", `product.html?id=${meuble._id}`); // ajout de l'attribut href à l'element a, avec l'id du meuble à la fin
        sectionItems.appendChild(aItem); // ajout de l'element a comme enfant de la section "items"
        let articleElt = document.createElement("article"); // Article
        aItem.appendChild(articleElt);
        let imgElt = document.createElement("img"); // Image
        imgElt.setAttribute("src", meuble.imageUrl);
        imgElt.setAttribute("alt", meuble.altTxt);
        articleElt.appendChild(imgElt);
        let titleElt = document.createElement("h3"); // Titre / nom du meuble
        titleElt.setAttribute("class", "productName");
        titleElt.textContent = meuble.name;
        articleElt.appendChild(titleElt);
        let descriptionElt = document.createElement("p"); // Paragraphe description du produit
        descriptionElt.setAttribute("class", "productDescription");
        descriptionElt.textContent = meuble.description;
        articleElt.appendChild(descriptionElt);
    });
};
// Lance la function pour Afficher les produits
meubleDisplay();
// Selectionne les a tag dans la section avec id items
let items = document.querySelectorAll("#items a");
console.log(items);
// Boucle pour recuperer l'id du produit cliqué
items.forEach((item) =>
    item.addEventListener("click", () => {
        console.log(item);
        // Injecte dans l'url du navigateur l'id du produit cliqué
        window.location = `product.html?id=${item.id}`;
    }),
);
