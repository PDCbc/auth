#!/bin/bash

# DACS Build Script
# ------------------
# This script builds DACS, Apache, and their dependancies from source.
# 
# It is based on instructions at: http://dacs.dss.ca/man/dacs.quick.7.html
#
# The script completes the following steps:
#
#   1) Download, Configure, Build, and Install openssl and expat.
#   2) Download, Configure, Build, and Install apache (and APR)
#   3) Download, Configure, Build, and Install DACS
#   4) Enable DACS to work with Apache
#
# 
# By default the script uses a sub-directory (dacs_build) of the current directory.
#   To change this, update the BUILD_DIR variable at the top of the script.
#
# By default the script installs all sources into /usr/local/<name-of-software>.
#   To change this, update the INSTALL variable at the top of the script. 
#
# To force a rebuild of all sources run the script with the 'rebuild' argument.
#   e.g. $ ./build_dacs.sh rebuild
#
# Without the rebuild arguement existing binaries may be used instead of recompiled from source.
#

# Variables local to the script. 
# 

CURR=$(pwd)
BUILD_DIR=$CURR/dacs_build  #directory where we are building things
INSTALL=/usr/local      #directory where we are installing everything

DACS_OWNER=www-data
DACS_GROUP=www-data

EXPAT_SRC=$BUILD_DIR/expat
OPENSSL_SRC=$BUILD_DIR/openssl
APACHE_SRC=$BUILD_DIR/apache
APR=$APACHE_SRC/srclib/apr
APR_UTIL=$APACHE_SRC/srclib/apr-util
DACS_SRC=$BUILD_DIR/dacs

EXPAT=$INSTALL/expat
OPENSSL=$INSTALL/openssl
APACHE=$INSTALL/apache
DACS=$INSTALL/dacs

# Export variables here, will be available after the script runs.
export APACHE_RUN=$APACHE/bin/apachectl

if [ $1 = 'rebuild' ]; then
    echo "REBUILD set"
    REBUILD=true
else
    echo "REBUILD not set"
    REBUILD=false
fi

# Some Colors
# 

RED='\033[0;31m'
NC='\033[0m'        # No Color
GREEN='\033[0;32m'
YELLOW='\033[0;33m'

# Run updates
#

sudo apt-get update
sudo apt-get upgrade -y

# Install packages that we will depend on

sudo apt-get install libpcre3 libpcre3-dev libpam-dev -y

echo -e "${YELLOW}Will build sources inside ${BUILD_DIR} and install to ${INSTALL}${NC}"

# Make a directory to do all of the building in
#


mkdir -p $BUILD_DIR

# first get all of the external libraries we may need. 
#   * expat v2.1.0
#   * openssl v1.0.2d
#
if [ ! -f $BUILD_DIR/expat.tar.gz ]; then 
    echo "Getting fresh copy of expat v.2.1.0" 
    wget http://downloads.sourceforge.net/project/expat/expat/2.1.0/expat-2.1.0.tar.gz -O $BUILD_DIR/expat.tar.gz
else
    echo $BUILD_DIR"/expat.tar.gz already exists, will not fetch a new copy"
fi
if [ ! -f $BUILD_DIR/openssl.tar.gz ]; then 
    echo "Getting fresh copy of openssl 1.0.2d" 
    wget http://www.openssl.org/source/openssl-1.0.2d.tar.gz -O $BUILD_DIR/openssl.tar.gz
else
    echo $BUILD_DIR"/openssl.tar.gz already exists, will not fetch a new copy"
fi

# Unpack libraries 
#


if [ [ $REBUILD = true ] || [ ! -d $OPENSSL_SRC ] || [ ! -d $EXPAT_SRC ] ] ; then

    rm -rf $EXPAT_SRC
    rm -rf $OPENSSL_SRC
    
    sudo rm -rf $EXPAT
    sudo rm -rf $OPENSSL

    mkdir -p $EXPAT_SRC
    mkdir -p $OPENSSL_SRC

    echo "Unpacking source into: "$EXPAT_SRC" and "$OPENSSL_SRC

    tar -ixzf $BUILD_DIR/expat.tar.gz -C $EXPAT_SRC --strip-components=1
    tar -ixzf $BUILD_DIR/openssl.tar.gz -C $OPENSSL_SRC --strip-components=1

