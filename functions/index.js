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
    
    const SIZES = [40, 50, 200]; // Resize target width in pixels
  
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

          }).catch(err => console.error(err));
          })  
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
    
    // validateFirebaseIdToken(req,res);
  res.setHeader("Access-Control-Allow-Origin", "*");
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
      let logoImage=itemSnap.val().image
      console.log("logoImage==="+logoImage)
      let job_details_id=itemSnap.val().job_details_id
      let job_contact_workplace_id=itemSnap.val().jobs_contact_workplace_id
      let job_added_date=itemSnap.val().date
      let date1=new Date()
      let date2=new Date(job_added_date)
      var diff = Math.abs(date1.getTime() - date2.getTime());
      var diffYear = Math.ceil(diff / (1000 * 3600 * 24 * 365));
      var diffMonths = Math.ceil(diff / (1000 * 3600 * 24 * 30));
      var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
      var diffHours = Math.ceil(diff / (1000 * 3600)); 
      var diffMins = Math.ceil(diff / (1000 * 60)); 
      let designation='';
      let job_emp_benefits_id=itemSnap.val().job_emp_benefits_id
      let job_work_schedule_id=itemSnap.val().job_work_schedule_id
      let job_questions_id=itemSnap.val().job_questions_id
      let employment_type='';
      let employment_type_val=''
      let salary_amount='';
      let salary_unit='';
      let industry='';
      let type='';
      let sub_industry='';
      let employee_benefits='';
      dbRef.child('job_details/').child(job_details_id).once('value').then( function(mediaSnap) {
          // console.log(mediaSnap.val());         
          designation=mediaSnap.val().designation
          employment_type=mediaSnap.val().employment_type
          type=mediaSnap.val().type
          salary_unit=mediaSnap.val().salary_unit
          salary_amount=mediaSnap.val().salary_amount
          industry=mediaSnap.val().industry
          sub_industry=mediaSnap.val().sub_industry
          dbRef.child('jobs_contact_workplace/').child(job_contact_workplace_id).once('value').then( function(jobContactSnap) {
            
            // console.log("count=="+count)
            let datestring='';
            if(diffMins<60){
              datestring=(diffMins === 1)?(diffMins+' minute'):(diffMins+' minutes')
            }
            else if(diffMins>=60 && diffHours<24){
              datestring=(diffHours === 1)?(diffHours+' hour'):(diffHours+' hours')
            }
            else if(diffHours>=24 && diffDays<31){
              datestring=(diffDays === 1)?(diffDays+' day'):(diffDays+' days')
            }
            else if(diffDays>=31 && diffMonths<12){
              datestring=(diffMonths === 1)?(diffMonths+' month'):(diffMonths+' months')
            }
            else if(diffMonths>=12){
              
              datestring=(diffYear === 1)?(diffYear+' year'):(diffYear+' years')
            }
            dbRef.child('job_work_schedule/').child(job_work_schedule_id).once('value').then( function(jobWorkSnap) {
              // count +=1;
              let questions_count=0
              dbRef.child('job_questions/').child(job_questions_id).once('value').then( function(jobQuesSnap) {
                if(jobQuesSnap.val().length === 1 && jobQuesSnap.val()[0] === "NA")
                {
                  questions_count=0
                }
                else{
                  questions_count=jobQuesSnap.val().length
                }
                // if(job_questions_id !== undefined){
                //   questions_count=dbRef.child('job_questions/').child(job_questions_id).numChildren()
                //   console.log("qcount==="+dbRef.child('job_questions/').child(job_questions_id).numChildren())
                // }
                
                let work_schedule=jobWorkSnap.val()
                let work_data=generateWorkSchedule(work_schedule)
                if(job_emp_benefits_id ===""){
                  if(logoImage !== undefined){
                    dbRef.child('uploads/').child(logoImage).once('value').then( function(imageSnap) {
                      count +=1;
                      let logos={}  
                      let logoImg=imageSnap.val().name                      
                      logos['40']='/thumbs/40/'+logoImg+'_thumb.png';
                      logos['50']='/thumbs/50/'+logoImg+'_thumb.png';                         
                      logos['200']='/thumbs/200/'+logoImg+'_thumb.png';
                      console.log(employee_benefits)
                      response["success"]=true;
                      response["message"]="Job Details fetched successfully";
                      let data={"job_id":itemSnap.key};
                      data["jobowner_details"]={ 
                          "jobowner_id":"",   //job owner
                          "jobowner_email":jobContactSnap.val().application_sent_mail,  
                          "jobowner_phone":"",    //job owner
                          "contact_preference":jobContactSnap.val().contact_via 
                      }
                      data["workplace_details"]={"workplace_type":jobContactSnap.val().workplace,"workplace_name":jobContactSnap.val().workplace_name,"workplace_address":jobContactSnap.val().workplace_address,"workplace_latitude":jobContactSnap.val().workplace_latitude,"workplace_longitude":jobContactSnap.val().workplace_longitude};
                      data["job_details"]={"designation":designation,"industry":industry,"sub_industry":sub_industry,"type":type,"employment_type":employment_type,
                      "salary_amount":salary_amount,"salary_unit":salary_unit,"work_schedule":work_data,"employee_benefits":employee_benefits,"questions_count":questions_count,"status":itemSnap.val().job_status,"creation_date":job_added_date,"published_date":"","logos":logos,"posted":datestring};
                      data["user_job_details"]={
                          "added_to_wishlist":false,
                          "applied":false,
                          "distance_from_user": ""
                      }
                      jobs.push(data)
                      response["data"]=jobs
                      if(count === total_count){
                        return res.status(200).json(response);
                      }
                      else{
                        return 0;
                      } 
                    }).catch(err => console.error(err)); 
                    return false;
                  }
                  else{
                    count +=1;
                    response["success"]=true;
                    response["message"]="Job Details fetched successfully";
                    let data={"job_id":itemSnap.key};
                    data["jobowner_details"]={ 
                      "jobowner_id":"",   //job owner
                      "jobowner_email":jobContactSnap.val().application_sent_mail,  
                      "jobowner_phone":"",    //job owner
                      "contact_preference":jobContactSnap.val().contact_via 
                    }
                    data["workplace_details"]={"workplace_type":jobContactSnap.val().workplace,"workplace_name":jobContactSnap.val().workplace_name,"workplace_address":jobContactSnap.val().workplace_address,"workplace_latitude":jobContactSnap.val().workplace_latitude,"workplace_longitude":jobContactSnap.val().workplace_longitude};
                    data["job_details"]={"designation":designation,"industry":industry,"sub_industry":sub_industry,"type":type,"employment_type":employment_type,
                      "salary_amount":salary_amount,"salary_unit":salary_unit,"work_schedule":work_data,"employee_benefits":employee_benefits,"questions_count":questions_count,"status":itemSnap.val().job_status,"creation_date":job_added_date,"published_date":"","posted":datestring};
                    data["user_job_details"]={
                        "added_to_wishlist":false,
                        "applied":false,
                        "distance_from_user": ""
                    }
                    jobs.push(data)
                    response["data"]=jobs
                    if(count === total_count){
                      return res.status(200).json(response);
                    }
                    else{
                      return 0;
                    } 
                  }
                  
                }
                else{
                  
                  dbRef.child('job_employee_benefits/').child(job_emp_benefits_id).once('value').then( function(jobEmpBenSnap) {
                    employee_benefits=jobEmpBenSnap.val().employee_benefits
                    if(logoImage !== undefined){
                      console.log("image exists!!!")
                      dbRef.child('uploads/').child(logoImage).once('value').then( function(imageSnap) {
                        count +=1;
                        let logos={}  
                        let logoImg=imageSnap.val().name                  
                        logos['40']='/thumbs/40/'+logoImg+'_thumb.png'; 
                        logos['50']='/thumbs/50/'+logoImg+'_thumb.png';                     
                        logos['200']='/thumbs/200/'+logoImg+'_thumb.png';
                        console.log(employee_benefits)
                        response["success"]=true;
                        response["message"]="Job Details fetched successfully";
                        let data={"job_id":itemSnap.key};
                        data["jobowner_details"]={ 
                          "jobowner_id":"",   //job owner
                          "jobowner_email":jobContactSnap.val().application_sent_mail,  
                          "jobowner_phone":"",    //job owner
                          "contact_preference":jobContactSnap.val().contact_via 
                        }
                        data["workplace_details"]={"workplace_type":jobContactSnap.val().workplace,"workplace_name":jobContactSnap.val().workplace_name,"workplace_address":jobContactSnap.val().workplace_address,"workplace_latitude":jobContactSnap.val().workplace_latitude,"workplace_longitude":jobContactSnap.val().workplace_longitude};
                        data["job_details"]={"designation":designation,"industry":industry,"sub_industry":sub_industry,"type":type,"employment_type":employment_type,
                      "salary_amount":salary_amount,"salary_unit":salary_unit,"work_schedule":work_data,"employee_benefits":employee_benefits,"additional_info":jobEmpBenSnap.val().additional_info,"questions_count":questions_count,"status":itemSnap.val().job_status,"creation_date":job_added_date,"published_date":"","logos":logos,"posted":datestring};
                        
                        data["user_job_details"]={
                          "added_to_wishlist":false,
                          "applied":false,
                          "distance_from_user": ""
                        }
                        jobs.push(data)
                        response["data"]=jobs
                        if(count === total_count){
                          return res.status(200).json(response);
                        }
                        else{
                          return 0;
                        } 
                      }).catch(err => console.error(err));  
                      return false;             
                    }
                    else{
                      console.log(employee_benefits)
                      count +=1;
                      response["success"]=true;
                      response["message"]="Job Details fetched successfully";
                      let data={"job_id":itemSnap.key};
                      data["jobowner_details"]={ 
                        "jobowner_id":"",   //job owner
                        "jobowner_email":jobContactSnap.val().application_sent_mail,  
                        "jobowner_phone":"",    //job owner
                        "contact_preference":jobContactSnap.val().contact_via 
                      }
                      data["workplace_details"]={"workplace_type":jobContactSnap.val().workplace,"workplace_name":jobContactSnap.val().workplace_name,"workplace_address":jobContactSnap.val().workplace_address,"workplace_latitude":jobContactSnap.val().workplace_latitude,"workplace_longitude":jobContactSnap.val().workplace_longitude};
                      data["job_details"]={"designation":designation,"industry":industry,"sub_industry":sub_industry,"type":type,"employment_type":employment_type,
                      "salary_amount":salary_amount,"salary_unit":salary_unit,"work_schedule":work_data,"employee_benefits":employee_benefits,"questions_count":questions_count,"status":itemSnap.val().job_status,"creation_date":job_added_date,"published_date":"","additional_info":jobEmpBenSnap.val().additional_info,"posted":datestring};
                      data["user_job_details"]={
                          "added_to_wishlist":false,
                          "applied":false,
                          "distance_from_user": ""
                      }  
                      jobs.push(data)
                      response["data"]=jobs
                      if(count === total_count){
                        return res.status(200).json(response);
                      }
                      else{
                        return 0;
                      } 
                    }
                    
                  }).catch(err => console.error(err));
                  return false;
                }
              }).catch(err => console.error(err));
              return false;
            }).catch(err => console.error(err));
            // if(logoImage !== undefined){
            //   dbRef.child('uploads/').child(logoImage).once('value').then( function(imageSnap) {
            //     count +=1;
            //     let logo=''  
            //     let logoImg=imageSnap.val().name        
            //     if(logoImg !== undefined){
            //       console.log("logoImg==="+logoImg)              
            //       logo='/thumbs/50/'+logoImg+'_thumb.png';  
            //     }
            //     else{
            //       logo=''
            //     }
                                    
            //     jobs.push({'job_id':itemSnap.key,'logo':logo,'workplace_name':jobContactSnap.val().workplace_name,'designation':designation,'datestring':datestring})
            //     response["success"]=true;
            //     response["message"]="Job listing fetched successfully";
            //     response["data"]=jobs;
            //     if(count === total_count){
            //       return res.status(200).json(response);
            //     }
            //     else{
            //       return 0;
            //     }    
            //   }).catch(err => console.error(err));
            //   return false;
            // }
            // else
            // {
            //   count +=1;
            //   jobs.push({'job_id':itemSnap.key,'workplace_name':jobContactSnap.val().workplace_name,'designation':designation,'datestring':datestring})
            //   response["success"]=true;
            //   response["message"]="Job listing fetched successfully";
            //   response["data"]=jobs;
            //   if(count === total_count){
            //     return res.status(200).json(response);
            //   }
            //   else{
            //     return 0;
            //   }    
            // }
            
            // response["total_count"]=total_count;
            // response["count"]=count;
              return false;
          }).catch(err => console.error(err));
          return false;
      }).catch(err => console.error(err));   
        return false;
    })
  })
});
});

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const generateWorkSchedule = (days) => {
  const alldays=["mon","tue","wed","thu","fri","sat","sun"];
  let data=[];
  let contdata={};
  let consec=[]
  let start_time='';
  let end_time='';
  console.log(days)
  let con=[]
  for(let i=0;i<alldays.length;i++){
    let daystring=''
    let singleday=alldays[i]
    if(days[singleday]["holiday"] === false){
      if(i !== 0){
        let new_start_time=twelvehrformat(days[singleday]["start_time"])
        let new_end_time=twelvehrformat(days[singleday]["end_time"])
        if((start_time === new_start_time) && (end_time === new_end_time)){
          con.push(singleday)
        }
        else{
          consec.push(con)
          con=[]
          con.push(singleday)
          if(i === (alldays.length-1)){
            consec.push(con)
          }
        }
      }
      else{
        con.push(singleday)
      }
      start_time=twelvehrformat(days[singleday]["start_time"])
      end_time=twelvehrformat(days[singleday]["end_time"])
      daystring=singleday+" "+start_time+"-"+end_time
      data.push(daystring)
      contdata[singleday]=start_time+"-"+end_time
    } 
  }
  data.push(consec)
  let finaldata=[];
  for(let i=0;i<consec.length;i++){
    let daystr='';
    if(consec[i].length === 1){
      daystr=capitalizeFirstLetter(consec[i][0])+", "+contdata[consec[i][0]]
    }
    else{
      daystr=capitalizeFirstLetter(consec[i][0])+"-"+capitalizeFirstLetter(consec[i][(consec[i].length-1)])+", "+contdata[consec[i][0]]
    }
    finaldata.push(daystr)

  }
  return finaldata;

}

