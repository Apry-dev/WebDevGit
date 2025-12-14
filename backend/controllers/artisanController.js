const db = require("../utils/db");

/* ===============================
   GET ALL ARTISANS
================================ */
async function list(req, res, next) {
  try {
    const [rows] = await db.query(
      `SELECT id, user_id, name, bio, location, lat, lng, icon
       FROM artisans
       ORDER BY id DESC`
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

    if (!rows.length) {
      return res.status(404).json({ msg: "Not found" });
    }

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
   GET MY ARTISAN (DETERMINISTIC)
================================ */
async function getMyArtisan(req, res, next) {
  try {
    const [rows] = await db.query(
      `SELECT *
       FROM artisans
       WHERE user_id=?
       ORDER BY id DESC
       LIMIT 1`,
      [req.user.id]
    );

    if (!rows.length) {
      return res.json(null);
    }

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
   CREATE ARTISAN (SAFE)
================================ */
async function create(req, res, next) {
  try {
    const { title, craft, address } = req.body;

    // 1️⃣ Basic validation
    if (!title || !craft || !address) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    // 2️⃣ Guard: user already has artisan
    const [existing] = await db.query(
      "SELECT id FROM artisans WHERE user_id=?",
      [req.user.id]
    );

    if (existing.length) {
      return res.status(409).json({
        msg: "You already have an artisan profile"
      });
    }

    // 3️⃣ Geocode address (Node 18+ native fetch)
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        address
      )}`
    );

    const geo = await geoRes.json();
    if (!geo.length) {
      return res.status(400).json({ msg: "Invalid address" });
    }

    const lat = geo[0].lat;
    const lng = geo[0].lon;
    const icon = `assets/icons/${craft}.png`;

    // 4️⃣ Insert artisan
    const [result] = await db.query(
      `INSERT INTO artisans (user_id, name, bio, location, lat, lng, icon)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, title, craft, address, lat, lng, icon]
    );

    res.status(201).json({ id: result.insertId });
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

    let lat = null;
    let lng = null;

    if (address) {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          address
        )}`
      );

      const geo = await geoRes.json();
      if (geo.length) {
        lat = geo[0].lat;
        lng = geo[0].lon;
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
    await db.query(
      `INSERT INTO favourites (user_id, artisan_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE artisan_id = artisan_id`,
      [req.user.id, Number(req.params.id)]
    );

    res.status(201).json({ msg: "Added to favourites" });
  } catch (err) {
    next(err);
  }
}

async function removeFavourite(req, res, next) {
  try {
    await db.query(
      "DELETE FROM favourites WHERE user_id=? AND artisan_id=?",
      [req.user.id, Number(req.params.id)]
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
