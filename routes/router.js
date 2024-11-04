const { upload_profile_picture_no_verification, preview_picture } = require("../controllers/image")
const router = require("express").Router()

router.route("/upload_picture").post(upload_profile_picture_no_verification)
router.route("/preview_picture").post(preview_picture)

module.exports = router