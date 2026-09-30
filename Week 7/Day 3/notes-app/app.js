const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const notes = require("./notes");

const commandLine = yargs(hideBin(process.argv))
    .scriptName("node app")
    .command("add", "Add a note", (command) => command
        .option("title", { describe: "Note title", type: "string", demandOption: true })
        .option("body", { describe: "Note body", type: "string", demandOption: true }), (args) => {
        const title = args.title.trim();
        const body = args.body.trim();
        if (!title || !body) {
            console.error("Title and body cannot be empty.");
            process.exitCode = 1;
            return;
        }
        if (!notes.addNote(title, body)) {
            console.log("Note already exists");
            return;
        }
        console.log("New note added!");
    })
    .command("list", "List all notes", () => {}, () => {
        const allNotes = notes.getNotes();
        if (allNotes.length === 0) {
            console.log("No notes found.");
            return;
        }
        allNotes.forEach((note) => console.log(`- ${note.title}`));
    })
    .command("read", "Read a note", (command) => command
        .option("title", { describe: "Note title", type: "string", demandOption: true }), (args) => {
        const note = notes.findNote(notes.getNotes(), args.title.trim());
        if (!note) {
            console.log("Note not found");
            return;
        }
        console.log(`Title: ${note.title}`);
        console.log(`Body: ${note.body}`);
    })
    .command("remove", "Remove a note", (command) => command
        .option("title", { describe: "Note title", type: "string", demandOption: true }), (args) => {
        if (!notes.removeNote(args.title.trim())) {
            console.log("Note not found");
            return;
        }
        console.log("Note removed.");
    })
    .strict()
    .demandCommand(1, "command not recognized")
    .fail((message, error) => {
        if (error) throw error;
        const command = hideBin(process.argv)[0];
        if (!command || !["add", "list", "read", "remove", "--help", "-h"].includes(command)) {
            console.error("command not recognized");
            process.exitCode = 1;
            return;
        }
        console.error(message || "command not recognized");
        process.exitCode = 1;
    })
    .help()
    .alias("help", "h");

commandLine.parse();
