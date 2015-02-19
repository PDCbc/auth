FROM ubuntu

# Configure these based on your config.
# Main port for user interactions. Can be exposed.
ENV MAINPORT 8080
EXPOSE 8080
# Private Control Plane port. Avoid exposing this publicly.
ENV CONTROLPORT 8081
EXPOSE 8081

ENV FEDERATION pdc.dev
ENV JURISDICTION TEST
ENV DACS /etc/dacs
ENV KEYFILE $DACS/federations/$FEDERATION/federation_keyfile
# TODO: Should this be jurisdiction specific?
ENV ROLEFILE $DACS/federations/$FEDERATION/roles

# Install DACS
RUN apt-get update && apt-get install -y dacs

# Setup DACS
ADD config /etc/dacs
VOLUME /etc/dacs

# Setup Node
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup | sudo bash -
RUN apt-get install -y nodejs # Installs `node` and `npm`

# Add API
ADD api /api
WORKDIR /api
RUN npm install

# CMD npm start


# Init the container.
# dacskey -uj $JURISDICTION -v $KEYFILE && dacspasswd -uj TEST -p foo -a foo && echo "foo:admin" > $ROLEFILE && npm start
