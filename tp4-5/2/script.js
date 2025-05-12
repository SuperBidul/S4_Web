Handlebars.registerHelper('inc', function(value) {
    return parseInt(value) + 1;
});

document.addEventListener("DOMContentLoaded", () => {
    const apiURL = "https://anapioficeandfire.com/api/books";
    const booksContainer = document.getElementById("books-container");
    const globalDetailsContainer = document.getElementById("global-details-container");
    const templateSource = document.getElementById("books-template").innerHTML;
    const template = Handlebars.compile(templateSource);

    let allBooks = []; // Stock global des livres
    let currentDetailIndex = null; // Suivi de l'index actuellement affiché

    fetch(apiURL)
        .then(response => response.json())
        .then(books => {
            allBooks = books;
            booksContainer.innerHTML = template({ books });

            const detailButtons = booksContainer.querySelectorAll(".btn-details");
            detailButtons.forEach(button => {
                button.addEventListener("click", () => {
                    const index = parseInt(button.getAttribute("data-index"));
                    // Masquer les détails si déjà ouverts
                    if (currentDetailIndex === index) {
                        globalDetailsContainer.innerHTML = "";
                        currentDetailIndex = null;
                    } else {
                        afficherDetailsLivre(books[index], index);
                        currentDetailIndex = index;
                    }
                });
            });
        })
        .catch(err => {
            booksContainer.innerHTML = `<p style="color:red;">Erreur : ${err.message}</p>`;
        });

    function afficherDetailsLivre(book, index) {
        const auteurs = book.authors.join(", ");
        const personnages = book.characters.slice(0, 10).map(url => `<li><a href="${url}" target="_blank">${url}</a></li>`).join("");

        globalDetailsContainer.innerHTML = `
            <div class="detail-block">
                <h3>Détails du livre : ${book.name}</h3>
                <p><strong>ISBN :</strong> ${book.isbn}</p>
                <p><strong>Auteurs :</strong> ${auteurs}</p>
                <p><strong>Pages :</strong> ${book.numberOfPages}</p>
                <p><strong>10 premiers personnages :</strong></p>
                <ul>${personnages}</ul>
                <button class="btn-personnage" data-index="${index}">Personnage principal</button>
                <div id="personnage-details"></div>
            </div>
        `;

        const btnPersonnage = document.querySelector(".btn-personnage");
        btnPersonnage.addEventListener("click", () => {
            const firstCharacterUrl = book.characters[0];
            if (firstCharacterUrl) {
                afficherDetailsPersonnage(firstCharacterUrl);
            } else {
                document.getElementById("personnage-details").innerHTML = "<p style='color:red;'>Aucun personnage principal trouvé.</p>";
            }
        });
    }

    function afficherDetailsPersonnage(url) {
        const container = document.getElementById("personnage-details");

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error("Erreur HTTP : " + response.status);
                return response.json();
            })
            .then(personnage => {
                const alias = personnage.aliases.filter(a => a).join(", ") || "(aucun alias)";
                const livres = personnage.books.map(bookUrl => `<li><a href="${bookUrl}" target="_blank">${bookUrl}</a></li>`).join("");

                container.innerHTML = `
                    <h4>Personnage Principal</h4>
                    <p><strong>Nom :</strong> ${personnage.name || "(non renseigné)"}</p>
                    <p><strong>Genre :</strong> ${personnage.gender}</p>
                    <p><strong>Culture :</strong> ${personnage.culture || "(non renseignée)"}</p>
                    <p><strong>Alias :</strong> ${alias}</p>
                    <p><strong>Acteur(s) :</strong> ${personnage.playedBy.join(", ") || "(non renseigné)"}</p>
                    <p><strong>Livres :</strong></p>
                    <ul>${livres}</ul>
                `;
            })
            .catch(error => {
                container.innerHTML = `<p style="color:red;">Erreur personnage : ${error.message}</p>`;
            });
    }
});
