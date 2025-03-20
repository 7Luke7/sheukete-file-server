const sharp = require("sharp")

const compress_profile_image = async (buffer, quality, width, height) => {
    try {
        const image = sharp(buffer);
        const metadata = await image.metadata();

        let formatOptions = {};
        switch (metadata.format) {
            case 'jpeg' || 'jpg':
                formatOptions = { quality };
                break;
            case 'png':
                formatOptions = { quality };
                break;
            case 'webp':
                formatOptions = { quality };
                break;
            case 'avif':
                formatOptions = { quality };
                break;
            default:
                throw new Error('მხარდაუჭერელი ფაილის ტიპი.');
        }

        const compressedBuffer = await image
            .resize({ width: width, height: height, fit: "inside" })
            [metadata.format](formatOptions).toFormat("PNG").toBuffer()

        return compressedBuffer;
    } catch (error) {
        console.log("Sharp Error: ", error.message)
    }
}

module.exports = {
    compress_profile_image
}