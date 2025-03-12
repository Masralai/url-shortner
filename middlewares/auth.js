const { getUser } = require("../service/auth");

async function restrictToLoggedInUserOnly(req, res, next) {
    const userUid = req.cookies?.uid;

    console.log("User UID from cookie:", userUid);

    if (!userUid) {
        console.log("No UID found. Redirecting to login.");
        return res.redirect('/login');
    }

    const user = getUser(userUid);
    console.log("User data:", user);

    if (!user) {
        console.log("User not found. Redirecting to login.");
        return res.redirect('/login');
    }

    req.user = user;
    next();
}

async function checkAuth(req,res,next) {
    const userUid  = req.cookies?.uid;
    const user = getUser(userUid);
    req.user = user;
    next();
}

module.exports = {
    restrictToLoggedInUserOnly,
    checkAuth,
};
