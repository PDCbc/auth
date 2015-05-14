#!/bin/bash

export FEDERATION=pdc.dev
export JURISDICTION=TEST
export DACS=/etc/dacs
export KEYFILE=$DACS/federations/$FEDERATION/federation_keyfile
export ROLEFILE=$DACS/federations/$FEDERATION/roles

cd /app

npm install
dacskey -uj $JURISDICTION -v $KEYFILE
dacspasswd -uj $JURISDICTION -p foo -a foo
echo "foo:admin" > $ROLEFILE
npm start
