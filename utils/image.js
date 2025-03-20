const { IncomingForm } = require("formidable");
const { compress_profile_image } = require("./compress");
const path = require("path");
const fs = require("fs").promises;
const SizeChecker = require("../controllers/size_checker");

const handleFileUpload = ({ req, filePath, destination, profId }) => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    const filePromises = [];
    let sizes

    form.onPart = (part) => {
      if (!part.originalFilename) {
        form._handlePart(part);
        return;
      }
      
      let chunks = [];
      let fileSize = 0;
      let property = destination;
      if (destination === "service") {
        sizes = {
          small: [100, 120, 120],
          medium: [75, 460, 460],
          large: [90, 1920, 1080],
        };
        if (part.name.toLowerCase().includes("thumbnail")) {
          sizes["browse"] = [60, 300, 300];
          property = "thumbnail";
        } else if (part.name.includes("gallery")) {
          property = "gallery";
        }
      } else if (destination === 'profile') {
        sizes = {
          small: [100, 50, 50],
          medium: [100, 340, 340],
          browse: [100, 100, 100],
          large: [90, 920, 920],
        };
      }

      part.on("data", (chunk) => {
        fileSize += chunk.length;
        const response = new SizeChecker(fileSize, property).check_profile_picture_size();
        if (response !== "valid") {
          // Stop processing if the size check fails
          part.removeAllListeners();
          return reject({
            message: response,
            status: 500,
          });
        }
        chunks.push(chunk);
      });

      const filePromise = new Promise((fileResolve, fileReject) => {
        part.on("end", async () => {
          try {
            const keys = Object.keys(sizes);
            const fileBuffer = Buffer.concat(chunks);

            const writePromises = keys.map(async (key) => {
              if (!sizes[key]) {
                console.warn(`Skipping key ${key} because its value is undefined`);
                return;
              }

              const compressedBuffer = await compress_profile_image(fileBuffer, ...sizes[key]);
              const complete_image_path = destination === "service"
                ? `${filePath}/${property}/${key}/${part.name}.webp`
                : (destination === "profile" && filePath ? `${filePath}/${key}/${profId}.webp` : null);
              if (!complete_image_path) {
                throw new Error("Invalid file path");
              }

              await fs.mkdir(path.dirname(complete_image_path), { recursive: true });
              await fs.writeFile(complete_image_path, compressedBuffer, { flag: "w" });
            });
            await Promise.all(writePromises);
            fileResolve("success");
          } catch (error) {
            console.error("Error during file processing:", error);
            fileReject({
              message: "დაფიქსირდა შეცდომა ფაილის პოცესირებისას.",
              status: 500,
            });
          }
        });
      });
      
      filePromises.push(filePromise);
    };

    form.parse(req, (err) => {
      if (err) {
        console.error("Form parsing error:", err.message);
        return reject({
          message: "დაფიქსირდა შეცდომა ფაილის ატვირთვისას.",
          status: 500,
        });
      }
      Promise.all(filePromises)
        .then(() => resolve("success"))
        .catch(reject);
    });
  });
};

const streamCompressedImage = (filePath, res) => {
  const readStream = require("fs").createReadStream(filePath);
  res.writeHead(200, { "Content-Type": "image/webp" });
  readStream.pipe(res);
};

module.exports = { handleFileUpload, streamCompressedImage };
