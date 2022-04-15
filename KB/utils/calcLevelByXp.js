module.exports = function calcLevelByXp(xp){
  // 100 + level * level * 100 = xp;

  const INITIAL_MAX_POINTS = 100;

  let level = Math.ceil(Math.sqrt(xp / 100));
  if (level < 0){
    level = 0;
  };
  let levelNeedFarm = (level) * (level) * INITIAL_MAX_POINTS - (level-1) * (level-1) * INITIAL_MAX_POINTS;
  let levelFarmed = xp - (level-1) * (level-1) * INITIAL_MAX_POINTS;

  return {
    level,
    levelNeedFarm,
    levelFarmed
  }
}