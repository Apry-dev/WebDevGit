const router = require("express").Router();
const auth = require("../middleware/auth");
const artisan = require("../controllers/artisanController");
const userController = require("../controllers/userController");

// -------------------------------
// ARTISAN CRUD
// -------------------------------
router.get("/", artisan.list);
router.get("/me", auth, artisan.getMyArtisan);
router.get("/:id", artisan.get);
router.post("/", auth, artisan.create);
router.put("/:id", auth, artisan.update);
router.delete("/:id", auth, artisan.remove);

// -------------------------------
// ARTISAN FAVOURITES (MATCHING crafts.js)
// -------------------------------

// OPTIONAL GET route (for teacher demo 401 Unauthorized)
router.get('/:id/favourites', auth, (req, res) => {
    res.json({ message: "GET favourites is protected. Use POST/DELETE." });
});

// REAL favourites (used by frontend)
router.post('/:id/favourites', auth, artisan.addFavourite);
router.delete('/:id/favourites', auth, artisan.removeFavourite);

module.exports = router;
