const db = require('_helpers/db');

module.exports = {
    logTransaction
};

async function logTransaction(actionType, userId, details) {
    await db.ActivityLog.create({
        AccountId: userId,
        actionType,
        actionDetails: details,
        timestamp: new Date()
    });
}