import { SocketRouter } from "../../modules/SocketIO-Manager";
import MeetingManager from "../../modules/lib/Meeting-Manager";
import RoomManager, { Room } from "../../modules/lib/Room-Manager";
import { GameHunMinJeongEum, GameSubway, GameRoulette } from "../../modules/lib/Game-Manager";

const matchingTeams: Room[] = [];

const socketRouter: SocketRouter = (io: SocketIO.Server, socket: SocketIO.Socket) => {
	socket.on("matchingMeeting", async (data) => {
		console.log("matchingMeeting : ", data);
		let room1: Room | undefined = RoomManager.findByRoomName(data.roomName); // 소속중인 방 이름
		let room2: Room | undefined = matchingTeams.find((r) => r.users.length == room1.users.length);
		let room1Name = room1 ? room1.roomName : "";
		let room2Name = room2 ? room2.roomName : "";
		if (room1Name != room2Name) {
			if (!room2) {
				matchingTeams.push(room1);
				console.log(room1Name, "meeting wait");
			} else {
				if (room1 && room2) {
					let meeting = MeetingManager.createMeeting(room1, room2);

					console.log(
						"split data1: ",
						matchingTeams.splice(
							matchingTeams.findIndex((r) => r.roomName == room1Name),
							1
						)
					);

					io.sockets.to(room1Name).emit("matchingMeeting", [
						{
							meetingName: meeting.meetingName,
						},
					]);
					io.sockets.to(room2Name).emit("matchingMeeting", [
						{
							meetingName: meeting.meetingName,
						},
					]);
					console.log(room1Name, room2Name, "meeting created");
				}
			}
		}
	});
	socket.on("createMeeting", async (data) => {
		console.log("createMeeting : ", data);
		let room1 = RoomManager.findByInvitationCode(data.room1.invitationCode);
		let room2 = RoomManager.findByInvitationCode(data.room2.invitationCode);
		let meeting = MeetingManager.createMeeting(room1, room2);
		io.sockets.to(room1.roomName).emit("createMeeting", [
			{
				meetingName: meeting.meetingName,
			},
		]);
		io.sockets.to(room2.roomName).emit("createMeeting", [
			{
				meetingName: meeting.meetingName,
			},
		]);
	});
	socket.on("joinMeeting", async (data) => {
		console.log("joinMeeting : ", data);
		let meeting = MeetingManager.findByMeetingName(data.meetingName);
		socket.leaveAll();
		socket.join(meeting.meetingName);
		console.log(socket.rooms);
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
		console.log("startRoulette : ", data);
		let meeting = MeetingManager.findByMeetingName(data.meetingName);
		meeting.startGame("룰렛");
		console.log(meeting.meetingName, "startRoulette emit");
		io.sockets.emit("startRoulette", [
			{
				result: true,
			},
		]);
		console.log(meeting.meetingName, "endRoulette emit");
		io.sockets.emit("endRoulette", [
			{
				loser: meeting.game.currentGame.loser,
			},
		]);
	});

	// 훈민정음
	socket.on("startHunMinJeongEum", async (data) => {
		let meeting = MeetingManager.findByMeetingName(data.meetingName);
		try {
			meeting.startGame("훈민정음");
			let hunMinJeongEum = meeting.game.currentGame as GameHunMinJeongEum;
			hunMinJeongEum.setKeyword(data.keyword);
			io.sockets.to(meeting.meetingName).emit("startHunMinJeongEum", true);
		} catch (e) {
			io.sockets.to(meeting.meetingName).emit("startHunMinJeongEum", false);
		}
	});
	socket.on("speakHunMinJeongEum", async (data) => {
		let meeting = MeetingManager.findByMeetingName(data.meetingName);
		let hunMinJeongEum = meeting.game.currentGame as GameHunMinJeongEum;
		// 마실 사람 정해야함
		let result = hunMinJeongEum.speakingWords(data._id, data.word);
		if (result) io.sockets.to(meeting.meetingName).emit("speakHunMinJeoungEum", [data.word]);
		else
			io.sockets.to(meeting.meetingName).emit("endHunMinJeoungEum", [
				{
					word: data.word,
					loser: meeting.game.currentGame.loser,
				},
			]);

		// {idx,result:boolean}
		// true, false 작동. true = 통과, false = 걸림
	});
	// 지하철
	socket.on("startSubway", async (data) => {
		let meeting = MeetingManager.findByMeetingName(data.meetingName);
		try {
			meeting.startGame("지하철");
			let subway = meeting.game.currentGame as GameSubway;
			subway.setNowLine(data.nowLine);
			io.sockets.to(meeting.meetingName).emit("startSubway", true);
		} catch (e) {
			io.sockets.to(meeting.meetingName).emit("startSubway", false);
		}
		let subway = meeting.game.currentGame as GameSubway;
		// _id, 역 이름, 현재 라인, 바꿀 라인 ( 없으면 빈 문자열 )
		io.sockets.to(meeting.meetingName).emit("visitSubway", subway.visit(data._id, data.stationName, data.changeLine));
	});
	socket.on("visitSubway", async (data) => {
		let meeting = MeetingManager.findByMeetingName(data.meetingName);
		let subway = meeting.game.currentGame as GameSubway;
		let result = subway.visit(data._id, data.stationName, data.changeLine);
		if (result) {
			io.sockets.to(meeting.meetingName).emit("visitSubway", [data.stationName]);
		} else {
			io.sockets.to(meeting.meetingName).emit("endSubway", [{ stationName: data.stationName, loser: meeting.game.currentGame.loser }]);
		}
	});
};

export default socketRouter;
