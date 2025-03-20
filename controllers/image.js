const { verify_user } = require("../session_management");
const { handleFileUpload } = require("../utils/image");
const fs = require("fs");
const {
  create_user_profile_picture_folder_if_not_exists,
  create_services_picture_folder_if_not_exists,
} = require("../utils/initialize_folder_structure");
const {
  postgresql_server_request,
} = require("../ext_requests/posgresql_server_request");
const path = require("path");

const upload_profile_picture = async (req, res, next) => {
  try {
    const session = await verify_user(req);
    const { profId } = req.params;
    if (session.profId !== profId || session === 401) throw new Error(401);
    create_user_profile_picture_folder_if_not_exists(session.role);
    const filePath = path.join(
      __dirname,
      `/../images/${session.role}/profile/medium/${session.profId}.webp`
    );

    if (!fs.existsSync(filePath)) {
      const response = await handleFileUpload({
        req,
        filePath: path.join(
          __dirname,
          `/../images/${session.role}/profile`
        ),
        destination: "profile",
        profId: session.profId
      });

      if (response === "success") {
        const stepPercent = await postgresql_server_request(
          "GET",
          `${session.role}/increment_step_percent/${profId}`,
        );
        return res.status(200).json({
          stepPercent,
          message: "პროფილის ფოტო წარმატებით განახლდა.",
        });
      }

      res.status(500).json({ message: "Server failure." });
    } else {
      const response = await handleFileUpload({
        req,
        filePath: path.join(
          __dirname,
          `/../images/${session.role}/profile`
        ),
        destination: "profile",
        profId: session.profId
      });

      if (response === "success") {
        res.status(200).json({ message: "პროფილის ფოტო წარმატებით განახლდა." });
      }
    }
  } catch (error) {
    console.log(error, error.message, error.name);
    res.status(500).send(error);
  }
};

const profile_image_no_id = async (req, res, next) => {
  try {
    const { role, profId } = req.body;
    if (
      !fs.existsSync(
        path.join(__dirname, `/../images/${role}/profile/medium/${profId}.webp`)
      )
    ) {
      return res.json({
        profId: profId,
      });
    }

    res.status(200).json({
      url: "exists",
    });
  } catch (error) {
    console.log(error);
  }
};

const get_user_profile_image = async (req, res, next) => {
  try {
    const { role, profId } = req.body;
    const imagePath = path.join(
      __dirname + `/../images/${role}/profile/${profId}.webp`
    );

    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
    } else {
      res.status(404).send("Image not found");
    }
  } catch (error) {
    console.log(error);
  }
};

const upload_service_images = async (req, res, next) => {
  try {
    create_services_picture_folder_if_not_exists(
      req.params.xelosaniProfId,
      req.params.serviceId
    );
    const filePath = path.join(
      __dirname,
      `/../images/xelosani/${req.params.xelosaniProfId}/services/${req.params.serviceId}`
    );

    const response = await handleFileUpload({
      req,
      filePath,
      destination: "service",
    });
    console.log(response)
    res.status(200).json({message: "ფაილები წარმატებით აიტვირთა."})
  } catch (error) {
    console.log(error);
  }
};

const stream_service_thumbnails = async (req, res, next) => {
  try {
    const { xelosaniProfId } = req.params;
    const baseDir = path.join(
      __dirname,
      `/../images/xelosani/${xelosaniProfId}/services`
    );

    if (!fs.existsSync(baseDir)) {
      return res.status(404).json({ error: "No services found" });
    }

    // Gather all service thumbnails
    const serviceDirs = fs.readdirSync(baseDir);
    const thumbnails = serviceDirs
      .map((serviceId) => {
        const thumbnailPath = path.join(
          baseDir,
          serviceId,
          "thumbnail",
          "thumbnail.webp"
        );
        if (fs.existsSync(thumbnailPath)) {
          return {
            serviceId,
            url: `/static/images/xelosani/${xelosaniProfId}/services/${serviceId}/thumbnail/thumbnail.webp`,
          };
        }
        return null;
      })
      .filter(Boolean);

    res.json({ thumbnails });
  } catch (error) {
    console.log(error);
  }
};

const get_all_service_image_names_and_paths = async (req, res, next) => {
  const {profId, publicId} = req.params
  try {
    const base = path.join(__dirname + `/../images/xelosani/${profId}/services/${publicId}`)
    fs.readdir(`${base}/gallery/medium`, { withFileTypes: true }, (err, entries) => {
      if (err) {
        console.log(err)
        return console.log("error while looping filenames", err)
      }
      
      const dirs = entries
      .map((entry) => {
        const fullPath = path.join(base, "gallery/medium", entry.name);
        const stats = fs.statSync(fullPath);

        return {
          name: entry.name,
          is_user_added: false,
          type: "image/webp",
          size: stats.size,
        };
      });


      fs.stat(`${base}/thumbnail/medium/thumbnail.webp`, (statErr, stats) => {
        if (statErr) {
          console.error("Error while stat-ing thumbnail:", statErr);
          return res.status(200).json({
            gallery: dirs
          })
        }
  
        const thumbnail = {
          name: "thumbnail.webp",
          is_user_added: false,
          size: stats.size,
          type: "image/webp",
        };
  
        res.status(200).json({
          thumbnail,
          gallery: dirs
        })
      })

    });
  } catch (error) {
    console.log("isthiserror", error)
  }
}

const get_service_gallery_count = (req, res, next) => {
  const {profId, publicId} = req.params
  try {
    fs.readdir(
      path.join(__dirname, `/../images/xelosani/${profId}/services/${publicId}/gallery/medium`), 
      (err, files) => {
        if (err) {
          throw new Error(err)
        }
        res.status(200).json({count: files.length})
      }
    )
  } catch (error) {
    console.log(error)
  }
}

const update_service_images = async (req, res, next) => {
  const {xelosaniProfId, serviceId} = req.params
  try {
    const filePath = path.join(
      __dirname,
      `/../images/xelosani/${xelosaniProfId}/services/${serviceId}`
    );

    await handleFileUpload({
      req,
      filePath,
      destination: "service",
    });

    res.status(200).json({message: "success"})
  } catch (error) {
    console.log(error);
  }
}

const delete_service_image = async (req, res, next) => {
  try {
    const session = await verify_user(req);
    if (session.profId !== req.body.xelosaniProfId) throw new Error(401);
    const {filename, prop, xelosaniProfId, serviceId} = req.body

    await fs.promises.rm(path.join(__dirname, `/../images/xelosani/${xelosaniProfId}/services/${serviceId}/${prop}/${filename}`), {force: true})
    res.status(200).json({message: "ფოტო წაშლილია."})
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  upload_profile_picture,
  delete_service_image,
  get_all_service_image_names_and_paths,
  profile_image_no_id,
  stream_service_thumbnails,
  upload_service_images,
  get_user_profile_image,
  get_service_gallery_count,
  update_service_images,
};
