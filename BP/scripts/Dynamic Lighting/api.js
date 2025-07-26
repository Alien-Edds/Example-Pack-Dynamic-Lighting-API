import { system, world } from "@minecraft/server";
let loadCheck = false;
export class DynamicLighting {
    static registery = {
        add: {
            /**
            *
            * @param id The identifier for the item.
            * @param lightLevel The light level for the block. 1-15
            * @param inWater Sets if this item gives off light in water.
            * @param offhand Sets if this item can be swapped to the offhand. Note: This only saves the amount!
            * @param sendError If true, it will send an error message to the player if the API isn't loaded.
            */
            itemID(id, lightLevel, inWater, offhand, sendError) {
                system.run(() => {
                    system.sendScriptEvent("ae_dla:send_item", JSON.stringify({ id: id, lightLevel: lightLevel, inWater: inWater, offhand: offhand }));
                    if (sendError === false)
                        return;
                    if (loadCheck)
                        return;
                    DynamicLighting.checkLoaded().then((loaded) => {
                        if (loadCheck)
                            return;
                        loadCheck = true;
                        if (!loaded)
                            DynamicLighting.sendError();
                    });
                });
            },
            /**
            *
            * @param id The identifier for the entity.
            * @param lightLevel The light level for the block. 1-15
            */
            entityID(id, lightLevel, sendError) {
                system.run(() => {
                    system.sendScriptEvent("ae_dla:send_entity", JSON.stringify({ id: id, lightLevel: lightLevel }));
                    if (sendError === false)
                        return;
                    if (loadCheck)
                        return;
                    DynamicLighting.checkLoaded().then((loaded) => {
                        if (loadCheck)
                            return;
                        loadCheck = true;
                        if (!loaded)
                            DynamicLighting.sendError();
                    });
                });
            },
            /**
             *
             * @param uuid The UUID of the entity.
             * @param lightLevel The light level for the block. 1-15
             */
            entity(uuid, lightLevel) {
                system.run(() => {
                    system.sendScriptEvent("ae_dla:send_entity_uuid", JSON.stringify({ uuid: uuid, lightLevel: lightLevel }));
                });
            }
        },
        remove: {
            /**
             *
             * @param id The item ID.
             */
            itemID(id) {
                system.run(() => {
                    system.sendScriptEvent("ae_dla:delete_item", id);
                });
            },
            /**
             *
             * @param id The entity ID.
             */
            entityID(id) {
                system.run(() => {
                    system.sendScriptEvent("ae_dla:delete_entity", id);
                });
            },
            /**
             *
             * @param uuid The UUID of the entity.
             */
            entity(uuid) {
                system.run(() => {
                    system.sendScriptEvent("ae_dla:delete_entity_uuid", uuid);
                });
            }
        }
    };
    static async checkLoaded() {
        let loaded = false;
        await new Promise(resolve => {
            system.sendScriptEvent("ae_dla:check_loaded", "");
            const event = system.afterEvents.scriptEventReceive.subscribe((data) => {
                if (data.id !== "ae_dla:loaded")
                    return;
                loaded = true;
                resolve(resolve);
                system.afterEvents.scriptEventReceive.unsubscribe(event);
                system.clearRun(timeout);
            });
            const timeout = system.runTimeout(() => {
                resolve(resolve);
                system.afterEvents.scriptEventReceive.unsubscribe(event);
            }, 5);
        });
        return loaded;
    }
    static sendError() {
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
    }
}