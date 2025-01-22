//Note
class Notes{
    constructor(titre, contenu) {
        this.titre = titre;
        this.contenu = contenu;
        this.date_creation = new Date();
    }

    setTitre(t){
        this.titre = t;
    }

    setContenu(c) {
        this.contenu = c;
    }
}

//NoteView
class NoteView{
    constructor(note) {
        this.note = note;
    }

    convert(){
        let text = `# ${this.note.titre}
        ### ${this.note.date_creation.toLocaleDateString()}
        ${this.note.contenu}`;
        let conv = new showdown.Converter();
        return conv.makeHtml(text);
    }

    display() {
        document.querySelector(`#currentNoteView`).innerHTML = this.convert(
            this.note
        );
    }
}

//NoteFormView
let noteFormView = {
    display(){
        document.querySelector('#noteForm').classList.remove('#create_edit_note-hidden');
    },

    hide(){
        document.querySelector('#noteForm').classList.add('#create_edit_note-hidden');
    },

    validate(){
        document.querySelector('#form_add_note_valid').addEventListener("click", (event) => {
            const titreInput = document.querySelector('#form_add_note_title').innerHTML;
            const contenuInput = document.querySelector('#form_add_note_text').innerHTML;

            const note = new Notes(titreInput, contenuInput);

            const noteView = new NoteView(note);
            noteView.display();
        });
    }
}

let mainMenuView = {
    init() {
        document.querySelector('#add').addEventListener('click', () => {
            this.noteFormView.display();
        });
    }
}

let appState = {
    currentNote: null, // Variable pour stocker la note courante.

    setCurrentNote(note) {
        this.currentNote = note;
    },

    getCurrentNote() {
        return this.currentNote;
    },

    init() {
        noteFormView.validate();

        mainMenuView.init();
    }
};

window.addEventListener('load', () => {
    appState.init(); // Lance l'application.
});