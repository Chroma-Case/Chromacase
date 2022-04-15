FROM ubuntu:20.04


WORKDIR /carbone_install

RUN apt-get update


RUN apt-get install -y apt-utils

# Install required dependencies on ubuntu server for LibreOffice 7.0+
RUN apt-get install -y wget libxinerama1 libfontconfig1 libdbus-glib-1-2 libcairo2 libcups2 libglu1-mesa libsm6

# remove all old version of LibreOffice
RUN apt remove --purge libreoffice*
RUN apt autoremove --purge

# If you want to use Microsoft fonts in reports, you must install the fonts
# Andale Mono, Arial Black, Arial, Comic Sans MS, Courier New, Georgia, Impact,
# Times New Roman, Trebuchet, Verdana,Webdings)
RUN apt-get install -y ttf-mscorefonts-installer

# If you want to use special characters, such as chinese ideograms, you must install a font that support them
# For example:
RUN apt-get install -y fonts-wqy-zenhei

# Download LibreOffice debian package. Select the right one (64-bit or 32-bit) for your OS.
# Get the latest from http://download.documentfoundation.org/libreoffice/stable
# or download the version currently "carbone-tested":
RUN wget https://downloadarchive.documentfoundation.org/libreoffice/old/7.0.4.2/deb/x86_64/LibreOffice_7.0.4.2_Linux_x86-64_deb.tar.gz



# Uncompress package
RUN tar -zxvf LibreOffice_7.0.4.2_Linux_x86-64_deb.tar.gz
#RUN cd LibreOffice_7.0.4.2_Linux_x86-64_deb/DEBS

# Install LibreOffice
RUN dpkg -i LibreOffice_7.0.4.2_Linux_x86-64_deb/DEBS/*.deb

RUN apt-get install -y nodejs npm

RUN npm install carbone

RUN apt-get install -y vim

CMD cp -r node_modules/ /carbone && cd /carbone && node /carbone/main.js

