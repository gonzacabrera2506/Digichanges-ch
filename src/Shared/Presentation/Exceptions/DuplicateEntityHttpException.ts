import ErrorHttpException from '../Shared/ErrorHttpException';
import Locales from '../Shared/Locales';
import MainConfig from '../../../Config/MainConfig';

const config = MainConfig.getInstance().getConfig().statusCode;

class DuplicateEntityHttpException extends ErrorHttpException
{
    constructor()
    {
        const locales = Locales.getInstance().getLocales();
        const key = 'app.presentation.exceptions.duplicateEntity';
        super(config['HTTP_BAD_REQUEST'], {
            message: locales.__(key),
            errorCode: key
        });
    }
}

export default DuplicateEntityHttpException;
