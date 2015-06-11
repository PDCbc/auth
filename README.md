# API 

This component provides the following API for authentication and verification of user credentials and/or sessions. 

The auth component acts as a shell around the DACS authentication management system. It has the following routes: 

- `GET: /auth/login`
    + responds by sending the user to a login screen. 
- `POST: /auth/login`
    + This route will generate a cookie that can be used to track a user through the system.
    + requires the following items be embedded in request json body: 
        * username as: `user`
        * password as: `pass`
        * jurisdiction as : `juri`
        * respond as : `respond`

    + will return a JSON string of the following format: 
        * `{ "cookie" : "COOKIE_STRING" , "message" : "SOME MESSAGE" }`
        * The response status code will be one of: 
            - `200` - Authentication completed successfully
            - `400` - Request was not well formed (see above)
            - `401` - The user could not be authenticated due to invalid credentials.  
            - `500` - An error occurred in the authentication process.
        * In the event of a failed authentication (status code `500` , `400`, or `401`) the `cookie` field of the response will be `null` and the `message` field will contain an error description.
        * If the authentication is successful (status code `200`) the `cookie` field of the response will be a string that is the cookie for the authenticated user. The message field will contain a success message. 

- `POST: /verify` 
    + This route verifies that an existing cookie is valid.
    + This route requires that the cookie be a string embedded in the body of the post request. 
        * The cookie string must be accessible via: `request.body.bakedCookie`
    + This route will return the following format: 
        * `{ "data" : DATA_OBJECT, "message" : "SOME MESSAGE" }`
        * The response status code will be one of: 
            - `200` - Verification completed successfully
            - `400` - Request for verification was not well formed, i.e. there was not `request.body.bakedCookie` field
            - `401` - Verification failed, this means the cookie now invalid. The cookie may be expired or have been modified/tampered with. 
            - `500` - Verification failed due to an error during verification. 
        * The `data` field of the response will contain an object that has user information which can be used to identify the user later: 
            - `user.clinic`
            - `user.clinician`'

# Build

    docker build -t dacs .

# Running in Development

    docker run -dti -v $YOUR_CONFIG_FOLDER:/etc/dacs dacs

# Running in Deployment

    docker run -dti -v $YOUR_CONFIG_FOLDER:/etc/dacs:ro dacs

# Changing Ports

Override default ports with environment variables.  It can be done...

>On the command line

    export MAINPORT=3005
    export CONTROLPORT=3006


>Or in a Dockerfile

    ENV MAINPORT 3005
    ENV CONTROLPORT 3006
