import "dotenv/config";
import express from "express";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cors from "cors";
import { indexRouter } from "./routes";
import { ErrorHandler } from "./middlewares/error.middleware";
import { connectToDatabase } from "./database/connection";
import Stripe from "stripe";

const PORT = process.env.PORT || 3001;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  throw new Error("Please add your STRIPE_SECRET_KEY to .env");
}

export const stripe: Stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
});

class App {
  public app: express.Express;

  constructor() {
    this.checkEnvs();
    connectToDatabase();
    this.app = express();
    this.config();
    this.setupRoutes();
    this.app.use(ErrorHandler.handle);
  }

  private config() {
    this.app.use(helmet());
    this.app.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ): void => {
        if (
          req.path === "/payments/webhook" ||
          req.originalUrl === "/webhook"
        ) {
          next();
        } else {
          express.json()(req, res, next);
        }
      }
    );
    this.app.use(cors({ origin: "*" }));
    this.app.use(morgan("dev"));
    this.app.use(compression());
  }

  private setupRoutes() {
    this.app.use(indexRouter);
  }

  public start(port: number | string) {
    this.app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  }

  private checkEnvs() {
    const requiredEnvs = [
      "MONGODB_URI",
      "APP_URL",
      "JWT_SECRET",
      "ACCESS_TOKEN",
      "CLIENT_ID",
      "CLIENT_SECRET",
      "REFRESH_TOKEN",
      "ALBUM_HASH",
      "STRIPE_SECRET_KEY",
      "endpointSecret",
    ];
    const missingEnvs = requiredEnvs.filter(
      (env) => !Object.prototype.hasOwnProperty.call(process.env, env)
    );

    if (missingEnvs.length > 0) {
      throw new Error(
        `The following environment variables are required: ${missingEnvs.join(
          ", "
        )}.`
      );
    }
  }
}

const app = new App();
app.start(PORT);

export default app;
