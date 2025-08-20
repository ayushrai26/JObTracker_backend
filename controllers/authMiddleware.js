const jwt = require('jsonwebtoken')

const authMiddleware = (req,res,next)=>{
try{

 const authHeader = req.headers["authorization"]
  if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
   const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      req.user = user;
       // ✅ user info now available in routes
      next();
      });
  } catch (err) {
    return res.status(500).json({ message: "Authentication error" });
  }

}



module.exports = authMiddleware