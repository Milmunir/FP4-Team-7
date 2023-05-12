const router = require("express").Router()

const socialMediaController = require("../controllers/socialMediaController")
const authentication = require("../middlewares/authentication")
const authorization = require("../middlewares/authorization")

router.use(authentication)
router.post("/", socialMediaController.createsocialmedia)
router.get("/", socialMediaController.readsocialmedia)
router.use("/:id", authorization)
router.put("/:id", socialMediaController.updatesocialmedia)
router.delete("/:id", socialMediaController.deletesocialmedia)

module.exports = router
