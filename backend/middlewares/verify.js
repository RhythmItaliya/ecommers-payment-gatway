const jwtService = require('../services/jwt.service');

const verifyUser = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({
            message: "Access token is missing",
            status: 401
        });
    }
    const token = authHeader.split(" ")[1];
    // console.log("🚀 ~ verifyUser ~ token:", token);
    try {
        const validUser = jwtService.verifyAccessToken(token);
        req.user = validUser;
        next();
    } catch (error) {
        if (error.message && error.message.includes("jwt expired")) {
            return res.status(401).json({
                message: "Access token has expired",
                status: 401
            });
        } else {
            return res.status(403).json({
                message: "Access token is invalid",
                status: 403
            });
        }
    }
};

module.exports = { verifyUser }