fi

# Configure, make, and install expat
#

cd $EXPAT_SRC

echo -e "${YELLOW}Attempting to conifgure expat${NC}"

sudo ./configure --prefix=$EXPAT

RC=$?
if [ $RC != 0 ]; then
    echo -e "${RED}FAILURE: Could not configure expat.${NC}"
    exit $RC
else
    echo -e "${GREEN}expat successfully configured, no errors.${NC}"
fi

echo -e "${YELLOW}Attempting to make expat${NC}"

if [ $REBUILD = true ]; then
    sudo make clean
fi

sudo make

RC=$?
if [ $RC != 0 ]; then
    echo -e "${RED}FAILURE: Could not make expat.${NC}"
    exit $RC
else
    echo -e "${GREEN}expat successfully make, no errors.${NC}"
fi

echo -e "${YELLOW}Attempting to make install expat${NC}"
sudo make install
RC=$?
if [ $RC != 0 ]; then
    echo -e "${RED}FAILURE: Could not install expat.${NC}"
    exit $RC
else
    echo -e "${GREEN}expat successfully installed to ${EXPAT}, no errors.${NC}"
fi

# Configure, make, and install Openssl
#

cd $OPENSSL_SRC

echo -e "${YELLOW}Attempting to configure openssl${NC}"
sudo ./config --prefix=$OPENSSL --openssldir=$OPENSSL -fPIC shared

RC=$?
if [ $RC != 0 ]; then
    echo -e "${RED}FAILURE: Could not configure openssl.${NC}"
    exit $RC
else
    echo -e "${GREEN}openssl successfully configured, no errors.${NC}"
fi

echo -e "${YELLOW}Attempting to make openssl${NC}"

if [ $REBUILD = true ]; then
    sudo make clean
fi
sudo make


RC=$?
if [ $RC != 0 ]; then
    echo -e "${RED}FAILURE: Could not make openssl.${NC}"
    exit $RC
else
    echo -e "${GREEN}openssl successfully maked, no errors.${NC}"
fi

echo -e "${YELLOW}Attempting to install openssl${NC}"
sudo make install

RC=$?
if [ $RC != 0 ]; then
    echo -e "${RED}FAILURE: Could not install openssl.${NC}"
    exit $RC
else
    echo -e "${GREEN}openssl successfully installed, no errors.${NC}"
fi

# Download Apache and associated libs
#

cd $BUILD_DIR

if [ ! -f apache.tar.bz2 ]; then
    echo "Could not find compressed apache sources in apache.tar.bz2, redownloading into apache.tar.bz2"
    wget http://apachemirror.ovidiudan.com//httpd/httpd-2.4.16.tar.bz2 -O $BUILD_DIR/apache.tar.bz2
else
    echo "Found compressed apache sources in apache.tar.bz2, using these..."
fi

if [ ! -f apr.tar.gz ]; then
    echo "Could not find compressed apr sources in apr.tar.gz, redownloading into apr.tar.gz"
    wget http://mirror.csclub.uwaterloo.ca/apache//apr/apr-1.5.2.tar.gz  -O $BUILD_DIR/apr.tar.gz 
else
    echo "Found compressed apache sources in apr.tar.gz, using these..."
fi

if [ ! -f apr-util.tar.gz ]; then
    echo "Could not find compressed apr sources in apr-util.tar.gz, redownloading into apr-util.tar.gz"
    wget http://mirror.csclub.uwaterloo.ca/apache//apr/apr-util-1.5.4.tar.gz  -O $BUILD_DIR/apr-util.tar.gz 
else
    echo "Found compressed apache sources in apr-util.tar.gz, using these..."
fi

