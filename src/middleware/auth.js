/*
Importerar jsonwebtoken-biblioteket
*/
import jwt from 'jsonwebtoken';

/*
Middleware för att kolla om användaren är inloggad
*/
export const auth = (req, res, next) => {

/*
Hämta token från authorization-headern 
*/
  const authHeader = req.headers.authorization;

/*
Om ingen token skickats, skicka tillbaka felmeddelande
*/
  if (!authHeader) return res.status(401).json({ error: "Ingen token skickad" });

/*
Tokenen kommer i formatet "Bearer token"
*/
  const token = authHeader.split(" ")[1];

  try {

/*
Kontrollera att tokenen är giltig 
*/
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

/*
Om allt är okej, spara informationen från tokenen i req.user
*/
    req.user = decoded;

/*
Gå vidare till nästa steg
*/
    next();

/*
Felhantering
*/
  } catch (error) {
    res.status(401).json({ error: "Ogiltig token" });
  }
};

/*
Middleware för att kolla om användaren är administratör
*/
export const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Ingen token skickad" });

  const token = authHeader.split(" ")[1];

  try {
/*
Verifiera token
*/
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

/*
Kollar om användaren är admin
*/
    if (!decoded.admin) {
      return res.status(403).json({ error: "Endast administratörer har åtkomst" });
    }

/*
Spara användardata från tokenen och gå vidare
*/
    req.user = decoded;
    next();
  } catch (error) {

/*
Om tokenen inte är giltig
*/
    res.status(401).json({ error: "Ogiltig token" });
  }
};


