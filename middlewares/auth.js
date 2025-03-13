const { getUser } = require("../service/auth");

function checkForAuthentication(req, res, next) {
    console.log("Middleware triggered");

    console.log("Headers received:", req.headers);
    console.log("req.cookies:", req.cookies);

   
    let token = req.cookies?.["token"];

   
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1]; 
        }
    }

    console.log("Extracted token:", token);

    
    if (!token) {
        console.log("No token found.");
        return next();
    }

    const user = getUser(token);
    req.user = user;

    return next();
}



function restrictTo(roles = []) {
    return function (req, res, next) {
        if (!req.user) {
            console.log("No user found in request. Redirecting to login.");
            return res.redirect("/login");
        }

        console.log("User role:", req.user.role);

        if (!roles.includes(req.user.role)) {
            console.log("Unauthorized access attempt by:", req.user.email);
            return res.status(403).send("Unauthorized");
        }

        return next();
    };
}


module.exports = {
    checkForAuthentication,
    restrictTo
};
