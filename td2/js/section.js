class Section {
    constructor(titre, texte) {
        this.titre = titre;
        this.texte = texte;
    }

    // Retourne la taille du texte de la section
    size() {
        return this.texte.length;
    }

    // Recherche un mot dans le texte
    search(mot) {
        return this.texte.includes(mot);
    }

    // Convertit la section en format Markdown
    toMarkdown() {
        return `### ${this.titre}\n\n${this.texte}`;
    }
}

class Document {
    constructor(titre, auteur) {
        this.titre = titre;
        this.auteur = auteur;
        this.dateModification = new Date();
        this.sections = [];
    }

    addSection(section) {
        this.sections.push(section);
        this.dateModification = new Date();
    }

    size() {
        return this.sections.reduce((total, section) => total + section.size(), 0);
    }

    toMarkdown() {
        const sectionsMarkdown = this.sections.map(section => section.toMarkdown()).join('\n\n');
        return `# ${this.titre}\n\n#### ${this.auteur} - ${this.dateModification.toLocaleString()}\n\nNombre de caractères : ${this.size()}\n\n${sectionsMarkdown}`;
    }

    toHTML() {
        const converter = new showdown.Converter();
        return converter.makeHtml(this.toMarkdown());
    }
}
