import { Component } from '@angular/core';
import { RoomConnectionService} from '../app/room-connection.service';
import { SocketioService } from './socketio.service';
import Peer from 'peerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'beed-dot-io';
  roomId: String;
  roomIdDisplay: String;
  video_grid : any;
  myPeer = new Peer(undefined, {
    //path: '/peerjs', //Comment it out for local
    host: '/',
    port: 3001,
    //port: 443 // only usd for heroku
    config: {'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }]}
  });
  connectedPeer = {};
  constructor(private socketService : SocketioService){
    this.socketService.setupSocketConnection();
    //this.socketService.createRoom();
    const myVideo = document.createElement('video');
    myVideo.muted = true;
    navigator.mediaDevices.getUserMedia({
      video: true
    }).then(stream =>{
        this.addVideoStream(myVideo, stream);
        this.myPeer.on('call', call=>{
          call.answer(stream);
          
          const video = document.createElement('video');
          call.on('stream', userVideoStream =>{
            this.addVideoStream(video,userVideoStream);
          });
        });
        this.socketService.socket.on('user-connected', (userId: String)=>{
          //console.log(data);
          this.connectToNewUser(userId, stream);
          this.sendMyPeerId(); // send your user id to new connected user
          console.log("my data shared");
        });
    });

  }
  sendMyPeerId(){
    this.socketService.sendMyPeerId(this.myPeer.id, this.myPeer.call, this.roomId);
  }

  connectToNewUser(userId, stream){
    const call = this.myPeer.call(userId, stream);
    const video =document.createElement('video');
    
    call.on('stream', userVideoStream =>{
      this.addVideoStream(video, userVideoStream);
    });
    call.on('close', () =>{
      video.remove();
    });
    this.addUser(userId,call);
    //this.connectedPeer[userId] = call;
  }
  addVideoStream(video, stream){
    video.srcObject = stream;
    this.video_grid = document.getElementById('video-grid');
    video.addEventListener('loadedmetadata', ()=>{
      video.play();
    });
    video.classList.add('video-element');
    this.video_grid.append(video);
  }
  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    
  }
  ngOnInit(): void {
    console.log(this.roomId);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.video_grid = document.getElementById('video-grid');
    // this.socketService.socket.on('user-connected', (userId: String)=>{
    //   console.log(userId);
    //   //connectToNewUser(userId, stream);
    // });
    this.socketService.socket.on('created', (data:String)=>{
      console.log(data);
      this.roomIdDisplay = data;
      //console.log(roomId);
    });
    // this.myPeer.on('open', id =>{
    //   this.socketService.joinRoom(this.roomId, id); Posibally causing to connect as soon as i open page
    // });
    this.socketService.socket.on('user-left', userId=>{
      console.log("user left");
      this.removeUser(userId);
    });
    this.socketService.socket.on('peer-id-shared', (userId,call)=>{
      console.log("Recieved Peer id");
      this.addUser(userId,call);
    });
  }
  addUser(userId, call){
    console.log("Outside");
    if(!(userId in this.connectedPeer)) {
      console.log("Inside");
      this.connectedPeer[userId]= call;
    }
  }
  removeUser(userId){

      //this.connectedPeer[userId].destroy();
      this.connectedPeer[userId].close();
    
  }
  createRoom(){
    console.log('createRoom')
    let roomId = Date.now().toString();
    this.socketService.createRoom(roomId);
  }
  joinRoom(){
    this.socketService.joinRoom(this.roomId, this.myPeer.id);
    
  }
  
}
