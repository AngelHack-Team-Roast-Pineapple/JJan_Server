import { Room } from "./Room-Manager";
import GameManager, { GAME_NAME } from "./Game-Manager";
import User from "../../schema/User";
import { ObjectID } from "bson";

class Meeting {
	meetingName: string;
	room1: Room;
	room2: Room;
	game: GameManager;

	constructor(data: any) {
		Object.keys(data).forEach((key) => (this[key] = data[key]));
	}
	private async getMeetingMembers() {
		return await User.find({ _id: this.getMeetingMembersId() });
	}
	getMeetingMembersId(): ObjectID[] {
		console.log(this);
		let room1Users = this.room1.users;
		let room2Users = this.room2.users;
		console.log(room1Users, room2Users, room1Users.concat(room2Users));
		return room1Users.concat(room2Users);
	}
	startGame(gameName: GAME_NAME) {
		console.log("getMeetingMembersId : ", this.getMeetingMembersId());
		this.game.startGame(gameName, this.getMeetingMembersId());
	}
}
class MeetingManager {
	meetingList: Array<Meeting> = [];

	findByMeetingName(meetingName: string): Meeting {
		return this.meetingList.find((meeting) => meeting.meetingName == meetingName);
	}
	findByMeetingRooms(room: Room): Meeting {
		return this.meetingList.find((meeting) => meeting.room1.roomName == room.roomName || meeting.room2.roomName == room.roomName);
	}
	createMeeting(room1: Room, room2: Room) {
		function createRandomNumber(n: number = 6) {
			return (+new Date() * Math.floor((1 + Math.random()) * 10)).toString().slice(-n);
		}
		if (this.findByMeetingRooms(room1) || this.findByMeetingRooms(room2)) throw "이미 존재하는 미팅입니다.";
		else {
			let meeting: Meeting = new Meeting({
				meetingName: createRandomNumber(8),
				room1,
				room2,
				game: new GameManager(),
			});
			console.log(room1, room2);
			this.meetingList.push(meeting);
			return meeting;
		}
	}
}

export default new MeetingManager();
