# Hello!
### This repo will teach you how to use my Dynamic Lighting API for Minecraft Bedrock Edition.
Here are the [JavaScript](https://gist.github.com/Alien-Edds/63534df288802686ed14d79a9666858a) and [TypeScript](https://gist.github.com/Alien-Edds/0b26fb7982da0c9f82b31bad3fba87ae) API files.

You will need one of them in your pack depending on if you're using JS or TS.

To add Dynamic Lighting to your item or entity, you will use the methods on the DynamicLighting class.
Such as: ``registerItem`` & ``registerEntity`` 

The parameters are documented in the class itself.

PS: depending on what script version you use, you may need to change some things in the API. Such as ``player.isValid()`` -> ``player.isValid``.

Once you have used the register methods, if you have setup your pack correctly, then it'll work in-game if you have my [dynamic lighting pack](https://www.curseforge.com/minecraft-bedrock/addons/dynamic-lighting-api) and your pack on the same world.