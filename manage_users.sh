#!/bin/bash

# Takes arguments: username, clinician_id, endpoint_id, juri

USER=$1
CLINICIAN=$2
ENDPOINT=$3
JURI=$4

`dacspasswd -uj $JURI -pds '{"clinician":"'$CLINICIAN'", "clinic":"'$ENDPOINT'"}' -- $USER`
