import jwt from 'jsonwebtoken'; 
export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Ingen token skickad" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Ogiltig token" });
  }
};
export const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Ingen token skickad" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.admin) {
      return res.status(403).json({ error: "Endast administratörer har åtkomst" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Ogiltig token" });
  }
};


