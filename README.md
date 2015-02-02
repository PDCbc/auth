# Build

    docker build -t dacs .

# Running in Development

    docker run -dti -v $YOUR_CONFIG_FOLDER:/etc/dacs dacs

# Running in Deployment

    docker run -dti -v $YOUR_CONFIG_FOLDER:/etc/dacs:ro dacs
