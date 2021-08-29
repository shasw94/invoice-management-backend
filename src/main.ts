import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());


  const options = new DocumentBuilder()
    .setTitle("Invoice Management")
    .setDescription(`API documentation for invoice management. Upload an Excel file and generate invoices.`)
    .setVersion('v1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);


  const port = 5000;
  await app.listen(port);
  logger.log(`Application started at port ${port}`);
}
bootstrap();
