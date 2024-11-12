import admin from "firebase-admin";

async function verifyToken(req, res, next) {
    const token = req.cookies['_token']
    if (!token) {
        return res.redirect('/auth/login');
    }

    try {
        const decodedToken = admin.auth().verifyIdToken(token);
        req.user = decodedToken;
    } catch (error) {
        console.log(error);
        return res.clearCookie('_token').redirect('/auth/login');
    }


    next();
}
export default verifyToken;
