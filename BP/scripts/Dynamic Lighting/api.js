import { system, world } from "@minecraft/server";
let loadCheck = false;
export class DynamicLighting {
    /**
     *
     * @param item The identifier for the item.
     * @param lightLevel The light level for the block. 1-15
     * @param inWater Sets if this item gives off light in water.
     * @param offhand Sets if this item can be swapped to the offhand. Note: This only saves the amount!
     * @param sendError If true or undefined, it will send an error message to the player if the API isn't loaded.
     */
    static registerItem(item, lightLevel, inWater, offhand, sendError) {
        system.run(() => {
            system.sendScriptEvent("ae_dla:send_item", JSON.stringify({ id: item, lightLevel: lightLevel, inWater: inWater, offhand: offhand }));
            if (sendError === false)
                return;
            this.checkLoaded();
        });
    }
    /**
     *
     * @param entity The identifier for the entity.
     * @param lightLevel The light level for the block. 1-15
     * @param sendError If true or undefined, it will send an error message to the player if the API isn't loaded.
     */
    static registerEntity(entity, lightLevel, sendError) {
        system.run(() => {
            system.sendScriptEvent("ae_dla:send_entity", JSON.stringify({ id: entity, lightLevel: lightLevel }));
            if (sendError === false)
                return;
            this.checkLoaded();
        });
    }
    static checkLoaded() {
        if (loadCheck === true)
            return;
        loadCheck = true;
        const event = system.afterEvents.scriptEventReceive.subscribe((data) => {
            if (data.id !== "ae_dla:loaded")
                return;
            system.afterEvents.scriptEventReceive.unsubscribe(event);
            system.clearRun(timeout);
            loadCheck = false;
        });
        const timeout = system.runTimeout(() => {
            loadCheck = false;
            system.afterEvents.scriptEventReceive.unsubscribe(event);
            console.warn(`Dynamic Lighting API: Main pack not loaded!`);
            const interval = system.runInterval(() => {
                let hasMoved = false;
                for (const player of world.getAllPlayers()) {
                    if (!player || !player.isValid)
                        continue;
                    const vel = player.getVelocity();
                    if (vel.x === 0 && vel.z === 0)
                        continue;
                    hasMoved = true;
                    break;
                }
                if (hasMoved) {
                    world.sendMessage(`<§aDynamic Lighting API§r> §6Main pack not loaded! Please make sure the Dynamic Lighting API is installed and enabled. It can be found on CurseForge or MCPEDL.`);
                    system.clearRun(interval);
                }
            });
            system.clearRun(timeout);
        }, 20);
    }
}