import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { envValidationSchema, envValidationOptions } from './config';
import {DeviceManagerModule} from "./modules/device-manager/device-manager.module";
import {DeviceManagerController} from "./api/device-manager/device-manager.controller";
import {CommunicationModule} from "./modules/communication/communication.module";

@Module({
	imports: [
		//Environment settings
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: envValidationSchema,
			validationOptions: envValidationOptions
		}),
		//Database settings
		TypeOrmModule.forRootAsync({
			useFactory: async () => import('./ormconfig'),
		}),

		DeviceManagerModule,
		CommunicationModule,
	],
	controllers: [
		DeviceManagerController
	],
})
export class AppModule {}
