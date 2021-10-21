import {Controller, Get, Param, Post} from "@nestjs/common";
import {DeviceManagerService} from "../../modules/device-manager/device-manager.service";

@Controller('/api/device-manager')
export class DeviceManagerController {
    constructor(
        private readonly deviceManagerService: DeviceManagerService
    ) {}

    @Get('/toggle-all-lamps/:on')
    public toggleAllLamps(@Param('on') on: string) {
        this.deviceManagerService.toggleAllLamps(on);

        return {status: 'OK'};
    }

    @Get('/toggle-lamp/:uniqueId/:on')
    public toggleLamp(@Param('uniqueId') uniqueId: string, @Param('on') on: string) {
        this.deviceManagerService.toggleLamp(uniqueId, on);

        return {status: 'OK'};
    }

    @Get('/toggle-all-fridges/:on')
    public toggleAllFridges(@Param('on') on: string) {
        this.deviceManagerService.toggleAllFridges(on);

        return {status: 'OK'};
    }

    @Get('/toggle-fridge/:uniqueId/:on')
    public toggleFridge(@Param('uniqueId') uniqueId: string, @Param('on') on: string) {
        this.deviceManagerService.toggleFridge(uniqueId, on);

        return {status: 'OK'};
    }
}
