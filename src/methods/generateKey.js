import keygen from 'keygen';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

export default function generateKey() {
    let keyData = {
        apiKey: keygen.url(),
        active: true,
        activatedAt: moment().format(),
        desactivatedAt: null,
        projectId: uuidv4(),
        reactivatedAt: null
    };

    return keyData;
}