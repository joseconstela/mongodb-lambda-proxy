#!/bin/bash
export NODE_ENV=production

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
PACKAGE_NAME=$(cat package.json \
  | grep name \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

parent_dir="$(dirname "$(pwd)")"
current_folder_name=${PWD##*/}
target_folder_name=${current_folder_name}_pack
zip_file=$PACKAGE_NAME-$PACKAGE_VERSION.zip

echo " Package:           " $PACKAGE_NAME
echo " Version:           " $PACKAGE_VERSION
echo " Parent directory:  " $parent_dir
echo " Current foler:     " $current_folder_name
echo " Target folder:     " $target_folder_name
echo " Zip file:          " $zip_file
echo ""

cd $parent_dir
echo "Removing target folder..."
rm -Rf $target_folder_name
mkdir -p $target_folder_name/src
echo "Copying src..."
cp -R $current_folder_name/src $target_folder_name
echo "Copying packages..."
cp -R $current_folder_name/package*.json $target_folder_name
cd $target_folder_name
echo "Installing dependencies..."
npm i
echo "Zipping..."
cd $parent_dir/$target_folder_name
zip -q -r ../$zip_file *
echo "Clearing..."
rm -Rf $parent_dir/$target_folder_name