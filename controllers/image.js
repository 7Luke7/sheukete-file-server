const formidable = require("formidable");
const {verify_user} = require("../session_management");
const { compress_profile_image } = require("../utils/compress");
const { insert } = require("../utils/image");

const upload_profile_picture_no_verification = async (req, res, next) => {
    try {
        const session = await verify_user(req);
      if (session.profId !== params.profId) {
        throw new Error(401);
      }
      if (!fs.existsSync(`../image/${session.role}`)) {
        fs.mkdirSync(`../image/${session.role}`);
      }
      handleFileUpload({
        options: {
            multiples: false,
            maxFileSize: 1 * 1024 * 1024,
            maxFiles: 1,
            uploadDir: `../image/${session.role}/profile`
          },
        req
      })
      create_xelosani_profile_picture_folder_if_not_exists()
      const {profId} = req.params
      const compressed_buffer = await compress_profile_image(buffer, 50, 140, 140);

      return true;
    } catch (error) {
      console.log(error);
    }
};

const preview_picture = async (req, res, next) => {
  try {
      const session = await verify_user(req);
      if (session.profId !== params.profId) {
        throw new Error(401);
      }
      handleFileUpload({
        options: {
            maxFileSize: 1 * 1024 * 1024,
            maxFiles: 1,
        },
        req
      })
  
      const bytes = file.arrayBuffer(file);
      const buffer = Buffer.from(bytes);
      const compressed_buffer = await compress_image(buffer, 50, 140, 140);
      const base64 = Buffer.from(compressed_buffer, "binary").toString("base64");
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      if (error.message === "aborted") {
        return "AbortError"
      }
      console.log("OUTER ERROR", error);
    }
  };

module.exports = {
    upload_profile_picture_no_verification,
    preview_picture
}