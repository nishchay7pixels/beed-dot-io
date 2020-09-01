import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, of } from 'rxjs';

export const environment = {
  production : false,
  SOCKET_ENDPOINT: '/'
};

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket;

  constructor() { 
  }

  createRoom(roomId){
    this.socket.emit('create-room', roomId);
  }

  joinRoom(roomId: String, peerid: String){
    this.socket.emit('join-room', roomId, peerid);
    // this.socket.on('user-connected', (data: String)=>{
    //   //console.log(data);
    // });
  }
  setupSocketConnection(){
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socket.emit('my message', 'Hello There from Angular');
    this.socket.on('my broadcast', (data: String)=>{
      console.log(data);
    });
    //this.socket.emit('join-room', "456", "5464");
  }
}
