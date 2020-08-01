import buildNotesDao from './notes_dao';
import buildNotesController from './notes_controller';
import buildNotesHandler from '../../helpers/handler_builder';

export default (database) => {
  const notesDao = buildNotesDao(database);
  const notesController = buildNotesController(notesDao);
  return buildNotesHandler(notesController);
};
