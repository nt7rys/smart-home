import {Module} from "@nestjs/common";
import {DeviceManagerService} from "./device-manager.service";
import {CommunicationModule} from "../communication/communication.module";

@Module({
    imports: [
        CommunicationModule
    ],
    providers: [
        DeviceManagerService
    ],
    exports: [
        DeviceManagerService
    ]
})
export class DeviceManagerModule {}
