#!/bin/bash
#
# Exit on errors or unitialized variables
#
set -o nounset


# Expected input
#
# $0 this script
# $1 Endpoint number
# $2 Clinician number
# $3 Visualizer login name [optional]
# $4 Jurisdiction [optional]
# $5 Password [optional]


# Check parameters
#
if([ $# -lt 3 ] || [ $# -gt 6 ])
then
	echo ""
	echo "Unexpected number of parameters."
	echo ""
	echo "Usage: dacs_add.sh [userName] [userRole] [doctorID] [clinicID] [optional:jurisdiction] [optional:password]"
	echo ""
	exit
fi


# Set variables from parameters, prompt when password not provided
#
export U_NAME=${1}
export U_ROLE=${2}
export DOCTOR=${3}
export CLINIC=${4}
export JURISDICTION=${5:-TEST}
#
if [ $# -eq  5 ]
then
	echo "Please provide a password for user "${U_NAME}":"
	read -s PASSWORD
	echo ""
else
	PASSWORD=${6}
fi


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
if ( cat ${DACS_ROLEFILE} | grep -io ^${U_NAME}: )
then
	echo "Existing user role replaced"
	sed -i /${U_NAME}:/d ${DACS_ROLEFILE}
fi
echo ${U_NAME}:admin | tee -a ${DACS_ROLEFILE}


# Set private data
#
( dacspasswd -uj ${JURISDICTION} -pds '{ "clinician" : "'${DOCTOR}'", "clinic" : "'${CLINIC}'" }' ${U_NAME} )|| \
	echo "ERROR: Failed to add private data."
