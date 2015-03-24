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
