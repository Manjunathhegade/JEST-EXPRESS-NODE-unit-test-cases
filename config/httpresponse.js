module.exports = {
    Status: ResponseCodes(),
    Message: ResponseMessages()
}

function ResponseCodes(){
    return {
        OK: 200,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500
    }
};

function ResponseMessages(){
    return {
        OK: 'Success!!',
        BAD_REQUEST: 'Bad Request!!',
        UNAUTHORIZED: 'Unauthorized!!',
        FORBIDDEN: 'Access is forbidden!!',
        NOT_FOUND: 'Not Found!!',
        INTERNAL_SERVER_ERROR: 'Internal Server Error!!'
    }
};