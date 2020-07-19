import { Router } from "express";
import enablexController from "./enablex.controller";

const router = Router();

router.post("/v1/rooms", enablexController.createRoom);
router.get("/v1/rooms", enablexController.getRoomData);
router.get("/v1/rooms/:room_id", enablexController.getRoomInfo);
router.patch("/v1/rooms/:room_id", enablexController.updateRoom);
router.delete("/v1/rooms/:room_id", enablexController.deleteRoom);
router.get("/v1/rooms/:room_id/users", enablexController.getUserInRoom);
router.post("/v1/rooms/tokens", enablexController.createToken);

router.get("/reset", enablexController.reset);

export default router;
