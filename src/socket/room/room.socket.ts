import { SocketRouter } from "../../modules/SocketIO-Manager";
import RoomManager from "../../modules/lib/Room-Manager";

const socketRouter: SocketRouter = (io: SocketIO.Server, socket: SocketIO.Socket) => {
	socket.on("createRoom", async (data) => {
		let room = await RoomManager.createRoom(data.roomName, data.userToken, socket.id);
		socket.join(room.roomName);
		socket.emit("createRoom", room);
		socket.emit("getRoomMembers", RoomManager.getRoomMembers(room.roomName));
	});
	socket.on("getRoomMembers", async (data) => {
		socket.emit("getRoomMembers", RoomManager.getRoomMembers(data.roomName));
	});
	socket.on("joinRoom", async (data) => {
		let room = await RoomManager.joinRoom(data.invitationCode, data.userToken, socket.id);
		socket.join(room.roomName);
		socket.emit("joinRoom", room);
		io.sockets.to(room.roomName).emit("getRoomMembers", RoomManager.getRoomMembers(room.roomName));
	});
	socket.on("leaveRoom", async (data) => {
		let room = await RoomManager.leaveRoom(data.roomName, data.userToken, socket.id);
		socket.join(room.roomName);
		socket.emit("leaveRoom", room);
		io.sockets.to(room.roomName).emit("getRoomMembers", RoomManager.getRoomMembers(room.roomName));
	});

	// TODO: 룸 정보 업데이트 구현해야함

	socket.on("disconnect", async (data) => {
		socket.leaveAll();
		RoomManager.resetUser(socket.id);
	});
};

export default socketRouter;
