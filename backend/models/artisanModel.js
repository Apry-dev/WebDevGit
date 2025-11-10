const db = require("../utils/db");

async function getAllArtisans() {
	const [rows] = await db.query("SELECT * FROM artisans ORDER BY id DESC");
	return rows;
}

async function getArtisanById(id) {
	const [rows] = await db.query("SELECT * FROM artisans WHERE id = ?", [id]);
	return rows[0] || null;
}

async function createArtisan(artisan) {
	const { name, location, bio } = artisan;
	const [result] = await db.query(
		"INSERT INTO artisans (name, location, bio) VALUES (?, ?, ?)",
		[name, location || null, bio || null]
	);
	return { id: result.insertId, name, location: location || null, bio: bio || null };
}

async function updateArtisan(id, artisan) {
	const existing = await getArtisanById(id);
	if (!existing) return null;
	const name = artisan.name ?? existing.name;
	const location = artisan.location ?? existing.location;
	const bio = artisan.bio ?? existing.bio;
	await db.query(
		"UPDATE artisans SET name = ?, location = ?, bio = ? WHERE id = ?",
		[name, location, bio, id]
	);
	return { id: Number(id), name, location, bio };
}

async function deleteArtisan(id) {
	const [result] = await db.query("DELETE FROM artisans WHERE id = ?", [id]);
	return result.affectedRows > 0;
}

module.exports = {
	getAllArtisans,
	getArtisanById,
	createArtisan,
	updateArtisan,
	deleteArtisan
};


