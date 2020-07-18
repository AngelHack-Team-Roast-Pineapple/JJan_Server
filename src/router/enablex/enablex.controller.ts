import { Request, Response, NextFunction } from "express";
import Post from "../../schema/Post";
import { HTTPRequestCode, StatusError } from "../../modules/Send-Rule";
import { IUserSchema } from "../../schema/User";
import Comment, { IComment } from "../../schema/Comment";
import Controller from "../controller";
import axios from "axios";

const API = axios.create({
	headers: {
		Authorization: "Basic " + process.env.ENABLEX_TOKEN,
	},
});
class EnablexController extends Controller {
	/**
	 * @description rooms
	 * @param {Request}req Express req
	 * @param {Response}res Express res
	 * @param {NextFunction}next Express next
	 */
	public async createRoom(req: Request, res: Response, next: NextFunction) {
		return res.json((await API.post("https://api.enablex.io/v1/rooms", req.body)).data);
	}
	public async getRoomData(req: Request, res: Response, next: NextFunction) {
		return res.json((await API.get("https://api.enablex.io/v1/rooms")).data);
	}
	public async getRoomInfo(req: Request, res: Response, next: NextFunction) {
		// get, req.params.room_id
		return res.json((await API.get(`https://api.enablex.io/v1/rooms/${req.params.room_id}`)).data);
	}
	public async updateRoom(req: Request, res: Response, next: NextFunction) {
		// get, req.params.room_id
		return res.json((await API.patch(`https://api.enablex.io/v1/rooms/${req.params.room_id}`), req.body).data);
	}
	public async deleteRoom(req: Request, res: Response, next: NextFunction) {
		// get, req.params.room_id
		return res.json((await API.delete(`https://api.enablex.io/v1/rooms/${req.params.room_id}`)).data);
	}
	public async getUserInRoom(req: Request, res: Response, next: NextFunction) {
		// get, req.params.room_id
		return res.json((await API.get(`https://api.enablex.io/v1/rooms/${req.params.room_id}/users`)).data);
	}
	public async createToken(req: Request, res: Response, next: NextFunction) {
		// get, req.params.room_id
		return res.json((await API.post(`https://api.enablex.io/v1/rooms/${req.params.room_id}/tokens`, req.body)).data);
	}
}

export default new EnablexController();
