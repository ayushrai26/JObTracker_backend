const jwt = require('jsonwebtoken')

const authMiddleware = (req,res,next)=>{
try{

 const authHeader = req.headers["authorization"]
  if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
   const token = authHeader.split(" ")[1]; 
   console.log('token',token)
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }
   const user = jwt.verify(token, process.env.JWT_SECRET) 

  console.log(user,'userafterauthenticate')
      req.user = user;
      
      next();
      
  } catch (err) {
    return res.status(500).json({ message: "Authentication error" });
  }

}



module.exports = authMiddleware