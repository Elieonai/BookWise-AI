const router = require("express").Router();
const controller = require("../controllers/aiController");

router.get("/recommendations/:bookTitle", controller.getRecommendations);

router.post("/chat", controller.chatWithAgent);

module.exports = router;