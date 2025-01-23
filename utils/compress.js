const sharp = require("sharp")

const compress_profile_image = async (buffer, quality, width, height) => {
    try {
        const image = sharp(buffer);
        const metadata = await image.metadata();

        let formatOptions = {};
        switch (metadata.format) {
            case 'jpeg' || 'jpg':
                formatOptions = { quality: Math.floor(quality / 100 * 6) };
                break;
            case 'png':
                formatOptions = { quality: Math.floor(quality / 100 * 6) };
                break;
            case 'webp':
                formatOptions = { quality: Math.floor(quality / 100 * 6) };
                break;
            case 'avif':
                formatOptions = { quality: Math.floor(quality / 100 * 6) };
                break;
            default:
                throw new Error('მხარდაუჭერელი ფაილის ტიპი.');
        }

        const compressedBuffer = await image
            .resize({ width: width, height: height, fit: 'cover' })
            [metadata.format](formatOptions).toFormat("webp").toBuffer()

        return compressedBuffer;
    } catch (error) {
        console.log("Sharp Error: ", error.message)
    }
}

module.exports = {
    compress_profile_image
}