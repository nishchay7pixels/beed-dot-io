import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, of } from 'rxjs';

export const environment = {
  production : false,
  SOCKET_ENDPOINT: 'http://localhost:3000/'
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

  sendMyPeerId(userId, call, roomId){
    this.socket.emit('peer-id-shared', userId, call, roomId); //share user peer id for new joind peer to save it
  }
  setupSocketConnection(){
    this.socket = io({url:environment.SOCKET_ENDPOINT,reconnection:false});
    this.socket.emit('my message', 'Hello There from Angular');
    this.socket.on('my broadcast', (data: String)=>{
      console.log(data);
    });
    //this.socket.emit('join-room', "456", "5464");
  }
}
