import axios from 'axios';
import * as constants from '../constants';

/*
 * Handle dropping of files
 */
export function handleFileDrop(newFile) {
  const errors = [];
  let file = newFile[0]; // TOCHANGE:: HACK

  file.status = 'queued';
debugger;
  if (file.type &&
    file.type.indexOf('application/csv') !== 0 &&
    file.type.indexOf('text/csv') !== 0) {
      file.status = 'validation_failed';
      errors.push(`${file.name}: This must be a valid CSV file.`);
  }

  if (file.size >= (10 * 1000 * 1000)) {
    file.status = 'validation_failed';
    errors.push(`${file.name}: Maximum supported file size is 10 MB`);
  }


  if (errors.length > 0) {
    return {
      type: constants.IMPORT_USERS_VALIDATION_FAILED,
      payload: {
        validationErrors: errors,
        file
      }
    };
  }

  return {
    type: constants.DROPPED_FILE,
    payload: {
      file
    }
  };
}
