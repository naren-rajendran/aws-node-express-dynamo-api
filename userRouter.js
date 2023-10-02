const express = require('express');
const router = express.Router();

const userHandler = require('./userHandler');

// routes
router.get("/:userId", async function (req, res) {
    const userId = req.params.userId;

    try {
        const user = await userHandler.getUser(userId);
        if (user) {
            return res.json(user);
        } else {
            return res.status(404).json({ error: "could not find user with provided userId" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "could not retreive user" });
    }
});

router.post("/", async function (req, res) {
    const userData = req.body;

    try {
        const { user, error } = await userHandler.createUser(userData);
        if (user) {
            return res.status(201).json(user);
        } else {
            return res.status(400).json({
                error,
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "could not create user" });
    }
});

router.put("/:userId", async function (req, res) {
    const userId = req.params.userId;
    const userData = req.body;

    try {
        const { user, error } = await userHandler.updateUser(userId, userData);
        if (user) {
            return res.json(user);
        } else {
            return res.status(400).json({
                error,
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "could not update user" });
    }
});

router.delete("/:userId", async function (req, res) {
    const userId = req.params.userId;

    try {
        const result = await userHandler.deleteUser(userId);
        if (result) {
            return res.json({});
        } else {
            return res.status(404).json({ error: "could not delete user with provided userId" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "could not delete user" });
    }
});

module.exports = router;
