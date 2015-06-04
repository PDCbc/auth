#!/bin/bash
#
# Exit on errors or unitialized variables
#
set -e -o nounset


# Expected input
#
# $0 this script
# $1 Endpoint number
# $2 Jurisdiction [optional]


# Check parameters
#
if([ $# -eq 0 ]||[ $# -gt 2 ])
then
	echo ""
	echo "Unexpected number of parameters."
	echo ""
	echo "Usage: dacs_remove.sh [userName] [optional:jurisdiction]"
	echo ""
	exit
fi


# Set variables from parameters
#
export U_NAME=${1}
export JURISDICTION=${2:-$DACS_JURISDICTION}


# Remove user from DACS
#
( /usr/bin/dacspasswd -uj ${JURISDICTION} -d ${U_NAME} )|| \
  echo "ERROR: Failed on Auth remove."


# Remove user from DACS_ROLEFILE
#
if ( cat ${DACS_ROLEFILE} | grep -io ^${U_NAME}: )
then
	sed -i /${U_NAME}:/d ${DACS_ROLEFILE}
else
  echo "ERROR: Not found in ROLEFILE"
fi
