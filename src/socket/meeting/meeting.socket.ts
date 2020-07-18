import { SocketRouter } from "../../modules/SocketIO-Manager";
import MeetingManager from "../../modules/lib/Meeting-Manager";
import RoomManager, { Room } from "../../modules/lib/Room-Manager";
import { GameHunMinJeongEum, GameSubway, GameRoulette } from "../../modules/lib/Game-Manager";

const socketRouter: SocketRouter = (io: SocketIO.Server, socket: SocketIO.Socket) => {
	let matchingTeams: Room[] = [];
	socket.on("matchingMeeting", async (data) => {
		console.log("matchingMeeting : ", data);
		let room1: Room | undefined = RoomManager.findByRoomName(data.roomName); // 소속중인 방 이름
		let room2: Room | undefined = matchingTeams.find((r) => r.users.length == room1.users.length);
		if (!room2) {
			matchingTeams.push(room1);
		} else {
			if (room1 && room2) {
				let meeting = MeetingManager.createMeeting(room1, room2);
				io.sockets.to(room1.roomName).emit("matchingMeeting", meeting);
				io.sockets.to(room2.roomName).emit("matchingMeeting", meeting);
			}
		}
	});
	socket.on("createMeeting", async (data) => {
		console.log("createMeeting : ", data);
		let room1 = RoomManager.findByInvitationCode(data.room1.invitationCode);
		let room2 = RoomManager.findByInvitationCode(data.room2.invitationCode);
		let meeting = MeetingManager.createMeeting(room1, room2);
		io.sockets.to(room1.roomName).emit("createMeeting", meeting);
		io.sockets.to(room2.roomName).emit("createMeeting", meeting);
	});
	socket.on("joinMeeting", async (data) => {
		console.log("joinMeeting : ", data);
		let meeting = MeetingManager.findByMeetingName(data.meetingName);
		socket.join(meeting.meetingName);
	});
	// socket.on("startGameMeeting", async (data) => {
	// 	console.log("startGameMeeting : ", data);
	// 	let meeting = MeetingManager.findByMeetingName(data.meetingName);
	// 	meeting.startGame(data.gameName);
	// 	io.sockets.to(meeting.meetingName).emit("startGameMeeting", data.gameName);
	// });
	socket.on("giveChocoEmong", async (data) => {});

	// 게임 연결 시 io.sockets.to(meetingName)

	// 룰렛
	socket.on("startRoulette", async (data) => {
		let meeting = MeetingManager.findByMeetingName(data.meetingName);
		meeting.startGame("룰렛");
		io.sockets.to(meeting.meetingName).emit("endRoulette", meeting.game.currentGame.loser);
	});

	// 훈민정음
	socket.on("startHunMinJeongEum", async (data) => {
		let meeting = MeetingManager.findByMeetingName(data.meetingName);
		try {
			meeting.startGame("훈민정음");
			io.sockets.to(meeting.meetingName).emit("startHunMinJeongEum", true);
		} catch (e) {
			io.sockets.to(meeting.meetingName).emit("startHunMinJeongEum", false);
		}
	});
	socket.on("speakHunMinJeongEum", async (data) => {
		let meeting = MeetingManager.findByMeetingName(data.meetingName);
		let hunMinJeongEum = meeting.game.currentGame as GameHunMinJeongEum;

		hunMinJeongEum.speakingWords(data._id, data.word);
		// {idx,result:boolean}
	});
	// 지하철
	socket.on("startSubway", async (data) => {
		let meeting = MeetingManager.findByMeetingName(data.meetingName);
		try {
			meeting.startGame("지하철");
			io.sockets.to(meeting.meetingName).emit("startSubway", true);
		} catch (e) {
			io.sockets.to(meeting.meetingName).emit("startSubway", false);
		}
	});
	socket.on("visitSubway", async (data) => {
		let meeting = MeetingManager.findByMeetingName(data.meetingName);
	});
};

export default socketRouter;
