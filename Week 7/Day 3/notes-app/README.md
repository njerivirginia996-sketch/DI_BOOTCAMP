# Notes App

A terminal notes manager built with Node.js. Notes are stored in `notes.json` in this folder.

## Setup

```sh
npm install
```

## Commands

```sh
node app add --title="Note Title" --body="Note body"
node app list
node app read --title="Note Title"
node app remove --title="Note Title"
```

Titles must be unique. The app reports when a note already exists or cannot be found. Run `node app --help` for command help.

## Tests

```sh
npm test
```
