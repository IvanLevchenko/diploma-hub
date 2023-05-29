import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";

import { AppModule } from "./app.module";

import Constants from "./constants";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.setGlobalPrefix(Constants.apiPrefix);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    credentials: true,
    origin: process.env.CLIENT_URL,
    exposedHeaders: "Authorization",
  });

  await app.listen(process.env.APP_PORT || 3001);
}
bootstrap();
