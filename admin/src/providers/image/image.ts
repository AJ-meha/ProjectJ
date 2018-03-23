import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Observable } from "rxjs/Observable";
import * as firebase from 'firebase';
import 'rxjs/add/operator/map';
import { FirebaseListObservable } from "angularfire2/database-deprecated";
import { Upload } from '../../app/models/upload';
import { AngularFireDatabase } from 'angularfire2/database';

/*
  Generated class for the ImageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImageProvider {
  public cameraImage : String
  private basePath:string = '/uploads';
  uploads: FirebaseListObservable<Upload[]>;
  constructor(private _CAMERA : Camera, private db: AngularFireDatabase) {
    console.log('Hello ImageProvider Provider');
  }

  selectImage() : Promise<any>
  {
     return new Promise(resolve =>
     {
        let cameraOptions : CameraOptions = {
            sourceType         : this._CAMERA.PictureSourceType.PHOTOLIBRARY,
            destinationType    : this._CAMERA.DestinationType.DATA_URL,
            quality            : 100,
            targetWidth        : 320,
            targetHeight       : 240,
            encodingType       : this._CAMERA.EncodingType.JPEG,
            correctOrientation : true
        };

        this._CAMERA.getPicture(cameraOptions)
        .then((data) =>
        {
           this.cameraImage 	= "data:image/jpeg;base64," + data;
           resolve(this.cameraImage);
        });


     });
  }

  uploadImage(imageString) : Promise<any>
  {
     let image       : string  = 'movie-' + new Date().getTime() + '.jpg',
         storageRef  : any,
         parseUpload : any;

     return new Promise((resolve, reject) =>
     {
        storageRef       = firebase.storage().ref('jobs/' + image);
        parseUpload      = storageRef.putString(imageString, 'data_url');

        parseUpload.on('state_changed', (_snapshot) =>
        {
           // We could log the progress here IF necessary
           // console.log('snapshot progess ' + _snapshot);
        },
        (_err) =>
        {
           reject(_err);
        },
        (success) =>
        {
           resolve(parseUpload.snapshot);
        });
     });
  }


  

  pushUpload(upload: Upload) : Promise<any>{
    let storageRef = firebase.storage().ref();
    let filenameArr=upload.file.name.split('.')
    let filename=filenameArr[0]+''+new Date().getTime()+'.'+filenameArr[1]
    let uploadTask = storageRef.child(`${this.basePath}/${filename}`).put(upload.file);
    
    return new Promise((resolve, reject) =>
     {
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) =>  {
          // upload in progress
          const snap = snapshot as firebase.storage.UploadTaskSnapshot
          upload.progress = (snap.bytesTransferred / snap.totalBytes) * 100
        },
        (error) => {
          // upload failed
          console.log(error)
          reject(error);
        },
        () => {
          // upload success
          upload.url = uploadTask.snapshot.downloadURL
          upload.name = filename
          upload.fileId=this.saveFileData(upload)
          resolve(uploadTask.snapshot);
        }
      );
    });
  }



  // Writes the file details to the realtime db
  private saveFileData(upload: Upload) {
    return this.db.list(`${this.basePath}/`).push(upload).key;
  }

}
