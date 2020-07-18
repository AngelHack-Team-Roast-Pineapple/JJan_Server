import { SocketRouter } from "../../modules/SocketIO-Manager";
import MeetingManager from "../../modules/lib/Meeting-Manager";
MeetingManager // 이거쓰면된다
const socketRouter: SocketRouter = (io: SocketIO.Server, socket: SocketIO.Socket) => {
    socket.on("createMeeting", async () => {
        
    })
    socket.on("giveChocoEmong", async () => {

    })
};
    
export default socketRouter;
