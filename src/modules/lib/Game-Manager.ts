import csv from "csvtojson";
import { promises as fs } from "fs";
import { ObjectID } from "bson";

abstract class Game {
	abstract readonly gameName: string; // 게임 이름
	member: ObjectID[] = []; // 게임 참가자
	loser: ObjectID;
	isGameEnd: boolean = false;

	init(member: ObjectID[]) {
		// 맴버설정
		this.member = member;
	}
	setLoser(_id: ObjectID) {
		this.isGameEnd = true;
		this.loser = _id;
	}
	abstract start(): void; // 게임 실행 -> 마시는 사람 반환 []
}

// TEST CODE

export class GameHunMinJeongEum extends Game {
	gameName = "훈민정음";
	duplicateWord = [];
	keyword = "";
	static getConsonant(word: string): string {
		if (word) {
			const f: string[] = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
			let uni: number = word.charCodeAt(0) - 44032;
			let fn: number = Math.floor(uni / 588);
			return f[fn] || word[0].toUpperCase();
		} else {
			return "-";
		}
	}

	// init 함수
	start() {}
	speakingWords(_id: ObjectID, word: string) {
		let consonants: string = word
			.split("")
			.map((w) => GameHunMinJeongEum.getConsonant(w))
			.join(); // 초성으로 변환
		if (consonants === this.keyword && this.duplicateWord.indexOf(consonants) === -1) {
			this.duplicateWord.push(word);
			return true;
		} else {
			return false;
			// 지금 말한 사람이 먹음
		}
	}
	check() {
		// api
		// 의의 있소
	}
	reset() {
		this.duplicateWord = [];
	}
}

type SUBWAY_LINE =
	| "04호선"
	| "02호선"
	| "01호선"
	| "03호선"
	| "05호선"
	| "06호선"
	| "07호선"
	| "08호선"
	| "09호선"
	| "인천2호선"
	| "경의선"
	| "분당선"
	| "경춘선"
	| "경강선"
	| "수인선"
	| "인천선"
	| "공항철도"
	| "신분당선"
	| "의정부경전철"
	| "용인경전철"
	| "우이신설경전철"
	| "서해선"
	| "김포도시철도";

(async () => {})();

export class GameSubway extends Game {
	gameName = "지하철";
	stationInfo = [];
	visitedStation = [];
	nowLine = ""; // 현재 호선

	constructor() {
		super();
	}
	// init 함수
	async start() {
		var stationInfo = JSON.parse(await fs.readFile("data/train.json", "utf-8"));
		this.init(stationInfo);
		return true;
	}
	visit(_id: ObjectID, stationName: string, changeLine?: string) {
		let stationIdx = this.stationInfo.findIndex((station) => {
			station.stationName === stationName && station.line.indexOf(this.nowLine) !== -1;
		});
		if (stationIdx === -1) {
			super.setLoser(_id);
			return false;
		} else {
			if (changeLine === "" || this.stationInfo[stationIdx].line.indexOf(changeLine) === -1) {
				super.setLoser(_id);
				return false;
			} else {
				this.stationInfo.splice(stationIdx, 1);
				this.nowLine = changeLine;
				return true;
			}
		}
	}
	init(stationInfo) {
		this.nowLine = "";
		this.stationInfo = stationInfo;
	}
}
export class GameRoulette extends Game {
	gameName = "룰렛";
	getRoulette(): ObjectID {
		return this.member[Math.floor(Math.random() * this.member.length)];
	}
	// init 함수
	start() {
		super.setLoser(this.getRoulette());
	}
}

export type GAME_NAME = "훈민정음" | "지하철" | "룰렛";

class GameManager {
	currentGame: Game;
	startGame(gameName: GAME_NAME, users: ObjectID[]): Game {
		switch (gameName) {
			case "룰렛":
				this.currentGame = new GameRoulette();
				break;
			case "훈민정음":
				this.currentGame = new GameHunMinJeongEum();
				break;
			case "지하철":
				this.currentGame = new GameSubway();
				break;
		}
		console.log(users);
		this.currentGame.init(users);
		this.currentGame.start();
		return this.currentGame;
	}
}
// 지하철, 0070, 룰렛 Roulette, 훈민정음
export default GameManager;
