#!/bin/bash

# Takes arguments: username, clinician_id, endpoint_id, juri, passwd

USER=$1
CLINICIAN=$2
ENDPOINT=$3
JURI=$4
PASS=$5

DACS_ROLEFILE=/etc/dacs/federations/pdc.dev/roles

# Add user to DACS
#
if( dacspasswd -uj ${JURI} -l | grep ${USER})
then
	echo "Existing DACS user replaced"
	/usr/bin/dacspasswd -uj ${JURI} -d ${USER}
fi

/usr/bin/dacspasswd -uj ${JURI} -p ${PASS} -a ${USER}


# Add user to DACS_ROLEFILE, notify if overwriting
#
if ( cat ${DACS_ROLEFILE} | grep -qio ^${USER}: )
then
	echo "Existing user role replaced"
	sed -i /${USER}:/d ${DACS_ROLEFILE}
fi
echo ${USER}:admin | tee -a ${DACS_ROLEFILE}


# Set account private data
#
/usr/bin/dacspasswd -uj $JURI -pds '{"clinician":"'$CLINICIAN'", "clinic":"'$ENDPOINT'"}' -- $USER
