// Helper pour incrémenter l'index
Handlebars.registerHelper('inc', function(value) {
    return parseInt(value) + 1;
});

document.addEventListener("DOMContentLoaded", () => {
    const apiURL = "https://anapioficeandfire.com/api/books";
    const container = document.getElementById("books-container");
    const templateSource = document.getElementById("books-template").innerHTML;
    const template = Handlebars.compile(templateSource);

    fetch(apiURL)
        .then(response => response.json())
        .then(books => {
            const html = template({ books });
            container.innerHTML = html;

            // Ajouter les événements sur les boutons
            const buttons = container.querySelectorAll("button[data-index]");
            buttons.forEach(button => {
                button.addEventListener("click", () => {
                    const index = parseInt(button.getAttribute("data-index"));
                    const book = books[index];
                    afficherDetailsLivre(book, index);
                });
            });
        })
        .catch(error => {
            container.innerHTML = `<p style="color:red;">Erreur : ${error.message}</p>`;
        });
});

// Affiche les détails dans le conteneur correspondant
function afficherDetailsLivre(book, index) {
    const detailsDiv = document.getElementById(`details-${index}`);

    const auteurs = book.authors.join(", ");
    const personnages = book.characters.slice(0, 10).map(url => `<li><a href="${url}" target="_blank">${url}</a></li>`).join("");

    detailsDiv.innerHTML = `
        <p><strong>ISBN :</strong> ${book.isbn}</p>
        <p><strong>Auteurs :</strong> ${auteurs}</p>
        <p><strong>Pages :</strong> ${book.numberOfPages}</p>
        <p><strong>10 premiers personnages :</strong></p>
        <ul>${personnages}</ul>
    `;
}
