const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const defaultNotesFile = path.join(__dirname, "notes.json");

function getNotesFile() {
    return process.env.NOTES_FILE || defaultNotesFile;
}

function getNotes() {
    const file = getNotesFile();
    if (!fs.existsSync(file)) return [];

    try {
        const content = fs.readFileSync(file, "utf8");
        const notes = JSON.parse(content);
        return Array.isArray(notes) ? notes : [];
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error(`Notes file contains invalid JSON: ${file}`);
        }
        throw error;
    }
}

function saveNotes(notes) {
    fs.writeFileSync(getNotesFile(), `${JSON.stringify(notes, null, 2)}\n`, "utf8");
}

function findNote(notes, title) {
    return _.find(notes, (note) => note.title === title);
}

function addNote(title, body) {
    const notes = getNotes();
    if (findNote(notes, title)) return false;
    notes.push({ title, body });
    saveNotes(notes);
    return true;
}

function removeNote(title) {
    const notes = getNotes();
    const remainingNotes = _.reject(notes, (note) => note.title === title);
    if (remainingNotes.length === notes.length) return false;
    saveNotes(remainingNotes);
    return true;
}

module.exports = { getNotes, findNote, addNote, removeNote };
