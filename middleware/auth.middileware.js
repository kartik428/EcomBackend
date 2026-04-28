import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader){
          return res.status(401).json({message: "No token Provided"})
        }
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'secret'
        )

        req.user = decoded;

        next();

    } catch (error) {
        res.status(401).json({ error: "Invalid token" })
    }
}