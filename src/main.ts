import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Housy Host | Rick & Morty')
    .setDescription(
      'This API is designed to manage and synchronize Rick and Morty character data. It imports and stores 200 characters in a PostgreSQL database, providing robust search, filtering by name, and pagination functionalities. Users can easily retrieve character details such as name, status, species, gender, and location. The API also supports automated database synchronization via a cron job that updates the character data every 30 minutes, alongside a manual refresh endpoint for on-demand updates. Built with scalability in mind, this API ensures efficient data management and real-time synchronization with the external Rick and Morty API.',
    )
    .setVersion('1.0')
    .addTag('Rick & Morty | HH Test')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
