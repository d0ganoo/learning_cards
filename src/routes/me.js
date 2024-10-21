const { User } = require('../db/sequelize')
const jwt = require('jsonwebtoken');
const privateKey = require('../auth/private_key')

module.exports = (app) => {
    const authenticateToken = async (req, res, next) => {
        const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
        if (!token) return res.sendStatus(401); // Non autorisé

        console.log("token", token)

        jwt.verify(token, privateKey, async (err, decoded) => {
            if (err) return res.sendStatus(403); // Interdit

            const user = await User.findByPk(decoded.userId);
            if (!user) return res.sendStatus(404); // Non trouvé

            req.user = {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                name: `${user.firstname} ${user.lastname}`,
            };
            next();
        });
    };

    app.get('/me', authenticateToken, async (req, res) => {
        res.json({ data: req.user });
    });
}
