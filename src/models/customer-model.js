//crear un modelo llamado post que tenga los siguientes campos: idAuthor, idDocument, likes, image, date, title, text, idPost, isEdited, audioUrl, savedBy, viewedBy

class Customer {
    constructor(
        email,
        uid,
    ) {
        this.email = email;
        this.uid = uid;


    }

    dataToMap() {
        return {
            email: this.email,
            uid: this.uid,
        }
    }






}
export default Customer;