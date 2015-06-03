#!/bin/bash
#
# Exit on errors or unitialized variables
#
set -e -o nounset -x


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
	echo "Usage: dacs_add.sh [clinicianID] [clinicID] [userRole] [optional:userName] [optional:jurisdiction] [optional:password]"
	echo ""
	exit
fi


# Set variables from parameters, prompt when password not provided
#
export DOCTOR=${1}
export CLINIC=${2}
export U_ROLE=${3}
export U_NAME=${4:-$PHYSICIANID}
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


# Auth - Add user to DACS,
#
/usr/bin/dacspasswd -uj ${JURISDICTION} -p ${PASSWORD} -a ${U_NAME} || \
  echo "ERROR: Failed on Auth add."
#
### To Do --- remove old user accounts before adding new ones


# Add user to DACS_ROLEFILE, notify if overwriting
#
#cat ${DACS_ROLEFILE} | grep -io '^${U_NAME}:.+$'
#if (( cat ${DACS_ROLEFILE} | grep -io '^${U_NAME}:.+$' ))
#then
#	echo "Existing user overwritten."
#fi
#
sed -i '/${U_NAME}/d' ${DACS_ROLEFILE}
#
echo ${U_NAME}:admin | tee -a ${DACS_ROLEFILE}
# || \
#  echo "ERROR: Failed appending to ROLEFILE."


# Set private data
#
dacspasswd -uj ${JURISDICTION} -pds '{ "clinician" : "'${DOCTOR}'", "clinic" : "'${CLINIC}'" }' ${U_NAME} || \
	echo "ERROR: Failed to add private data."
