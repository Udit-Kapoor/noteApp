const { db } = require("../db/db");
const AppError = require("../utils/appError");

async function createNewNote(note, user) {
  //1 . Create a new note in database
  const newNote = await db.note.create({
    data: { userId: user, ...note },
  });
  //2. Create Version in database
  await db.version.create({
    data: { noteId: newNote.id, content: newNote.content },
  });

  return newNote;
}

async function findNoteByID(id) {
  return await db.note.findUnique({
    where: { id, isActive: true },
  });
}

async function findAllNoteByID(id) {
  return await db.note.findUnique({
    where: { id },
  });
}

async function findNotesByUser(user) {
  return await db.note.findMany({
    where: { userId: user, isActive: true },
  });
}

async function deleteNoteByID(id) {
  const deletedNote = await db.note.update({
    where: { id },
    data: { isActive: false },
  });
  await db.version.create({
    data: { noteId: id, content: "" },
  });

  return deletedNote;
}

async function findVersionsByNote(noteId) {
  return await db.version.findMany({
    orderBy: { timestamp: "desc" },
    where: { noteId: noteId },
  });
}

async function updateNote(noteId, newContent) {
  const updatedNote = await db.note.update({
    where: {
      id: noteId,
    },
    data: {
      content: newContent,
    },
  });
  await db.version.create({
    data: { noteId: noteId, content: updatedNote.content },
  });
  return updatedNote;
}

module.exports = {
  createNewNote,
  findNoteByID,
  updateNote,
  findNotesByUser,
  findVersionsByNote,
  deleteNoteByID,
  findAllNoteByID,
};
