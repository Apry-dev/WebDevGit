const db = require("../utils/db");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

/* ===============================
   GET ALL ARTISANS
================================ */
async function list(req, res, next) {
  try {
    const [rows] = await db.query(
      "SELECT id, user_id, name, bio, location, lat, lng, icon FROM artisans ORDER BY id DESC"
    );

    const mapped = rows.map(r => ({
      id: r.id,
      user_id: r.user_id,
      title: r.name,
      craft: r.bio,
      location: r.location,
      lat: Number(r.lat),
      lng: Number(r.lng),
      icon: r.icon
    }));

    res.json(mapped);
  } catch (err) {
    next(err);
  }
}

/* ===============================
   GET ARTISAN BY ID
================================ */
async function get(req, res, next) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM artisans WHERE id=?",
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ msg: "Not found" });

    const r = rows[0];
    res.json({
      id: r.id,
      user_id: r.user_id,
      title: r.name,
      craft: r.bio,
      location: r.location,
      lat: r.lat,
      lng: r.lng,
      icon: r.icon,
      bio: r.bio
    });
  } catch (err) {
    next(err);
  }
}

/* ===============================
   GET MY ARTISAN
================================ */
async function getMyArtisan(req, res, next) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM artisans WHERE user_id=?",
      [req.user.id]
    );
    if (!rows.length) return res.json(null);

    const r = rows[0];
    res.json({
      id: r.id,
      user_id: r.user_id,
      title: r.name,
      craft: r.bio,
      location: r.location,
      lat: r.lat,
      lng: r.lng,
      icon: r.icon,
      bio: r.bio
    });
  } catch (err) {
    next(err);
  }
}

/* ===============================
   CREATE ARTISAN
================================ */
async function create(req, res, next) {
  try {
    const { title, craft, address } = req.body;
    if (!title || !craft || !address)
      return res.status(400).json({ msg: "Missing fields" });

    const geo = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        address
      )}`
    );
    const g = await geo.json();
    if (!g.length) return res.status(400).json({ msg: "Invalid address" });

    const icon = `assets/icons/${craft}.png`;

    const [r] = await db.query(
      `INSERT INTO artisans (user_id, name, bio, location, lat, lng, icon)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, title, craft, address, g[0].lat, g[0].lon, icon]
    );

    res.status(201).json({ id: r.insertId });
  } catch (err) {
    next(err);
  }
}

/* ===============================
   UPDATE ARTISAN
================================ */
async function update(req, res, next) {
  try {
    const { title, craft, bio, address } = req.body;

    let lat = null,
      lng = null;

    if (address) {
      const geo = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          address
        )}`
      );
      const g = await geo.json();
      if (g.length) {
        lat = g[0].lat;
        lng = g[0].lon;
      }
    }

    await db.query(
      `UPDATE artisans
       SET name=?, bio=?, location=?, lat=?, lng=?
       WHERE id=? AND user_id=?`,
      [title, bio || craft, address, lat, lng, req.params.id, req.user.id]
    );

    res.json({ msg: "Updated successfully" });
  } catch (err) {
    next(err);
  }
}

/* ===============================
   DELETE ARTISAN
================================ */
async function remove(req, res, next) {
  try {
    await db.query(
      "DELETE FROM artisans WHERE id=? AND user_id=?",
      [req.params.id, req.user.id]
    );
    res.json({ msg: "Deleted" });
  } catch (err) {
    next(err);
  }
}

/* ===============================
   FAVOURITES
================================ */
async function addFavourite(req, res, next) {
  try {
    const userId = req.user.id;
    const artisanId = Number(req.params.id);

    await db.query(
      `INSERT INTO favourites (user_id, artisan_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE artisan_id = artisan_id`,
      [userId, artisanId]
    );

    res.status(201).json({ msg: "Added to favourites" });
  } catch (err) {
    next(err);
  }
}

async function removeFavourite(req, res, next) {
  try {
    const userId = req.user.id;
    const artisanId = Number(req.params.id);

    await db.query(
      "DELETE FROM favourites WHERE user_id=? AND artisan_id=?",
      [userId, artisanId]
    );

    res.json({ msg: "Removed from favourites" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  get,
  getMyArtisan,
  create,
  update,
  remove,
  addFavourite,
  removeFavourite
};
