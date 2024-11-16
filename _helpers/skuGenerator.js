
const db = require('_helpers/db');
const { Sequelize } = require('sequelize');

module.exports = { 
    generateSKU 
};

function generateSKU({ productName, category }) {
    // Take first three letters of the product name and category
    const namePart = productName.substring(0, 2).toUpperCase();
    const categoryPart = category.substring(0, 2).toUpperCase();

    // Add a timestamp for uniqueness
    const timestamp = Date.now().toString().slice(-5); // Last 5 digits of the timestamp

    // Add a random 3-digit number to reduce collision
    const randomPart = Math.floor(Math.random() * 1000).toString().padStart(5, '0');

    // Combine parts to form SKU
    return `${namePart}-${categoryPart}-${timestamp}-${randomPart}`;
}