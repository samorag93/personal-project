const adminUsernames = ['samorag93', 'otroadmin']; // ← cambia estos por tus GitHub usernames

const isAdmin = (req, res, next) => {
  if (!req.session.user || !adminUsernames.includes(req.session.user.username)) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { isAdmin };
