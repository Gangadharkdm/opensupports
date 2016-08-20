import {EditorState} from 'draft-js';

import Validator from 'lib-app/validations/validator';

class LengthValidator extends Validator {
    constructor(length, errorKey = 'INVALID_VALUE', validator = null) {
        super(validator);
        
        this.minlength = length;
        this.errorKey = errorKey;
    }

    validate(value, form) {
        if (value instanceof EditorState) {
            value = value.getCurrentContent().getPlainText();
        }

        if (value.length < this.minlength) return this.getError(this.errorKey);
    }
}

export default LengthValidator;