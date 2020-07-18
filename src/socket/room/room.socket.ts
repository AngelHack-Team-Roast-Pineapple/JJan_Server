import { SocketRouter } from "../../modules/SocketIO-Manager";
import RoomManager from "../../modules/lib/Room-Manager";

const socketRouter: SocketRouter = (io: SocketIO.Server, socket: SocketIO.Socket) => {
	// 방생성
	socket.on("createRoom", async (data) => {
		console.log("createRoom : ", data);
		// 룸 이름이랑 유저 토큰을 받아서 방 생성
		let room = await RoomManager.createRoom(data.roomName, data.userToken, socket.id);
		// socket 방 가입
		socket.join(room.roomName);
		// 룸 생성 성공 시 해당 룸 반환
		socket.emit("createRoom", room);
		// 룸 생성 성공 시 해당 름 유저 정보 반환
		socket.emit("getRoomMembers", RoomManager.getRoomMembers(room.roomName));
	});
	// 방 유저 정보 가져오기
	socket.on("getRoomMembers", async (data) => {
		// 룸 이름을 받으면 름 유저 정보 반환
		socket.emit("getRoomMembers", RoomManager.getRoomMembers(data.roomName));
	});
	// 방 가입
	socket.on("joinRoom", async (data) => {
		console.log("joinRoom : ", data);
		// 초대 코드와 유저 토큰을 받아서 방 가입
		let room = await RoomManager.joinRoom(data.invitationCode, data.userToken, socket.id);
		// socket 방 가입
		socket.join(room.roomName);
		// 룸 가입 성공 시 해당 룸 반환
		socket.emit("joinRoom", room);
		// 방에 가입된 모든 유저들에게 유저 정보 반환
		io.sockets.to(room.roomName).emit("getRoomMembers", RoomManager.getRoomMembers(room.roomName));
	});
	// 방 나가기
	socket.on("leaveRoom", async (data) => {
		console.log("leaveRoom : ", data);
		// 초대 코드와 유저 토큰을 받아서 방 탈퇴
		let room = await RoomManager.leaveRoom(data.roomName, data.userToken, socket.id);
		// socket 방 탈퇴
		socket.join(room.roomName);
		// 룸 탈퇴 성공 시 해당 룸 반환
		socket.emit("leaveRoom", room);
		// 방에 가입된 모든 유저들에게 유저 정보 반환
		io.sockets.to(room.roomName).emit("getRoomMembers", RoomManager.getRoomMembers(room.roomName));
	});

	// TODO: 룸 정보 업데이트 구현해야함

	// 연결이 끊어질 시 모든 방에서 나감
	socket.on("disconnect", async (data) => {
		socket.leaveAll();
		RoomManager.resetUser(socket.id);
	});
};

export default socketRouter;
