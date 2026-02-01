
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS with specific options for production
  app.enableCors({
    origin: true, // Allow all origins (or specify your frontend domain)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  }); 
  
  // Set Global Prefix to 'api' (e.g., localhost:3001/api/register)
  app.setGlobalPrefix('api');

  // Enable Validation (checks DTO rules)
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
