import fs from 'fs';
import path from 'path';

const data: string[] = fs.readFileSync(path.resolve(__dirname, './data.txt'), { encoding: 'utf-8' }).split('\n');

type CubeSubsetKey = 'red' | 'green' | 'blue';

type CubeSubsetInterface = {
  [key in CubeSubsetKey]: number;
};

const cubeSubsetTarget: CubeSubsetInterface = {
  red: 12,
  green: 13,
  blue: 14
} as const;

class CubeSubset implements CubeSubsetInterface {
  red: number = 0;
  green: number = 0;
  blue: number = 0;

  constructor(cubeSubsetString: string) {
    const cubeSubsetValues: number[] = [
      cubeSubsetString.match(/\d+ red/g),
      cubeSubsetString.match(/\d+ green/g),
      cubeSubsetString.match(/\d+ blue/g)
    ].map(m => parseInt(m?.[0] ?? '0'));
    const cubeSubsetEntries: [CubeSubsetKey, number][] = (['red', 'green', 'blue'] as CubeSubsetKey[]).map((color, index) => [color, cubeSubsetValues[index]]);
    Object.assign(this, Object.fromEntries(cubeSubsetEntries));
  }

  isPossible(): boolean {
    return this.red <= cubeSubsetTarget.red && this.green <= cubeSubsetTarget.green && this.blue <= cubeSubsetTarget.blue;
  }
}

class Game {
  id: number;
  cubeSubsets: CubeSubset[] = [];

  get power(): number {
    const { red, green, blue } = this.#minimalCubeSubset;
    return red * green * blue;
  }

  get #minimalCubeSubset(): CubeSubsetInterface {
    return this.cubeSubsets.reduce((minCubeSubset, cubeSubset) => ({
      red: Math.max(minCubeSubset.red, cubeSubset.red),
      green: Math.max(minCubeSubset.green, cubeSubset.green),
      blue: Math.max(minCubeSubset.blue, cubeSubset.blue)
    }), {
      red: 0,
      green: 0,
      blue: 0
    });
  }

  constructor(gameString: string) {
    const [rawId, cubeSubsetsString] = gameString.split(': ');
    this.id = parseInt(rawId.match(/\d+/g)![0]);
    for (const cubeSubsetString of cubeSubsetsString.split('; ')) {
      this.cubeSubsets.push(new CubeSubset(cubeSubsetString));
    }
  }

  isPossible(): boolean {
    return this.cubeSubsets.every(cubeSubset => cubeSubset.isPossible());
  }

  static fromGameString(gameString: string): Game {
    return new Game(gameString);
  }
}

const games: Game[] = data.map(Game.fromGameString);

const result: number = games.reduce((powerSum, game) => powerSum + game.power, 0);

console.log(result);