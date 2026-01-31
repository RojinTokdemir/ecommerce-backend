// src/seeders/seedProduct.js
const Product = require("../models/product");

async function seedProducts() {
    const count = await Product.count();
    if (count > 0) {
        console.log("✅ Products already exist, seed skipped.");
        return;
    }

    await Product.destroy({ where: {}, truncate: true });

    await Product.bulkCreate([
        { title: "watch", price: 3456, imageUrl: "/images/watch1.png", description: "Smart watch" },
        { title: "watch", price: 399, imageUrl: "/images/watch2.png", description: "Another watch" },
        { title: "phone", price: 1500, imageUrl: "/images/phone1.png", description: "Phone product" }
    ]);
}

module.exports = seedProducts;