const twelvehrformat = (time) => {
  var timeString = time;
  var H = +timeString.substr(0, 2);
  var h = (H % 12) || 12;
  var ampm = H < 12 ? "am" : "pm";
  timeString = h + timeString.substr(2, 3) + ampm;
  return timeString
}

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
      let logoImage=itemSnap.val().image
      // total_count=itemSnap.numChildren();
      let job_details_id=itemSnap.val().job_details_id
      let job_contact_workplace_id=itemSnap.val().jobs_contact_workplace_id
      let job_emp_benefits_id=itemSnap.val().job_emp_benefits_id
      let job_work_schedule_id=itemSnap.val().job_work_schedule_id
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
            dbRef.child('job_work_schedule/').child(job_work_schedule_id).once('value').then( function(jobWorkSnap) {
              // count +=1;
              let work_schedule=jobWorkSnap.val()
              let work_data=generateWorkSchedule(work_schedule)
              if(job_emp_benefits_id ===""){
                if(logoImage !== undefined){
                  dbRef.child('uploads/').child(logoImage).once('value').then( function(imageSnap) {
                    let logos={}  
                    let logoImg=imageSnap.val().name                      
                    logos['40']='/thumbs/40/'+logoImg+'_thumb.png';                      
                    logos['200']='/thumbs/200/'+logoImg+'_thumb.png';
                    console.log(employee_benefits)
                    response["success"]=true;
                    response["message"]="Job Details fetched successfully";
                    response["data"]={"id":itemSnap.key,"designation":designation,"employment_type":employment_type,"type":type,"workplace_name":jobContactSnap.val().workplace_name,
                    "workplace_address":jobContactSnap.val().workplace_address,"salary_amount":salary_amount,"salary_unit":salary_unit,"industry":industry,"sub_industry":sub_industry,"employee_benefits":employee_benefits,"work_data":work_data,"logos":logos};
                    return res.status(200).json(response);
                  }).catch(err => console.error(err)); 
                  return false;
                }
                else{
                  response["success"]=true;
                  response["message"]="Job Details fetched successfully";
                  response["data"]={"id":itemSnap.key,"designation":designation,"employment_type":employment_type,"type":type,"workplace_name":jobContactSnap.val().workplace_name,
                  "workplace_address":jobContactSnap.val().workplace_address,"salary_amount":salary_amount,"salary_unit":salary_unit,"industry":industry,"sub_industry":sub_industry,"employee_benefits":employee_benefits,"work_data":work_data};
                  return res.status(200).json(response);
                }
                
              }
              else{
                dbRef.child('job_employee_benefits/').child(job_emp_benefits_id).once('value').then( function(jobEmpBenSnap) {
                  employee_benefits=jobEmpBenSnap.val().employee_benefits
                  if(logoImage !== undefined){
                    console.log("image exists!!!")
                    dbRef.child('uploads/').child(logoImage).once('value').then( function(imageSnap) {
                      let logos={}  
                      let logoImg=imageSnap.val().name                  
                      logos['40']='/thumbs/40/'+logoImg+'_thumb.png';                      
                      logos['200']='/thumbs/200/'+logoImg+'_thumb.png';
                      console.log(employee_benefits)
                      response["success"]=true;
                      response["message"]="Job Details fetched successfully";
                      response["data"]={"id":itemSnap.key,"designation":designation,"employment_type":employment_type,"type":type,"workplace_name":jobContactSnap.val().workplace_name,
                      "workplace_address":jobContactSnap.val().workplace_address,"salary_amount":salary_amount,"salary_unit":salary_unit,"industry":industry,"sub_industry":sub_industry,"employee_benefits":employee_benefits,"additional_info":jobEmpBenSnap.val().additional_info,"work_data":work_data,"logos":logos};
                      return res.status(200).json(response);
                    }).catch(err => console.error(err));  
                    return false;             
                  }
                  else{
                    console.log(employee_benefits)
                    response["success"]=true;
                    response["message"]="Job Details fetched successfully";
                    response["data"]={"id":itemSnap.key,"designation":designation,"employment_type":employment_type,"type":type,"workplace_name":jobContactSnap.val().workplace_name,
                    "workplace_address":jobContactSnap.val().workplace_address,"salary_amount":salary_amount,"salary_unit":salary_unit,"industry":industry,"sub_industry":sub_industry,"employee_benefits":employee_benefits,"additional_info":jobEmpBenSnap.val().additional_info,"work_data":work_data};
                    return res.status(200).json(response);
                  }
                  
                }).catch(err => console.error(err));
                return false;
              }
            }).catch(err => console.error(err));
            // }
            // else{
            //   return 0;
            // }  
            return false;
          }).catch(err => console.error(err));
        return false;
          
      }).catch(err => console.error(err));
      return false;
    }).catch(err => console.error(err));
  });
});


exports.usercheck = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    let mobileCode = req.query.code;
    let mobileNumber = req.query.number;
 
    var usersRef=admin.database().ref('users');
    usersRef.child(mobileCode+""+mobileNumber).once('value', function (snapshot) {
      let val=snapshot.val();
      if(val === null)
      {
        return res.status(200).json({"exists":false,"id":"","type":""});
      }
      else
      {
        return res.status(200).json({"exists":true,"id":snapshot.key,"type":val.type});
      }
    });
  });
 });
