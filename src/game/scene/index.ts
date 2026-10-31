import type { LevelConfig } from '../../types';
import type { SceneContext } from './shared';
import { drawFairyMeadowsScene, drawHunzaScene, drawPeshawarScene, drawSkarduScene, drawSwatScene } from './scenesB';
import {
  drawGwadarScene,
  drawIslamabadScene,
  drawKarachiScene,
  drawLahoreScene,
  drawMohenjoScene,
} from './scenesA';

export interface SceneRenderer {
  resize(width: number, height: number, scale: number, groundHeight: number): void;
  draw(
    ctx: CanvasRenderingContext2D,
    scroll: number,
    time: number,
    reducedMotion: boolean,
  ): void;
}

export function createScene(level: LevelConfig, lowFx = false): SceneRenderer {
  let width = 360;
  let height = 640;
  let scale = 1;
  let groundHeight = 64;

  return {
    resize(nextWidth, nextHeight, nextScale, nextGroundHeight) {
      width = nextWidth;
      height = nextHeight;
      scale = nextScale;
      groundHeight = nextGroundHeight;
    },

    draw(ctx, scroll, time, reducedMotion) {
      const context: SceneContext = {
        ctx,
        level,
        palette: level.palette,
        w: width,
        h: height,
        s: scale,
        groundY: height - groundHeight,
        playableH: height - groundHeight,
        scroll,
        time,
        reducedMotion,
        lowFx,
        gradients: new Map<string, CanvasGradient>(),
      };

      switch (level.slug) {
        case 'lahore':
          drawLahoreScene(context);
          break;
        case 'karachi':
          drawKarachiScene(context);
          break;
        case 'mohenjo-daro':
          drawMohenjoScene(context);
          break;
        case 'islamabad':
          drawIslamabadScene(context);
          break;
        case 'swat':
          drawSwatScene(context);
          break;
        case 'hunza':
          drawHunzaScene(context);
          break;
        case 'skardu':
          drawSkarduScene(context);
          break;
        case 'fairy-meadows':
          drawFairyMeadowsScene(context);
          break;
        case 'peshawar':
          drawPeshawarScene(context);
          break;
        case 'gwadar':
          drawGwadarScene(context);
          break;
        default:
          drawLahoreScene(context);
      }
    },
  };
}
