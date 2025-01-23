const limits = require("./limits.json")

module.exports = class SizeChecker {
    constructor(size, column) {
        this.size = size
        this.column = column
    }

    check_profile_picture_size() {
        if (this.size > 2 * 1024 * 1024) {
            return `ფაილის ზომა აღემატება ${limits[this.column]} ლიმიტს.`
        } else {
            return "valid"
        }
    }
}