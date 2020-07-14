import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

const app: express.Application = express();

app.use(morgan("dev"));
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);
app.use(helmet());
app.use(compression());

app.use(express.static("public"));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(express.json({ limit: "20mb" }));

app.listen(3000, () => {
	console.log("SERVER START");
});
