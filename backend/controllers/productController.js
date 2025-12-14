const db = require('../utils/db');

/* ===============================
   GET ALL PRODUCTS
================================ */
async function list(req, res, next) {
  try {
    const { artisanId } = req.query;

    let sql = `
      SELECT id, name, description, price, image, artisan_id
      FROM products
      ORDER BY id DESC
    `;
    let params = [];

    if (artisanId) {
      sql = `
        SELECT id, name, description, price, image, artisan_id
        FROM products
        WHERE artisan_id = ?
        ORDER BY id DESC
      `;
      params = [artisanId];
    }

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

/* ===============================
   GET SINGLE PRODUCT
================================ */
async function get(req, res, next) {
  try {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ msg: 'Not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

/* ===============================
   CREATE PRODUCT (ARTISAN ONLY)
   WITH IMAGE SUPPORT
================================ */
async function create(req, res, next) {
  try {
    const { name, description, price, category } = req.body;
    const userId = req.user.id;

    if (!name || !price) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    // Ensure artisan exists
    const [artisan] = await db.query(
      'SELECT id FROM artisans WHERE user_id = ?',
      [userId]
    );

    if (!artisan.length) {
      return res.status(403).json({ msg: 'Not an artisan' });
    }

    const artisanId = artisan[0].id;

    // ✅ IMAGE PATH (NULL SAFE)
    const imagePath = req.file
      ? `/uploads/products/${req.file.filename}`
      : null;

    const [result] = await db.query(
      `
      INSERT INTO products (name, description, price, category, image, artisan_id)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        description || '',
        price,
        category || null,
        imagePath,
        artisanId
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Product created successfully'
    });

  } catch (err) {
    next(err);
  }
}

/* ===============================
   DELETE PRODUCT (OWNER ONLY)
================================ */
async function remove(req, res, next) {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const [owner] = await db.query(
      `
      SELECT p.id
      FROM products p
      JOIN artisans a ON p.artisan_id = a.id
      WHERE p.id = ? AND a.user_id = ?
      `,
      [productId, userId]
    );

    if (!owner.length) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    await db.query('DELETE FROM products WHERE id = ?', [productId]);
    res.json({ msg: 'Product deleted' });

  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  get,
  create,
  remove
};
