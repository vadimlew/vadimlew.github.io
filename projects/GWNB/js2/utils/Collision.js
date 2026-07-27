export function aabbIntersect(a, b) {
  if (a.x + a.width <= b.x) return false;
  if (b.x + b.width <= a.x) return false;
  if (a.y + a.height <= b.y) return false;
  if (b.y + b.height <= a.y) return false;
  return true;
}

export function solveAabb(a, b) {
  const dx1 = a.x + a.width - b.x;
  const dx2 = b.x + b.width - a.x;
  const dy1 = a.y + a.height - b.y;
  const dy2 = b.y + b.height - a.y;

  const rx = dx1 < dx2 ? dx1 : -dx2;
  const ry = dy1 < dy2 ? dy1 : -dy2;

  if (Math.abs(rx) < Math.abs(ry)) {
    return { x: rx, y: 0 };
  }
  return { x: 0, y: ry };
}
