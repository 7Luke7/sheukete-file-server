const formidable = require('formidable');

// Make seperate folder for thumbnails and gallery
// When you start working with services and jobposts

const handleFileUpload = ({options, req}) => {
      const form = formidable({
        ...options,
        filter: ({ mimetype }) => mimetype && mimetype.includes('image')
      });
  
      form.parse(req, (err, fields, files) => {
        console.log(fields, files)
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        req.files = files;
        req.fields = fields;
      });
};

module.exports = {handleFileUpload}