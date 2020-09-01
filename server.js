//this is deployment branch code
//to start use npm run devStart - command defined in package.json
const express = require('express')
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const {v4: uuidV4} = require('uuid')
//code to run peerjs server as well on express
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server,{
    debug: true,
});
app.use('/peerjs', peerServer);
//end here

//app.use(express.static('public'))
app.use(express.static(__dirname +'/dist/')) //added __dirname +

// app.get('/', (req, res) => {
//     res.redirect(`/${uuidV4()}`);
// })
//below code run the angular app on express server
app.get('/*', (req, res)=>{
    res.sendFile('index.html',
    {root:'dist/beed-dot-io/'})
})
app.get('/:room', (req, res) =>{
    res.render('room', {roomId: req.params.room});
});
io.on('connection', (socket)=>{
    console.log("User Connected");
    socket.on('disconnect', ()=>{
        console.log("User Disconnected");
    });
    // socket.on('create-room', ()=>{
    //     let roomId = `${uuidV4()}`;
    //     //socket.join(roomId);
    //     socket.emit('created', roomId);
    // });
    socket.on('create-room', (roomId)=>{
        
        //socket.join(roomId);
        socket.emit('created', roomId);
    });
    socket.on('my message', (msg)=>{
        io.emit('my broadcast', `server: ${msg}`);
    });
    socket.on('join-room', (roomId, userId)=>{
        //console.log("RoomId:" + roomId+"||UserId:"+userId);
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);
        console.log(userId);

        socket.on('disconnect', ()=>{
            socket.to(roomId).broadcast.emit('user-left', userId);
        });
    });

});

server.listen(process.env.PORT||3000);