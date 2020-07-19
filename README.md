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

-   matchingMeeting

> socket.on('matchingMeeting')

    roomName: 소속중인 방 이름

> io.sockets.to(room1.roomName).emit('matchingMeeting'); , io.sockets.to(room2.roomName).emit('matchingMeeting');

    meetingName: string 미팅 고유 이름 ( 랜덤 숫자 )
    roomId: string 방 아이디

    이 이벤트가 돌아갔을 때 안드에서 socket.emit(joinMeeting,{meetingName:string}) 해줘야 방 가입이 성공적으로 이루어짐

-   createMeeting

> socket.on('createMeeting')

    room1.invitationCode: string 초대코드1
    room2.invitationCode: string 초대코드2

> io.sockets.to(room1.roomName).emit('createMeeting'); , io.sockets.to(room2.roomName).emit('createMeeting');

    meetingName: string 미팅 고유 이름 ( 랜덤 숫자 )
    room1: Room 방1 정보
    room2: Room 방2 정보
    game: GameManager 게임 매니저;

    이 이벤트가 돌아갔을 떄 socket.emit(joinMeeting,{meetingName:string}) 해줘야함

-   joinMeeting

> socket.on('joinMeeting')

    meetingName: string 미팅 고유 이름

> socket.emit('joinMeeting')

    meetingName: string 미팅 고유 이름

-   startRoulette

> socket.on('startRoulette')

    meetingName: string 미팅 고유 이름
    gameName: string 게임 이름 (훈민정음|지하철|룰렛)

> io.sockets.to(meetingName).emit("startRoulette")

    boolean

> io.sockets.to(meetingName).emit("endRoulette")

    loser: string 마실 사람

-   startVideoMeeting

> socket.on('startVideoMeeting')

    meetingName: string 미팅 고유 이름
    roomId: string enablex 방 아이디

> io.sockets.to(meetingName).emit("startVideoMeeting")

    roomId: string enablex 방 아이디
