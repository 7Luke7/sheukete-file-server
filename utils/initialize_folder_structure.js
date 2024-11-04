const fs = require('fs')

const create_xelosani_profile_picture_folder_if_not_exists = async () => {
    try {
        if (!fs.existsSync("../images/xelosani")) {
          fs.mkdirSync("profile");
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    create_xelosani_profile_picture_folder_if_not_exists
}