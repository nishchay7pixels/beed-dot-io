import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoomConnectionService {

  constructor(private http: HttpClient) { }
  
  generateRoom(){
    this.http.get('http://localhost:3000/').subscribe((room:any)=>{
      console.log(room)
    });
  }
}
