import { SocketRouter } from "../../modules/SocketIO-Manager";

const socketRouter: SocketRouter = (io: SocketIO.Server, socket: SocketIO.Socket) => {
	socket.on("ping", (data) => {
		socket.emit("pong", data);
	});
};

export default socketRouter;
