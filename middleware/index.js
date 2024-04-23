module.exports = {
  logRoute: (req, res, next) => {
    console.log(`route handler: ${req.method} ${req.url}`);
    console.log(`> req.user: ${JSON.stringify(req.user, null, 2)}`);
    console.log(`> req.session: ${JSON.stringify(req.session, null, 2)}`);
    next();
  }
};
