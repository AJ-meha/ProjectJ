/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for t`he specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// [START import]
const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage')();
const sharp = require('sharp')
const _ = require('lodash');
const path = require('path');
const os = require('os');
const admin=require('firebase-admin')
admin.initializeApp(functions.config().firebase)
// [END import]

// [START generateThumbnail]
/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 */
// [START generateThumbnailTrigger]
exports.generateThumbnail = functions.storage.object().onChange((event) => {
    const object = event.data; // The Storage object.

    console.log(object)
    const ref=admin.database().ref()
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    const resourceState = object.resourceState; // The resourceState is 'exists' or 'not_exists' (for file/folder deletions).
    const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.
    
    const SIZES = [64, 256, 512]; // Resize target width in pixels
  
    if (!contentType.startsWith('image/') || resourceState === 'not_exists') {
      console.log('This is not an image.');
      return null;
    }
  
    if (_.includes(filePath, '_thumb')) {
      console.log('already processed image');
      return null;
    }
  
    if (resourceState === 'exists' && metageneration > 1) {
    console.log('This is a metadata change event.');
    return null;
    }
  
    const fileName = filePath.split('/').pop();
    const bucket = gcs.bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const file=bucket.file(filePath);
    let thumbsArr=[];
    let counter=0;
    return bucket.file(filePath).download({
      destination: tempFilePath
    }).then(() => {
  
      _.each(SIZES, (size) => {
        console.log("sizes=="+size);
        counter +=1;
        let newFileName = `${fileName}_thumb.png`
        let newFileTemp = path.join(os.tmpdir(), newFileName);
        let newFilePath = `thumbs/${size}/${newFileName}`
        thumbsArr.push(newFilePath)
        sharp(tempFilePath)
          .resize(size, null)
          .toFile(newFileTemp, (err, info) => {
            if(err){
                console.log(err.info)
            }
            bucket.upload(newFileTemp, {
              destination: newFilePath
            }).then(()=>{
              const thumbFile=bucket.file(newFilePath);
              const config={
                  action:'read',
                  expires:'03-09-2491'
              };
              if(SIZES.length === counter)
                return ref.child('uploadThumbs').push({path:fileName,thumburl:thumbsArr})
              else
                return true;
              // return Promise.all([
              //     thumbFile.getSignedUrl(config),
              //     file.getSignedUrl(config)
              // ])
              // .then(results=>{
              //   const thumbResult=results[0]
              //   const originalResult=results[1]
              //   const thumbFileUrl=thumbResult[0]
              //   const fileUrl=originalResult[0]
              //   console.log(fileUrl+"=="+thumbFileUrl)
              //   return ref.child('uploadThumbs').push({path:fileName,thumburl:thumbFileUrl})
            // }).catch(err => console.error(err));
          }).catch(err => console.error(err));
                 
                
  
          })
          // .then(()=>{
          //       const thumbFile=bucket.file(newFilePath);
          //       const config={
          //           action:'read',
          //           expires:'03-09-2491'
          //       };
          //       return thumbFile.then(signedUrls => {
          //         // signedUrls[0] contains the file's public URL
          //         file.getSignedUrl(config).then(filesignedUrls => {
          //           // signedUrls[0] contains the file's public URL
          //           const thumbFileUrl=signedUrls[0]
          //           const fileUrl=filesignedUrls[0]
          //           return ref.child('uploadThumbs').push({path:fileUrl,thumburl:thumbFileUrl})
          //         });
          //       });
          //   }).catch(err => console.error(err));

  
      })
      return true;
    }).then(() => fs.unlinkSync(tempFilePath));
});
// [END generateThumbnail]