# Sewa-In API

## Project Structure

```markdown
express/
 ├── src/
 │     ├── app.js
 │     ├── server.js
 │     ├── config/
 │     │     ├── database.js
 │     │     ├── email.js
 │     │     ├── env.js
 │     │     ├── envValidation.js
 │     │     ├── logger.js
 │     │     ├── midtrans.js
 │     │     └── swagger.js
 │     ├── middlewares/
 │     │     ├── auditMiddleware.js
 │     │     ├── auth.js
 │     │     ├── checkRole.js
 │     │     ├── emailNotification.js
 │     │     ├── errorHandler.js
 │     │     ├── inputSanitization.js
 │     │     ├── rateLimiter.js
 │     │     ├── requestLogger.js
 │     │     ├── securityHeaders.js
 │     │     └── validation.js
 │     ├── modules/
 │     │     ├── auth/
 │     │     │     ├── auth.controller.js
 │     │     │     ├── auth.route.js
 │     │     │     └── auth.service.js
 │     │     ├── barang/
 │     │     │     ├── barang.controller.js
 │     │     │     ├── barang.route.js
 │     │     │     └── barang.service.js
 │     │     ├── category/
 │     │     │     ├── category.controller.js
 │     │     │     ├── category.route.js
 │     │     │     └── category.service.js
 │     │     ├── midtrans/
 │     │     │     ├── midtrans.controller.js
 │     │     │     ├── midtrans.route.js
 │     │     │     └── midtrans.service.js
 │     │     ├── sewa/
 │     │     │     ├── sewa.controller.js
 │     │     │     ├── sewa.route.js
 │     │     │     └── sewa.service.js
 │     │     └── user/
 │     │           ├── user.controller.js
 │     │           ├── user.route.js
 │     │           └── user.service.js
 │     ├── routes/
 │     │     ├── admin.route.js
 │     │     └── index.js
 │     ├── services/
 │     │     ├── email.service.js
 │     │     └── notification.service.js
 │     ├── utils/
 │     │     ├── auditLog.js
 │     │     ├── correlationId.js
 │     │     ├── errors.js
 │     │     ├── logAnalysis.js
 │     │     ├── pagination.js
 │     │     ├── response.js
 │     │     ├── softDelete.js
 │     │     └── validation.js
 │     └── validations/
 │           └── schemas.js
 ├── prisma/
 │     ├── schema.prisma
 │     └── migrations/
 ├── scripts/
 │     ├── createAdminUser.js
 │     ├── generate-swagger.js
 │     ├── scheduleReminders.js
 │     ├── seedDatabase.js
 │     ├── testRaceCondition.js
 │     └── validateEnv.js
 ├── __tests__/
 │     ├── race-condition.test.js
 │     ├── setup.js
 │     ├── modules/
 │     └── routes/
 ├── jest.config.js
 ├── package.json
 ├── prisma.config.js
 └── README.md
```

## Dependencies

- **@prisma/client**: ^6.19.0 - ORM untuk database
- **express**: ^5.1.0 - Web framework
- **bcrypt**: ^6.0.0 - Password hashing
- **jsonwebtoken**: ^9.0.2 - JWT authentication
- **cookie**: ^1.0.2 - Cookie handling
- **cors**: ^2.8.5 - CORS middleware
- **dotenv**: ^17.2.3 - Environment variables
- **midtrans-client**: ^1.4.3 - Payment gateway

## Dev Dependencies

- **nodemon**: ^3.1.11 - Auto-reload development server
- **prisma**: ^6.19.0 - ORM CLI tools

## Available Scripts

- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push schema to database
- `npm run prisma:migrate` - Create database migration
- `npm run prisma:studio` - Open Prisma Studio
- `npm run format` - Format code with Prettier
- `npm run lint` - Run ESLint
- `npm run start:prod` - Start production with PM2
- `npm run stop:prod` - Stop production with PM2
- `npm run restart:prod` - Restart production with PM2
