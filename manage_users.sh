#!/bin/bash

# Takes arguments: username, clinician_id, endpoint_id, juri, passwd

USER=$1
CLINICIAN=$2
ENDPOINT=$3
JURI=$4
PASSWD=$5

echo "$PASSWD" | dacspasswd -uj $JURI -pf - -a $USER &> /dev/null

`dacspasswd -uj $JURI -pds '{"clinician":"'$CLINICIAN'", "clinic":"'$ENDPOINT'"}' -- $USER
