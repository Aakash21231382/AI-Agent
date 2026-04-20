import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
    try {
        let { token } = req.cookies
        if (!token) {
            return res.status(401).json({ message: "Not authenticated. Please login." })
        }
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)
        if (!verifyToken) {
            return res.status(401).json({ message: "Invalid token. Please login again." })
        }
        req.userId = verifyToken.userId
        next()
    } catch (error) {
        return res.status(401).json({ message: "Session expired. Please login again." })
    }
}

export default isAuth;