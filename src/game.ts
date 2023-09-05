import { CONSTANT, map1, playerImages, zombieImages } from "./data";
import {
    CheckingCollision,
    EventPlayer,
    RandomMoney,
    ZombieDriver,
} from "./core";
import { MapGame, Player } from "./models";
import { OnGameOver, PlayerMoneyObserver } from "./observer";

export function initGame() {
    const gridContainer = document.querySelector(".grid.map") as HTMLDivElement;
    const mapGame = new MapGame(map1);
    const lengthColumnMap = mapGame.getColumnLengthMap();
    const player = new Player({
        height: CONSTANT.player.height,
        width: CONSTANT.player.width,
        left: 288,
        top: 288,
        imagesURL: playerImages,
    });
    const zombie = new Player({
        height: CONSTANT.player.height,
        width: CONSTANT.player.width,
        left: 576,
        top: 0,
        imagesURL: zombieImages,
    });
    const zombieDriver = new ZombieDriver({ mapGame, player, zombie });
    const checkingCollision = new CheckingCollision(player, mapGame);
    const eventPlayer = new EventPlayer(player, checkingCollision);
    const randomMoney = new RandomMoney(mapGame);
    const playerMoneyObserver = new PlayerMoneyObserver(player, randomMoney);
    const onGameOver = new OnGameOver();
    mapGame.drawMap();
    player.drawPlayer();
    zombie.drawPlayer();
    eventPlayer.handleEvent();
    zombieDriver.run();
    onGameOver.subscribe([
        zombie.reset,
        player.reset,
        zombieDriver.reset,
        eventPlayer.reset,
        randomMoney.reset
    ]);
    zombieDriver.onGameOver([eventPlayer.setGameOver, onGameOver.onGameOver]);
    eventPlayer.onPlayerMoved([
        zombieDriver.playerMoving,
        playerMoneyObserver.checkingPlayerAndMoney,
    ]);
    gridContainer.style.gridTemplateColumns = `repeat(${lengthColumnMap}, var(--shape-size))`;
}
