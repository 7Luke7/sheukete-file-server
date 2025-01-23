const { IncomingForm } = require("formidable");
const { compress_profile_image } = require("./compress");
const path = require("path");
const fs = require("fs");
const SizeChecker = require("../controllers/size_checker");

/* 
  Maybe handleFileUpload function could be improved when user is updating the images
*/
const handleFileUpload = ({ req, filePath, destination, sizes }) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.onPart = (part) => {
      if (!part.originalFilename) {
        form._handlePart(part);
        return;
      }
      let fileSize = 0;
      const chunks = [];
      let property = destination

      if (destination === "service") {
        property = part.name.includes("gallery") ? "gallery" : "thumbnail"
      }

      part.on("data", (chunk) => {
        fileSize += chunk.length;

        const response = new SizeChecker(fileSize, property).check_profile_picture_size();
        if (response !== "valid") {
          part.removeAllListeners();
          return reject({
            message: response,
            status: 500
          });
        }

        chunks.push(chunk);
      });

      part.on("end", async () => {
        try {
          const fileBuffer = Buffer.concat(chunks);
          const compressedBuffer = await compress_profile_image(
            fileBuffer,
            ...sizes
          );

          const complete_image_path = (() => {
            if (destination === "service") {
                return `${filePath}/${property}/${part.name}.webp`;
            }
            if (destination === "profile" && filePath) {
                return filePath;
            }
            return null;
          })();

          fs.mkdirSync(path.dirname(complete_image_path), { recursive: true });
          fs.writeFile(complete_image_path, compressedBuffer, (err) => {
            if (err) {
              console.log("writefileerror: ", err.message)
              return reject(
                {
                  message: "დაფიქსირდა შეცდომა ფაილის შენახვისას, სერვერული შეცდომა.",
                  status: 500
                }
              );
            }

            resolve("success");
          });
        } catch (error) {
          console.error("Error during file processing:", error);
          reject({
            message: "დაფიქსირდა შეცდომა ფაილის პოცესირებისას.",
            status: 500
          });
        }
      });
    };

    form.parse(req, (err) => {
      if (err) {
        console.error("Form parsing error:", err.message);
        reject({
          message: "დაფიქსირდა შეცდომა ფაილის ატვირთვისას.",
          status: 500
        });
      }
    });
  });
};

const streamCompressedImage = (filePath, res) => {
  const readStream = fs.createReadStream(filePath);
  res.writeHead(200, { "Content-Type": "image/webp" });
  readStream.pipe(res);
};

module.exports = { handleFileUpload, streamCompressedImage };
