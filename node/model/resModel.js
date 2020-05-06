class BaseModel {
    constructor(code, data) {
        this.code = code
        if(code === '0000'){
            this.data = data
            this.message = ''
        }else {
            this.data = ''
            this.message = data
        }
    }
}

class SuccessModel extends BaseModel {
    constructor(code, data) {
        super(code, data)
    }
}

class ErrorModel extends BaseModel {
    constructor(code, data) {
        super(code, data)
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}