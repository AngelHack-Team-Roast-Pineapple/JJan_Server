# Pluto_Shaping_Server

## Socket

-   createRoom

> socket.on('createRoom')

    roomName: string 방 이름
    userToken: string 유저 토큰

> socket.emit('createRoom')

    roomName: string 방 이름;
    users: ObjectID[]  접속중인 유저의 _id;
    socketIdLink?: {
    	user: ObjectID;
    	socketId: string;
    }[] 필요없는거임;
    invitationCode: string 초대코드;

> io.sockets.to(room.roomName).emit('getRoomMembers')

    [...users]: 접속된 유저들 정보 ( GET /auth/user 이랑 똑같은 형식 )

-   joinRoom

> socket.on('joinRoom')

    invitationCode: string 초대 코드
    userToken: string 유저 토큰

> socket.emit('joinRoom')

    roomName: string 방 이름;
    users: ObjectID[]  접속중인 유저의 _id;
    socketIdLink?: {
    	user: ObjectID;
    	socketId: string;
    }[] 필요없는거임;
    invitationCode: string 초대코드;

> io.sockets.to(room.roomName).emit('getRoomMembers')

    [...users]: 접속된 유저들 정보 ( GET /auth/user 이랑 똑같은 형식 )

-   leaveRoom

> socket.on('leaveRoom')

    roomName: string 방 이름
    userToken: string 유저 토큰

> socket.emit('leaveRoom')

    roomName: string 방 이름;
    users: ObjectID[]  접속중인 유저의 _id;
    socketIdLink?: {
    	user: ObjectID;
    	socketId: string;
    }[] 필요없는거임;
    invitationCode: string 초대코드;

> io.sockets.to(room.roomName).emit('getRoomMembers')

    [...users]: 접속된 유저들 정보 ( GET /auth/user 이랑 똑같은 형식 )
