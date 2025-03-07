import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3456);
}
bootstrap().catch((err: Error) => {
  console.error(err);
  console.error('Error bootstrapping application:');
  process.exit(1);
});
