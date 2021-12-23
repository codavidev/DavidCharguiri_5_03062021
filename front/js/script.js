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

// Affiche les données de l'API sur la page d'Acueil
const meubleDisplay = async () => {
    await fetchMeuble();

    document.getElementById(
        "items",   
    ).innerHTML = meubleData.map(
        (meuble) => 
        `<a href="./product.html?id=${meuble._id}">
            <article>
                <img src="${meuble.imageUrl}" alt="${meuble.altTxt}">
                <h3 class="productName">${meuble.name}</h3>
                <p class="productDescription">${meuble.description}</p>
            </article>
        </a>
        `,
        ).join("");// supprime les virgules injectées

};
// Lance la function pour Afficher les produits
meubleDisplay();