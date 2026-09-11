export function calculateMatch(b, c) {
  const price = Math.min(100, (b.price / 2700) * 100),
    quantity = b.required >= c.quantity ? 100 : (b.required / c.quantity) * 100,
    distance = Math.max(0, 100 - b.distance / 4.25),
    quality =
      b.quality === c.quality
        ? 100
        : b.quality === 'Grade B' && c.quality === 'Grade A'
          ? 75
          : 45,
    pickup = b.pickup ? 100 : 35,
    payment = Math.max(0, 100 - (b.paymentDays - 3) * 10);
  return Math.round(
    price * 0.3 +
      quantity * 0.2 +
      distance * 0.15 +
      quality * 0.15 +
      pickup * 0.1 +
      payment * 0.1
  );
}
export function rankedBuyers(c, buyers) {
  return buyers
    .filter((b) => b.crop === c.name)
    .map((b) => ({
      ...b,
      match: calculateMatch(b, c),
      net: b.price - b.transport - b.handling,
    }))
    .sort((a, b) => b.match - a.match);
}
