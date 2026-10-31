/**
 * Gradient cache for the canvas renderer.
 *
 * Canvas gradients cannot have their stops mutated after creation, but the same
 * gradient *object* can be drawn many times. Scenes rebuild linear/radial
 * gradients on every frame purely because the stop lists are constants — that
 * allocation churn is pure GC pressure on low-end devices. This helper memoizes
 * gradients per canvas owner (the engine owns one canvas per flight) and per
 * key that encodes the parameters the gradient depends on.
 */

type GradientMap = Map<string, CanvasGradient>;

const gradientCaches = new WeakMap<object, GradientMap>();

export function cachedGradient(
  owner: object,
  key: string,
  build: () => CanvasGradient,
): CanvasGradient {
  let map = gradientCaches.get(owner);
  if (!map) {
    map = new Map<string, CanvasGradient>();
    gradientCaches.set(owner, map);
  }
  let gradient = map.get(key);
  if (!gradient) {
    gradient = build();
    map.set(key, gradient);
  }
  return gradient;
}
