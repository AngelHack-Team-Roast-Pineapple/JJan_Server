import { SocketRouter } from "../../modules/SocketIO-Manager";
import MeetingManager from "../../modules/lib/Meeting-Manager";
import RoomManager from "../../modules/lib/Room-Manager";
MeetingManager; // 이거쓰면된다
const socketRouter: SocketRouter = (io: SocketIO.Server, socket: SocketIO.Socket) => {
	socket.on("createMeeting", async (data) => {
		let room1 = RoomManager.findByInvitationCode(data.room1.invitationCode);
		let room2 = RoomManager.findByInvitationCode(data.room2.invitationCode);
		let meeting = MeetingManager.createMeeting(room1, room2);
		io.sockets.to(room1.roomName).emit("createMeeting", meeting);
		io.sockets.to(room2.roomName).emit("createMeeting", meeting);
	});
	socket.on("joinMeeting", async (data) => {
		let meeting = MeetingManager.findByMeetingName(data.meetingName);
		socket.join(meeting.meetingName);
	});
	socket.on("startGameMetting", async (data) => {
		let meeting = MeetingManager.findByMeetingName(data.meetingName);
		meeting.startGame(data.gameName);
		io.sockets.to(meeting.meetingName).emit("startGameMetting", data.gameName);
	});
	socket.on("giveChocoEmong", async (data) => {});

	// 게임 연결 시 io.sockets.to(meetingName)

	// 룰렛
	socket.on("startRoulette", async (data) => {
		let meeting = MeetingManager.findByMeetingName(data.meetingName);

		io.sockets.to(meeting.meetingName).emit("endRoulette", meeting.game.currentGame.loser);
	});

	// 훈민정음
	socket.on("startHunMinJeongEum", async (data) => {
		let meeting = MeetingManager.findByMeetingName(data.meetingName);
	});
	socket.on("speakHunMinJeongEum", async (data) => {
		let meeting = MeetingManager.findByMeetingName(data.meetingName);
	});
	// 지하철
	socket.on("startSubway", async (data) => {
		let meeting = MeetingManager.findByMeetingName(data.meetingName);
	});
	socket.on("visitSubway", async (data) => {
		let meeting = MeetingManager.findByMeetingName(data.meetingName);
	});
};

export default socketRouter;
