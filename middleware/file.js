const multer = require("multer");

// image types
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        // check if type exists
        const isValid = MIME_TYPE_MAP[file.mimeType];
        let error = new Error('Invalid mimetype');
        if(isValid){
            error = null;
        }
        callback(error, "images/users");
    },
    filename: (req, file, callback) => {
        const fileName = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const fileExtension = MIME_TYPE_MAP[file.mimeType];
        callback(null, fileName + '-' + Date.now() + '.' + fileExtension);
    }
});

module.exports = multer({
    storage: storage
}).single('image');
