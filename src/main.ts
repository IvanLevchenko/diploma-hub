import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

import { AppModule } from "./app.module";

import Constants from "./constants";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(Constants.apiPrefix);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.listen(process.env.APP_PORT || 3001);
}
bootstrap();
