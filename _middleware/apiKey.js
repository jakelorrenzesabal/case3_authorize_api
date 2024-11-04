const express = require('express');
const router = express.Router();
const { generateApiKey } = require('../utils/apiKeyGenerator');
const db = require('../models');  // Sequelize models

// Route to create API key for a specific user
router.post('/generate', async (req, res) => {
    try {
        const userId = req.body.userId; // Ensure valid user ID
        const apiKey = generateApiKey();

        // Store the new API key in the database
        await db.ApiKey.create({ userId, apiKey });

        res.json({ apiKey });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate API key' });
    }
});

module.exports = router;