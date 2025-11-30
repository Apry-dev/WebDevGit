const db = require("../utils/db");

// ===============================
// GET ALL ARTISANS
// ===============================
async function list(req, res, next) {
  try {
    const [rows] = await db.query(
      "SELECT id, name, location, bio, lat, lng, icon, user_id FROM artisans ORDER BY id DESC"
    );

    const mapped = rows.map(r => ({
      id: r.id,
      user_id: r.user_id || null,
      title: r.name || null,
      craft: r.bio || null,
      lat: r.lat ? Number(r.lat) : null,
      lng: r.lng ? Number(r.lng) : null,
      icon: r.icon || "assets/icons/pottery.png",
      location: r.location || null
    }));

    res.json(mapped);
  } catch (err) {
    next(err);
  }
}

// ===============================
// GET SINGLE ARTISAN BY ID
// ===============================
async function get(req, res, next) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM artisans WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ msg: "Not found" });

    const r = rows[0];

    return res.json({
      id: r.id,
      user_id: r.user_id,
      title: r.name,
      craft: r.bio,
      lat: r.lat,
      lng: r.lng,
      icon: r.icon,
      location: r.location
    });
  } catch (err) {
    next(err);
  }
}

// ===============================
// GET MY ARTISAN (LOGGED USER)
// ===============================
async function getMyArtisan(req, res, next) {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(
      "SELECT * FROM artisans WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) return res.json(null);

    const r = rows[0];

    return res.json({
      id: r.id,
      user_id: r.user_id,
      title: r.name,
      craft: r.bio,
      lat: r.lat,
      lng: r.lng,
      icon: r.icon,
      location: r.location
    });
  } catch (err) {
    next(err);
  }
}

// ===============================
// CREATE ARTISAN
// ===============================
async function create(req, res, next) {
  try {
    console.log('ENTER create artisan -> req.user=', req.user);
    if (!req.user || !req.user.id) return res.status(401).json({ msg: "Not authenticated" });

    const { title, craft, address } = req.body;
    if (!title || !craft) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    // Geocode address => lat/lng
    const q = encodeURIComponent(address);
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`
    );
    const geoJson = await geoRes.json();

    if (!geoJson || geoJson.length === 0) {
      return res.status(400).json({ msg: "Address not found" });
    }

    const lat = Number(geoJson[0].lat);
    const lng = Number(geoJson[0].lon);

    const icon =
      craft === "sewing"
        ? "assets/icons/sewing.png"
        : craft === "weaving"
        ? "assets/icons/weaving.png"
        : craft === "woodcraft"
        ? "assets/icons/woodcraft.png"
        : craft === "costumes"
        ? "assets/icons/costumes.png"
        : "assets/icons/pottery.png";

    const [result] = await db.query(
      "INSERT INTO artisans (user_id, name, bio, location, lat, lng, icon) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [req.user.id, title, craft, address, lat, lng, icon]
    );

    res.json({
      id: result.insertId,
      user_id: req.user.id,
      title,
      craft,
      location: address,
      lat,
      lng,
      icon
    });
  } catch (err) {
    next(err);
  }
}

// ===============================
// UPDATE ARTISAN (EDIT PROFILE)
// ===============================
async function update(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { title, craft, bio, address } = req.body;

    // ensure the user owns the artisan
    const [owner] = await db.query(
      "SELECT id FROM artisans WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (owner.length === 0) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // geocode
    let lat = null;
    let lng = null;

    if (address) {
      const q = encodeURIComponent(address);
      const geo = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`
      );
      const gj = await geo.json();
      if (gj.length > 0) {
        lat = Number(gj[0].lat);
        lng = Number(gj[0].lon);
      }
    }

    await db.query(
      "UPDATE artisans SET name=?, bio=?, location=?, lat=?, lng=? WHERE id=?",
      [title, craft || bio, address, lat, lng, id]
    );

    return res.json({ msg: "Updated successfully" });
  } catch (err) {
    next(err);
  }
}

// ===============================
// DELETE ARTISAN
// ===============================
async function remove(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [owner] = await db.query(
      "SELECT id FROM artisans WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (owner.length === 0) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await db.query("DELETE FROM artisans WHERE id = ?", [id]);

    res.json({ msg: "Workshop deleted" });
  } catch (err) {
    next(err);
  }
}

// ===============================
// ADD / REMOVE FAVOURITES FOR ARTISANS
// ===============================
async function addFavourite(req, res, next) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ msg: "Not authenticated" });

    const artisanId = Number(req.params.id);
    const [exists] = await db.query('SELECT id FROM artisans WHERE id = ?', [artisanId]);
    if (exists.length === 0) return res.status(404).json({ msg: 'Artisan not found' });

    await db.query(
      'INSERT INTO favourites (user_id, artisan_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE created_at = created_at',
      [userId, artisanId]
    );

    res.status(201).json({ msg: 'Added to favourites' });
  } catch (err) { next(err); }
}

async function removeFavourite(req, res, next) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ msg: "Not authenticated" });

    const artisanId = Number(req.params.id);
    await db.query('DELETE FROM favourites WHERE user_id = ? AND artisan_id = ?', [userId, artisanId]);

    res.json({ msg: 'Removed from favourites' });
  } catch (err) { next(err); }
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
