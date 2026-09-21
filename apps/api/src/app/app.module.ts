import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { EventsModule } from "./events/events.module";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    // open mySQL connection with my credentials
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dialect: "mysql",
        host: config.get<string>("DB_HOST"),
        port: config.get<number>("DB_PORT"),
        username: config.get<string>("DB_USERNAME"),
        password: config.get<string>("DB_PASSWORD"),
        database: config.get<string>("DB_NAME"),
        models: [],
        autoLoadModels: true,
        synchronize: true, // TODO: in production use migrations
      }),
    }),
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
