const fs = require('fs');
const path = require('path');

const create_user_profile_picture_folder_if_not_exists = async (role) => {
    try {
        if (!fs.existsSync(path.join(__dirname + `/../images/${role}/profile`))) {
          fs.mkdirSync(path.join(__dirname + `/../images/${role}/profile`));
        }
    } catch (error) {
        console.log("ERRARARA: ", error)
    }
}

const create_services_picture_folder_if_not_exists = async (userId, serviceId) => {
    try {
        if (!fs.existsSync(path.join(__dirname + `/../images/xelosani/${userId}`))) {
            fs.mkdirSync(path.join(__dirname + `/../images/xelosani/${userId}`));
        }
        if (!fs.existsSync(path.join(__dirname + `/../images/xelosani/${userId}/services`))) {
            fs.mkdirSync(path.join(__dirname + `/../images/xelosani/${userId}/services`));
        }
        if (!fs.existsSync(path.join(__dirname + `/../images/xelosani/${userId}/services/${serviceId}`))) {
            fs.mkdirSync(path.join(__dirname + `/../images/xelosani/${userId}/services/${serviceId}`));
        }
        if (!fs.existsSync(path.join(__dirname + `/../images/xelosani/${userId}/services/${serviceId}/thumbnail`))) {
            fs.mkdirSync(path.join(__dirname + `/../images/xelosani/${userId}/services/${serviceId}/thumbnail`));
        }
        if (!fs.existsSync(path.join(__dirname + `/../images/xelosani/${userId}/services/${serviceId}/gallery`))) {
            fs.mkdirSync(path.join(__dirname + `/../images/xelosani/${userId}/services/${serviceId}/gallery`));
        }
    } catch (error) {
        console.log("ERRARARA: ", error)
    }
}

module.exports = {
    create_user_profile_picture_folder_if_not_exists,
    create_services_picture_folder_if_not_exists
}