if [ $REBUILD = true ] || [ ! -d $APACHE_SRC ] ; then

    echo -e "${YELLOW}Using fresh apache and apr sources${NC}"

    rm -rf $APACHE_SRC
    sudo rm -rf $APACHE

    mkdir -p $APACHE_SRC
    mkdir -p $APR
    mkdir -p $APR_UTIL

    echo "unpacking apache"
    tar -ixf $BUILD_DIR/apache.tar.bz2 -C $APACHE_SRC --strip-components=1
    echo "unpacking apr"
    tar -ixzf $BUILD_DIR/apr.tar.gz -C $APR --strip-components=1 
    echo "unpacking apr-util"
    tar -ixzf $BUILD_DIR/apr-util.tar.gz -C $APR_UTIL --strip-components=1 
   
fi

cd $APACHE_SRC

echo -e "${YELLOW}Attempting to configure apache${NC}"

sudo ./configure --prefix=$APACHE --with-ssl=$OPENSSL --enable-ssl --with-included-apr

RC=$?
if [ $RC != 0 ]; then
    echo -e "${RED}FAILURE: Could not configure apache.${NC}"
    exit $RC
else
    echo -e "${GREEN}apache successfully configured, no errors.${NC}"
fi

if [ $REBUILD = true ]; then
    sudo make clean
fi
sudo make


RC=$?
if [ $RC != 0 ]; then
    echo -e "${RED}FAILURE: Could not make apache.${NC}"
    exit $RC
else
    echo -e "${GREEN}apache successfully maked, no errors.${NC}"
fi

sudo make install

RC=$?
if [ $RC != 0 ]; then
    echo -e "${RED}FAILURE: Could not install apache.${NC}"
    exit $RC
else
    echo -e "${GREEN}apache successfully installed, no errors.${NC}"
fi

cd $BUILD_DIR

echo -e "${YELLOW}Starting to build DACS${NC}"

if [ ! -f dacs.tbz ]; then

    echo "Could not find compressed DACS sources, redownloading and storing in ${BUILD_DIR}/dacs.tbz"
    wget http://dacs.dss.ca/releases/dacs-1.4.35/dacs-1.4.35.tbz -O $BUILD_DIR/dacs.tbz

fi

if [ $REBUILD = true ] || [ ! -d $DACS_SRC ]; then

    rm -rf $DACS_SRC
    mkdir -p $DACS_SRC

    echo "Unpacking dacs.tbz into ${DACS_SRC}"
    tar -ixvf $BUILD_DIR/dacs.tbz -C $DACS_SRC --strip-components=1

fi

# Configure, Build, and Install DACS.
#

cd $DACS_SRC/src

./configure --prefix=$DACS --with-expat=$EXPAT --with-apache=$APACHE --with-apache-apr=$APR --with-apache-apr-config=$APR/apr-1-config --disable-bdb


RC=$?
if [ $RC != 0 ]; then
    echo -e "${RED}FAILURE: Could not configure dacs.${NC}"
    exit $RC
else
    echo -e "${GREEN}dacs successfully configured, no errors.${NC}"
fi

echo -e "${YELLOW}Attempting to make DACS sources${NC}"

if [ $REBUILD = true ]; then
    make clean
fi

make

RC=$?
if [ $RC != 0 ]; then
    echo -e "${RED}FAILURE: Could not make dacs.${NC}"
    exit $RC
else
    echo -e "${GREEN}dacs successfully maked, no errors.${NC}"
fi

# Put configuration files in the src directory for the install to consume

# remove existing files if they exist.

rm -f .ownername
rm -f .groupname

echo $DACS_OWNER > .ownername
echo $DACS_GROUP > .groupname

sudo make install

RC=$?
if [ $RC != 0 ]; then
    echo -e "${RED}FAILURE: Could not install dacs.${NC}"
    exit $RC
else
    echo -e "${GREEN}dacs successfully installed, no errors.${NC}"
fi

# Enable Apache and DACS 
#

cd $DACS_SRC/apache

sudo make tag

sudo make install
