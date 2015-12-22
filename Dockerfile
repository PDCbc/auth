# Dockerfile for the PDC's Auth service
#
#
# DACS-based authentication module used by the PDC's Visualizer.
#
# Example:
# sudo docker pull pdcbc/auth
# sudo docker run -d --name=auth -h auth --restart=always \
#   -v /pdc/data/config/dacs/:/etc/dacs/:rw \
#   pdcbc/auth
#
# Folder paths
# - DACS config:     -v </path/>:/etc/dacs/:rw
#
# Modify default settings
# - DACS federation: -e DACS_FEDERATION=<string>
# -    jurisdiction: -e DACS_JURISDICTION=<string>
# - Node secret:     -e NODE_SECRET=<string>
#
#
FROM phusion/passenger-nodejs
MAINTAINER derek.roberts@gmail.com


# Packages
#
RUN apt-get update; \
    apt-get install -y \
      dacs; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


# Prepare /app/ and /etc/dacs/ folders
#
WORKDIR /app/
COPY . .
RUN chown -R app:app /app/ /etc/dacs/; \
    mkdir -p /etc/dacs/; \
    /sbin/setuser app npm install


# Create startup script and make it executable
#
RUN mkdir -p /etc/service/app/; \
    ( \
      echo "#!/bin/bash"; \
      echo "#"; \
      echo "set -e -o nounset"; \
      echo ""; \
      echo ""; \
      echo "# Set variables, exports for npm"; \
      echo "#"; \
      echo "export MAINPORT=\${PORT_AUTH_M:-3005}"; \
      echo "export CONTROLPORT=\${PORT_AUTH_C:-3006}"; \
      echo "export JURISDICTION=\${DACS_JURISDICTION:-TEST}"; \
      echo "export FEDERATION=\${DACS_FEDERATION:-pdc.dev}"; \
      echo "export SECRET=\${NODE_SECRET:-notVerySecret}"; \
      echo "#"; \
      echo "export DACS=/etc/dacs"; \
      echo "export ROLEFILE=\${DACS}/federations/\${FEDERATION}/roles"; \
      echo "export KEYFILE=\${DACS}/federations/\${FEDERATION}/federation_keyfile"; \
      echo ""; \
      echo ""; \
      echo "# Prepare DACS"; \
      echo "#"; \
      echo "if [ ! -d \${DACS}/federations/\${FEDERATION}/\${JURISDICTION}/ ]"; \
      echo "then"; \
      echo "  ("; \
      echo "    mkdir -p \${DACS}/federations/\${FEDERATION}/\${JURISDICTION}/"; \
      echo "    cp /app/federations/dacs.conf \${DACS}/federations/"; \
      echo "    cp /app/federations/site.conf \${DACS}/federations/"; \
      echo "    touch \${ROLEFILE}"; \
      echo "    touch \${KEYFILE}"; \
      echo "  )||("; \
      echo "    ERROR: DACS initialization unsuccessful >&2"; \
      echo "  )"; \
      echo "fi"; \
      echo "chown -R app:app \${DACS}/"; \
      echo "/sbin/setuser app dacskey -uj \${JURISDICTION} -v \${KEYFILE}"; \
      echo ""; \
      echo ""; \
      echo "# Start service"; \
      echo "#"; \
      echo "cd /app/"; \
      echo "/sbin/setuser app npm start"; \
    )  \
      >> /etc/service/app/run; \
    chmod +x /etc/service/app/run


# Run Command
#
CMD ["/sbin/my_init"]


# Ports and volumes
#
EXPOSE 3005
EXPOSE 3006
#
VOLUME /etc/dacs/
