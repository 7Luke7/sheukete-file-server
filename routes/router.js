const { upload_profile_picture, delete_service_image, update_service_images, get_all_service_image_names_and_paths, profile_image_no_id, stream_service_thumbnails, get_user_profile_image, upload_service_images } = require("../controllers/image")
const router = require("express").Router()

router.route("/profile_picture/:profId").post(upload_profile_picture)
router.route("/profile_image_no_id").post(profile_image_no_id)
router.route("/get_profile_image").post(get_user_profile_image)
router.route("/service/:xelosaniProfId/:serviceId").post(upload_service_images).put(update_service_images)
router.route("/service/frontpage/thumbnails/:xelosaniProfId").post(stream_service_thumbnails)
router.route("/get_all_service_image_names_and_paths/:profId/:publicId").get(get_all_service_image_names_and_paths)
router.route("/delete_service_image").delete(delete_service_image)

module.exports = router