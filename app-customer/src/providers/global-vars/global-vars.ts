import { Injectable } from '@angular/core';

/*
  Generated class for the GlobalVarsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class GlobalVarsProvider {
  static mobile_code_arr:[{key:"+91",value:"+91"},{key:"+852",value:"+852"}];
  /* GLOBAL constants,variable to be declared here*/
  static from_email: string= "jobsproject2018@gmail.com";
  static daysArray = [{key:"mon",value:"MON"},{key:"tue",value:"TUE"},{key:"wed",value:"WED"},{key:"thu",value:"THU"},{key:"fri",value:"FRI"},{key:"sat",value:"SAT"},{key:"sun",value:"SUN"}];
  static max_option = 4;
  static mobile_code: string= "+91";

  constructor() {
  }


}
