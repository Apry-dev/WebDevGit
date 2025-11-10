const router = require("express").Router();
const ctrl = require("../controllers/userController");

router.get("/", ctrl.list);
router.get("/:id", ctrl.get);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

// Convenience registration endpoint
router.post("/register", ctrl.register);

module.exports = router;


