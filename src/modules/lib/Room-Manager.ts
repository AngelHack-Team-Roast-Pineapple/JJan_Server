import { ObjectID } from "bson";
import User, { IUserSchema, IUserToken } from "../../schema/User";
import jwt from "jwt-simple";

export interface Room {
	roomName: string;
	users: ObjectID[];
	socketIdLink?: {
		user: ObjectID;
		socketId: string;
	}[];
	invitationCode: string;
}
class RoomManager {
	roomList: Room[] = [];
	private createInvitationCode(): string {
		function createRandomNumber(n: number = 6) {
			return (+new Date() * Math.floor((1 + Math.random()) * 10)).toString().slice(-n);
		}
		let randomNumber: string;
		do {
			randomNumber = createRandomNumber(8);
		} while (this.roomList.some(({ invitationCode }) => invitationCode == randomNumber));
		return randomNumber;
	}
	private tokenToUser(token: string): IUserToken {
		let userData: IUserToken = jwt.decode(token.split(" ")[1], process.env.SECRET_KEY || "SECRET");
		return userData;
	}
	findByRoomName(roomName: string): Room {
		return this.roomList.find((room) => room.roomName == roomName);
	}
	findByInvitationCode(invitationCode: string): Room {
		return this.roomList.find((room) => room.invitationCode == invitationCode);
	}
	async createRoom(roomName: string, ownerToken: string, socketId: string): Promise<Room> {
		if (this.findByRoomName(roomName)) {
			throw "이미 있는 방 이름입니다.";
		} else {
			let owner = await User.loginAuthentication(this.tokenToUser(ownerToken), true);
			let room: Room = {
				roomName,
				invitationCode: this.createInvitationCode(),
				users: [owner._id],
				socketIdLink: [
					{
						socketId,
						user: owner._id,
					},
				],
			};
			this.roomList.push(room);
			return room;
		}
	}
	async getRoomMembers(roomName: string): Promise<IUserSchema[]> {
		let room: Room = this.findByRoomName(roomName);
		if (!room) throw "존재하지 않는 방입니다.";
		else {
			let users = await User.find({ _id: room.users });
			return users;
		}
	}
	async joinRoom(invitationCode: string, userToken: string, socketId: string): Promise<Room> {
		let room: Room = this.findByInvitationCode(invitationCode);
		if (!room) throw "만료된 초대코드입니다.";
		else {
			let user = await User.loginAuthentication(this.tokenToUser(userToken), true);
			if (room.users.indexOf(user._id) != -1) throw "이미 들어가있는 방입니다.";
			else {
				room.users.push(user._id);
				room.socketIdLink.push({
					user: user._id,
					socketId,
				});
				return room;
			}
		}
	}
	async leaveRoom(roomName: string, userToken: string, socketId: string): Promise<Room> {
		let room: Room = this.findByRoomName(roomName);
		if (!room) throw "존재하지 않는 방입니다.";
		else {
			let user = await User.loginAuthentication(this.tokenToUser(userToken), true);
			let idx = room.users.indexOf(user._id);
			let linkIdx = room.socketIdLink.findIndex((sl) => sl.user == user._id);
			if (idx == -1) throw "들어가지 않은 방입니다.";
			else {
				room.users.splice(idx, 1);
				if (linkIdx != -1) room.socketIdLink.splice(linkIdx, 1);
				return room;
			}
		}
	}
	async resetUser(socketId: string) {
		this.roomList.forEach((room) => {
			let linkIdx = room.socketIdLink.findIndex((sl) => sl.socketId == socketId);
			if (linkIdx != -1) {
				let link = room.socketIdLink[linkIdx];
				let idx = room.users.indexOf(link.user);
				if (idx != -1) room.users.splice(idx, 1);
				room.socketIdLink.splice(linkIdx);
			}
		});
	}
}

export default new RoomManager();
