import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

import Constants from "./constants";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(Constants.apiPrefix);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.APP_PORT);
}
bootstrap();
