// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './admin/guards/roles.guard';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
app.useGlobalGuards(new RolesGuard(reflector));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`\n Library Auth Server running on: http://localhost:${port}`);
  console.log(`\nAvailable Endpoints:`);
  console.log(`   POST  /auth/register          → Register (student/manager/admin)`);
  console.log(`   POST  /auth/login             → Login & get JWT`);
  console.log(`   GET   /auth/profile           → Your profile [JWT Required]`);
  console.log(`   GET   /auth/student-dashboard → Student area [JWT + Role: student/manager/admin]`);
  console.log(`   GET   /auth/manager-dashboard → Manager area [JWT + Role: manager/admin]`);
  console.log(`   GET   /auth/admin-dashboard   → Admin area   [JWT + Role: admin]`);
  console.log(`   GET   /auth/users             → All users    [JWT + Role: admin]\n`);
}

bootstrap();