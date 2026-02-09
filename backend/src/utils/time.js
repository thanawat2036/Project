export function calcEndTime(startTime) {
  const [h, m] = startTime.split(":").map(Number);
  const start = new Date();
  start.setHours(h, m, 0);

  const end = new Date(start);
  end.setHours(end.getHours() + 3);

  const closing = new Date(start);
  closing.setHours(20, 30, 0);

  return (end > closing ? closing : end)
    .toTimeString()
    .slice(0, 8);
}
