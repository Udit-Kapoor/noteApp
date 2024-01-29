const notesServices = require("../db/notes.services");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

//protected route
exports.createNote = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;
  if (!title || !content) {
    next(new AppError("You must provide a title and content.", 400));
  }
  try {
    const newNote = await notesServices.createNewNote(req.body, req.user.id);
    res.status(200);
    res.send({ status: "success", newNote });
  } catch (error) {
    return next(new AppError(error, 400));
  }
});

//protected route
exports.deleteNote = catchAsync(async (req, res, next) => {
  const { noteId } = req.params;
  if (!noteId) {
    next(new AppError("You must provide note id.", 400));
  }
  try {
    const note = await notesServices.findNoteByID(noteId);
    if (!note) {
      next(new AppError("No note found by given id.", 401));
    }

    if (!(note.userId === req.user.id)) {
      next(new AppError("Cannot delete another user's notes.", 401));
    }

    const deletedNote = await notesServices.deleteNoteByID(noteId);
    res.status(200);
    res.send({ status: "success", deletedNote });
  } catch (error) {
    return next(new AppError(error.details[0].message, 400));
  }
});

//protected route
exports.updateNote = catchAsync(async (req, res, next) => {
  const { id, newContent } = req.body;
  if (!id || !newContent) {
    next(new AppError("You must provide noteId and new content.", 400));
  }
  try {
    const existingNote = await notesServices.findNoteByID(id);
    if (!existingNote) {
      next(new AppError("No note found by given id.", 401));
    }

    if (!(existingNote.userId === req.user.id)) {
      next(new AppError("Cannot modify another user's notes.", 401));
    }

    const updatedNote = await notesServices.updateNote(id, newContent);

    res.status(200);
    res.send({ status: "success", updatedNote });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
});

//protected route
exports.getNotes = catchAsync(async (req, res, next) => {
  try {
    const notes = await notesServices.findNotesByUser(req.user.id);

    res.status(200);
    res.send({ status: "success", notes });
  } catch (error) {
    return next(new AppError(error.details[0].message, 400));
  }
});

//protected route
exports.getVersionHistory = catchAsync(async (req, res, next) => {
  const { noteId } = req.body;
  if (!noteId) {
    next(new AppError("You must provide noteId.", 400));
  }

  try {
    const note = await notesServices.findAllNoteByID(noteId);
    if (!note) {
      next(new AppError("No note found by given id.", 401));
    }

    const versionHistory = await notesServices.findVersionsByNote(noteId);
    if (!versionHistory || versionHistory.length == 0) {
      next(new AppError("No versions found by given id.", 401));
    }

    if (!(note.userId === req.user.id)) {
      next(new AppError("Cannot view another user's notes.", 401));
    }

    res.status(200);
    res.send({ status: "success", versionHistory });
  } catch (error) {
    return next(new AppError(error.details[0].message, 400));
  }
});
