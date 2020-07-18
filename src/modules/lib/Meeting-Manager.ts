import { Room } from "./Room-Manager";

interface Meeting {
	meetingName: string;
	room1: Room;
	room2: Room;
}
class MeetingManager {
	meetingList: Array<Meeting> = [];

	private findByMeetingName(meetingName: string): Meeting {
		return this.meetingList.find((meeting) => meeting.meetingName == meetingName);
	}
	createMeeting(room1: Room, room2: Room) {
		if (this.findByMeetingName(room1.roomName + room2.roomName) || this.findByMeetingName(room2.roomName + room1.roomName)) throw "이미 존재하는 미팅입니다.";
		else {
			let meeting: Meeting = {
				meetingName: room1.roomName + room2.roomName,
				room1,
				room2,
			};
			this.meetingList.push(meeting);
			return meeting;
		}
	}
}

export default new MeetingManager();
