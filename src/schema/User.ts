import { Model, Schema, Document, model, HookNextFunction, Mongoose } from "mongoose";
import { ObjectID } from "bson";
import createEncryptionPassword from "../modules/lib/createEncryptionPassword";
import jwt from "jwt-simple";

export interface LoginData {
	userid: string;
	passwd: string;
}
export interface IUser extends LoginData {
	// 암호화 필수
	userid: string; // id 값
	passwd: string; // 비밀번호.
	salt: string; // 해시 키값
}
export const UserSchema: Schema = new Schema({
	// 암호화 필수
	userid: { type: String, unique: true }, // id 값
	passwd: { type: String, select: false }, // 비밀번호.
	salt: { type: String, select: false }, // 해시 키값
});
const NonUpdatableField = ["userid", "passwd", "email", "salt"];

/**
 * @description User 스키마에 대한 메서드 ( document )
 */
export interface IUserSchema extends IUser, Document {
	checkPassword(passwd: string): Promise<boolean>;
	getToken(): string;
}

/**
 * @description User 모델에 대한 정적 메서드 ( collection )
 */
export interface IUserModel extends Model<IUserSchema> {}

UserSchema.methods.checkPassword = async function (this: IUserSchema, passwd: string): Promise<boolean> {
	return (await createEncryptionPassword(passwd, this.salt)).passwd == this.passwd;
};
UserSchema.methods.getToken = function (this: IUserSchema): string {
	let user: LoginData = {
		userid: this.userid,
		passwd: this.passwd,
	} as LoginData;
	return "Bearer " + jwt.encode(user, process.env.SECRET_KEY || "SECRET");
};

UserSchema.pre("save", async function (this: IUserSchema) {
	if (this.isNew) {
		let data = await createEncryptionPassword(this.passwd);
		this.passwd = data.passwd;
		this.salt = data.salt;
	}
	return this;
});

export default model<IUserSchema>("User", UserSchema) as IUserModel;
