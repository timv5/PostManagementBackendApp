const status = {
    success: {
        200: {
            status: 200,
            message: "OK"
        },
        201: {
            status: 201,
            message: "CREATED"
        },
        202: {
            status: 202,
            message: "ACCEPTED"
        },
        203: {
            status: 200,
            message: "NON-AUTHORATIVE INFO"
        },
        204: {
            status: 204,
            message: "NO CONTENT"
        }
    },
    clientError: {
        "400": {
            status: 400,
            message: "BAD REQUEST"
        },
        "401": {
            status: 401,
            message: "UNAUTHORIZED"
        },
        "403": {
            status: 403,
            message: "FORBIDDEN"
        },
        "404": {
            status: 404,
            message: "NOT FOUND"
        }
    },
    serverError: {
        "500": {
            status: 500,
            message: "INTERNAL SERVER ERROR"
        }
    }
};

module.exports = status;
