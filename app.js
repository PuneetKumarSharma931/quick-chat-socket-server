const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

const port = process.env.PORT || 3000;

const users = {};

io.on('connection', socket=>{

    socket.on('new-user-joined', name=>{

        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message=>{

        socket.broadcast.emit('received', {name: users[socket.id], message: message});
    });

    socket.on('disconnect', message=>{

        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

app.get('/', (req, res)=>{

    res.write(`<h1>Socket Server Started at port ${port}</h1>`);
    
});

http.listen(port, ()=>{

    console.log(`Website is running at port: ${port}`);
});



