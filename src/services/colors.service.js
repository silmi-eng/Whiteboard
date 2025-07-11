const pallet = () => {
  const colors = [];

  for (let i = 0; i < 5; i++) {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 70 + Math.random() * 10;
    const lightness = 80 + Math.random() * 10;

    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
};

module.exports = { pallet };
