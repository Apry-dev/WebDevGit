const db = require('../utils/db');

async function list(req, res, next) {
  try {
    const [rows] = await db.query('SELECT id, title, description, price, icon FROM products ORDER BY id DESC');
    res.json(rows);
  } catch (err) { next(err); }
}

async function get(req, res, next) {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ msg: 'Not found' });
    res.json(rows[0]);
  } catch (err) { next(err); }
}

async function addFavourite(req, res, next) {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ msg: 'Not authenticated' });
    const userId = req.user.id;
    const productId = req.params.id;
    await db.query('INSERT INTO favourites (user_id, product_id) VALUES (?, ?)', [userId, productId]);
    res.status(201).json({ msg: 'Added to favourites' });
  } catch (err) { next(err); }
}

async function addComment(req, res, next) {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ msg: 'Not authenticated' });
    const userId = req.user.id;
    const productId = req.params.id;
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: 'Comment text required' });
    const [result] = await db.query('INSERT INTO comments (user_id, product_id, text) VALUES (?, ?, ?)', [userId, productId, text]);
    res.status(201).json({ id: result.insertId, user_id: userId, product_id: productId, text });
  } catch (err) { next(err); }
}

async function listComments(req, res, next) {
  try {
    const [rows] = await db.query('SELECT id, user_id, product_id, text, created_at FROM comments WHERE product_id = ? ORDER BY created_at DESC', [req.params.id]);
    res.json(rows);
  } catch (err) { next(err); }
}

module.exports = { list, get, addFavourite, addComment, listComments };


