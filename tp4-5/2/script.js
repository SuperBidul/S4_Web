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
