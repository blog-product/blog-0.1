const fs = require('fs')

const delImg = path => {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve(true)
            }
          });
    })
}

module.exports = {
    delImg
}