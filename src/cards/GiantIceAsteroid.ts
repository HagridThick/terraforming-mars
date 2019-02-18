
import { AndOptions } from "../inputs/AndOptions";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { SelectSpace } from "../inputs/SelectSpace";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { ISpace } from "../ISpace";

export class GiantIceAsteroid implements IProjectCard {
    public cost: number = 36;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = "Giant Ice Asteroid";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Raise temperature 2 steps and place 2 ocean tiles. Remove up to 6 plants from any player.";
    public description: string = "Crash it. The bigger, the better";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor(
                new AndOptions(
                    () => {
                        game.increaseTemperature(player)
                            .then(function () { return game.increaseTemperature(player); })
                            .then(function () { resolve(); })
                            .catch((err) => { reject(err); });
                    },
                    new SelectPlayer(this.name, game.getPlayers(), "Select player to remove up to 6 plants", (foundPlayer: Player) => {
                        foundPlayer.plants = Math.max(0, foundPlayer.plants - 6);
                    }),
                    new SelectSpace(this.name, "Select first ocean space", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
                        try { game.addOceanTile(player, space.id); }
                        catch (err) { reject(err); }
                    }),
                    new SelectSpace(this.name, "Select second ocean space", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
                        try { game.addOceanTile(player, space.id); }
                        catch (err) { reject(err); }
                    })
                )
            );
        });
    }
}
