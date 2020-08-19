import buildNotesDao from './notes_dao';
import buildNotesController from './notes_controller';
import buildNotesHandler from '../../core/process/handler_builder';

export default (database, authManager) => {
  const notesDao = buildNotesDao(database);
  const notesController = buildNotesController(notesDao, authManager);
  return buildNotesHandler(notesController);
};
