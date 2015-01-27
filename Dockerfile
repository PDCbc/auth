FROM ubuntu

# Configure these based on your config.
ENV FEDERATION pdc.dev
ENV JURISDICTION TEST
ENV DACS /etc/dacs
ENV KEYFILE $DACS/federations/$FEDERATION/federation_keyfile

RUN apt-get update

# Install DACS
RUN apt-get install -y dacs

# Setup DACS
ADD config /etc/dacs

# Build the federation keys if necessary.
# TODO: Should we store the key seperately?
RUN if [ ! -f "$KEYFILE" ]; then echo "Creating Key..." && dacskey -uj $JURISDICTION -v $KEYFILE; fi

# Setup Node
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup | sudo bash -
RUN apt-get install -y nodejs # Installs `node` and `npm`


