#!/bin/bash
#
# Exit on errors or unitialized variables
#
set -o nounset


# Expected input
#
# $0 this script
# $1 Doctor (clinician) ID
# $2 Clinic ID
# $3 User name [optional]
# $4 User role [optional]
# $5 Jurisdiction [optional]
# $6 Password [optional]


# Check parameters
#
if([ $# -lt 3 ] || [ $# -gt 6 ])
then
	echo ""
	echo "Unexpected number of parameters."
	echo ""
	echo "Usage: dacs_add.sh [doctorID] [clinicID] [op:userName] [op:userRole] [op:jurisdiction] [op:password]"
	echo ""
	exit
fi


# Set variables from parameters, prompt when password not provided
#

export DOCTOR=${1}
export CLINIC=${2}
export U_NAME=${3:-$DOCTOR}
export U_ROLE=${4:-admin}
export JURISDICTION=${5:-TEST}
export PASSWORD=${6:-sample}


# Add user to DACS
#
if( dacspasswd -uj ${JURISDICTION} -l | grep ${U_NAME})
then
	echo "Existing DACS user replaced"
	/usr/bin/dacspasswd -uj ${JURISDICTION} -d ${U_NAME}
fi
/usr/bin/dacspasswd -uj ${JURISDICTION} -p ${PASSWORD} -a ${U_NAME}


# Add user to DACS_ROLEFILE, notify if overwriting
#
if ( cat ${DACS_ROLEFILE} | grep -qio ^${U_NAME}: )
then
	echo "Existing user role replaced"
	sed -i /${U_NAME}:/d ${DACS_ROLEFILE}
fi
echo ${U_NAME}:admin | tee -a ${DACS_ROLEFILE}


# Set private data
#
( dacspasswd -uj ${JURISDICTION} -pds '{ "clinician" : "'${DOCTOR}'", "clinic" : "'${CLINIC}'" }' ${U_NAME} )|| \
	echo "ERROR: Failed to add private data."
