const router = require("express").Router();
const auth = require("../middleware/auth");
const artisan = require("../controllers/artisanController");

router.get("/", artisan.list);
router.get("/me", auth, artisan.getMyArtisan);
router.get("/:id", artisan.get);
router.post("/", auth, artisan.create);
router.put("/:id", auth, artisan.update);
router.delete("/:id", auth, artisan.remove);
router.post("/:id/favourites", auth, artisan.addFavourite);
router.delete("/:id/favourites", auth, artisan.removeFavourite);

module.exports = router;
