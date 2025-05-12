function afficherInfosReponse(response) {
    console.log("Status:", response.status);
    console.log("Status Text:", response.statusText);
    console.log("OK:", response.ok);
    console.log("URL:", response.url);
}

function getBooks(url) {
    fetch(url)
        .then(response => {
            afficherInfosReponse(response);
            if (!response.ok) {
                throw new Error("Erreur HTTP : " + response.status);
            }
            return response.json(); // On retourne la promesse JSON pour la prochaine étape
        })
        .then(data => {
            afficherListeLivres(data);
        })
        .catch(error => {
            console.error("Une erreur s'est produite :", error.message);
        });
}

function afficherListeLivres(books) {
    books.forEach(book => {
        console.log("Titre :", book.name);
        console.log("Nombre de pages :", book.numberOfPages);
        console.log("ISBN :", book.isbn);
        console.log("---------------------------");
    });
}

const urlAPI = "https://anapioficeandfire.com/api/books";
getBooks(urlAPI);

function afficherDetailsLivre(numeroLivre) {
    const url = `https://anapioficeandfire.com/api/books/${numeroLivre}`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
            return response.json();
        })
        .then(livre => {
            console.log("Titre :", livre.name);
            console.log("ISBN :", livre.isbn);
            console.log("Auteurs :", livre.authors.join(", "));
            console.log("Nombre de pages :", livre.numberOfPages);
            console.log("Nombre de personnages :", livre.characters.length);

            const premiersPersonnages = livre.characters.slice(0, 10);
            console.log("10 premiers personnages (URLs) :");
            premiersPersonnages.forEach(url => console.log(url));
        })
        .catch(error => console.error("Erreur :", error.message));
}

async function afficherLivreEtPersonnage(numeroLivre) {
    const url = `https://anapioficeandfire.com/api/books/${numeroLivre}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

        const livre = await response.json();

        // Affichage des détails du livre
        console.log("Titre :", livre.name);
        console.log("ISBN :", livre.isbn);
        console.log("Auteurs :", livre.authors.join(", "));
        console.log("Nombre de pages :", livre.numberOfPages);

        const premierPersoUrl = livre.characters[0];
        if (!premierPersoUrl) {
            console.log("Aucun personnage disponible.");
            return;
        }

        const responsePerso = await fetch(premierPersoUrl);
        if (!responsePerso.ok) throw new Error(`Erreur HTTP : ${responsePerso.status}`);
        const personnage = await responsePerso.json();

        console.log("------ Personnage Principal ------");
        console.log("Nom :", personnage.name || "(Nom non renseigné)");
        console.log("Genre :", personnage.gender);
        console.log("Titres :", personnage.titles.join(", ") || "(Aucun titre)");
        console.log("Apparaît dans les livres :");
        personnage.books.forEach(url => console.log(url));

    } catch (error) {
        console.error("Erreur :", error.message);
    }
}

async function main(){
    const response = await fetch('https://anapioficeandfire.com/api/books');
    afficherInfosReponse(response);
    response.json()
        .then(response => {
            console.log(response);
        })
}

document.addEventListener("DOMContentLoaded", () => {
    const apiURL = "https://anapioficeandfire.com/api/books";
    const container = document.getElementById("books-container");
    const templateSource = document.getElementById("books-template").innerHTML;
    const template = Handlebars.compile(templateSource);

    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors du chargement des livres : " + response.status);
            }
            return response.json();
        })
        .then(data => {
            // Injecte les données dans le template
            const html = template({ books: data });
            container.innerHTML = html;
        })
        .catch(error => {
            container.innerHTML = `<p style="color:red;">${error.message}</p>`;
        });
});

await afficherDetailsLivre(1);
await afficherLivreEtPersonnage(4);