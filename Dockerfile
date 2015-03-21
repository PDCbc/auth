FROM ubuntu

# Main port for user interactions. Can be exposed.
#
ENV MAINPORT 8080
EXPOSE 8080

# Private Control Plane port. Avoid exposing this publicly.
ENV CONTROLPORT 8081
EXPOSE 8081

# Environment
#
#ENV FEDERATION pdc.dev
#ENV JURISDICTION TEST
#ENV DACS /etc/dacs
#ENV KEYFILE $DACS/federations/$FEDERATION/federation_keyfile
#ENV ROLEFILE $DACS/federations/$FEDERATION/roles

# Install DACS
#
RUN apt-get update && apt-get install -y dacs

# Setup DACS
#
ADD config /etc/dacs
VOLUME /etc/dacs

# Setup node
#
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup | sudo bash -
RUN apt-get install -y nodejs # Installs `node` and `npm`

# Add API folder
#
ADD api /api
WORKDIR /api

# Copy startup script and make it executable
#
ADD ./scripts/auth.sh /api/auth.sh
RUN chmod +x /api/auth.sh

# Prep node
#
# RUN npm install

# Initialize the container
#
#CMD /api/auth.sh
