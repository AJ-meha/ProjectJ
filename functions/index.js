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
var express = require('express');
var cors = require('cors')({origin: true});
const app = express();
var router = express.Router();
const cookieParser = require('cookie-parser')();
// app.use(cors({ origin: true }));
// var firebase = admin.initializeApp(functions.config().firebase);
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

/* RESTFUL APIS */
// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = (req, res) => {
  console.log('Check if request is authorized with Firebase ID token');

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
        'Make sure you authorize your request by providing the following HTTP header:',
        'Authorization: Bearer <Firebase ID Token>',
        'or by passing a "__session" cookie.');
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } 
  admin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
    console.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    return true;
  }).catch((error) => {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
  });
};

// app.use(cors);
// app.use(cookieParser);
app.use(validateFirebaseIdToken);
// build multiple CRUD interfaces:
app.get('/jobs', (req, res) => {
  // if(req.method === 'GET'){
  cors(req, res, () => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({success: true});
  });
  // }
  // else{
  //   res.status(500).send({ error: 'Method not supported!!!' });
  // }
  // let key = req.query.key;
  // var postRef = firebase.database().ref('designs').child(key);
  // postRef.once('value').then(function(snap) {
  
  // });
});
// app.use('/api', router);
exports.main = functions.https.onRequest(app);
exports.jobs = functions.https.onRequest((req, res) => {
  // if(req.method === 'GET'){
  cors(req, res, () => {
    validateFirebaseIdToken(req,res);
    // if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))) {
    //   console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
    //       'Make sure you authorize your request by providing the following HTTP header:',
    //       'Authorization: Bearer <Firebase ID Token>',
    //       'or by passing a "__session" cookie.');
    //   res.status(403).send('Unauthorized');
    //   return;
    // }

    // let idToken;
    // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    //   console.log('Found "Authorization" header');
    //   // Read the ID Token from the Authorization header.
    //   idToken = req.headers.authorization.split('Bearer ')[1];
    // } 
    // admin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
    //   console.log('ID Token correctly decoded', decodedIdToken);
    //   req.user = decodedIdToken;
    //   return true;
    // }).catch((error) => {
    //   console.error('Error while verifying Firebase ID token:', error);
    //   res.status(403).send('Unauthorized');
    // });
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, PUT, DELETE, OPTIONS');
  // res.setHeader('Access-Control-Allow-Headers','Origin, Content-Type, X-Auth-Token');
  // res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Auth-Token, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  let data=[];
  let response={};
  
  var jobRef=admin.database().ref('jobs');
  var dbRef=admin.database().ref();
  var count=0;
  let total_count=0;
  jobRef.on('value', function (snapshot) {
    let jobs=[];
    total_count=snapshot.numChildren();  
    snapshot.forEach( itemSnap => {
      let job_details_id=itemSnap.val().job_details_id
      let job_contact_workplace_id=itemSnap.val().jobs_contact_workplace_id
      let designation='';
      dbRef.child('job_details/').child(job_details_id).once('value').then( function(mediaSnap) {
          // console.log(mediaSnap.val());         
          designation=mediaSnap.val().designation
          dbRef.child('jobs_contact_workplace/').child(job_contact_workplace_id).once('value').then( function(jobContactSnap) {
            count +=1;
            // console.log("count=="+count)
            jobs.push({'job_id':itemSnap.key,'workplace_name':jobContactSnap.val().workplace_name,'designation':designation})
            response["success"]=true;
            response["message"]="Job listing fetched successfully";
            response["data"]=jobs;
            // response["total_count"]=total_count;
            // response["count"]=count;
            if(count === total_count){
              return res.status(200).json(response);
            }
            else{
              return 0;
            }        
          }).catch(err => console.error(err));
          return false;
      }).catch(err => console.error(err));   
        return false;
    })
  })
});
});

exports.jobdetails = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    validateFirebaseIdToken(req,res);
    let job_id=req.query.job_id
    res.setHeader("Access-Control-Allow-Origin", "*");
    let data=[];
    let response={};
    
    
    var jobRef=admin.database().ref('jobs');
    var dbRef=admin.database().ref();
    var count=0;
    let total_count=0;
    dbRef.child('jobs/').child(job_id).once('value').then( function(itemSnap) {
      console.log(itemSnap.val())
      
      // total_count=itemSnap.numChildren();
      let job_details_id=itemSnap.val().job_details_id
      let job_contact_workplace_id=itemSnap.val().jobs_contact_workplace_id
      let job_emp_benefits_id=itemSnap.val().job_emp_benefits_id
      let designation='';
      let employment_type='';
      let employment_type_val=''
      let salary_amount='';
      let salary_unit='';
      let industry='';
      let type='';
      let sub_industry='';
      let employee_benefits='';
      dbRef.child('job_details/').child(job_details_id).once('value').then( function(mediaSnap) {
          designation=mediaSnap.val().designation
          employment_type=mediaSnap.val().employment_type
          type=mediaSnap.val().type
          salary_unit=mediaSnap.val().salary_unit
          salary_amount=mediaSnap.val().salary_amount
          industry=mediaSnap.val().industry
          sub_industry=mediaSnap.val().sub_industry
          dbRef.child('jobs_contact_workplace/').child(job_contact_workplace_id).once('value').then( function(jobContactSnap) {
            // count +=1;
            if(job_emp_benefits_id ===""){
              response["success"]=true;
              response["message"]="Job Details fetched successfully";
              // employment_type_val=dbRef.child('employment_type/').get(employment_type)
              response["data"]={"id":itemSnap.key,"designation":designation,"employment_type":employment_type,"type":type,"workplace_name":jobContactSnap.val().workplace_name,
              "workplace_address":jobContactSnap.val().workplace_address,"salary_amount":salary_amount,"salary_unit":salary_unit,"industry":industry,"sub_industry":sub_industry,"employee_benefits":employee_benefits};
              // response["total_count"]=total_count;
              // response["count"]=count;
              // if(count === total_count){
              return res.status(200).json(response);
            }
            else{
              dbRef.child('job_employee_benefits/').child(job_emp_benefits_id).once('value').then( function(jobEmpBenSnap) {
                employee_benefits=jobEmpBenSnap.val().employee_benefits
                // employment_type_val=dbRef.child('employment_type/').get(employment_type)
                console.log(employee_benefits)
                response["success"]=true;
                response["message"]="Job Details fetched successfully";
                response["data"]={"id":itemSnap.key,"designation":designation,"employment_type":employment_type,"type":type,"workplace_name":jobContactSnap.val().workplace_name,
                "workplace_address":jobContactSnap.val().workplace_address,"salary_amount":salary_amount,"salary_unit":salary_unit,"industry":industry,"sub_industry":sub_industry,"employee_benefits":employee_benefits};
                // response["total_count"]=total_count;
                // response["count"]=count;
                // if(count === total_count){
                return res.status(200).json(response);
              }).catch(err => console.error(err));
              return false;
            }
            
            // }
            // else{
            //   return 0;
            // }  
          }).catch(err => console.error(err));
        return false;
          
      }).catch(err => console.error(err));
      return false;
    }).catch(err => console.error(err));
  });
});
