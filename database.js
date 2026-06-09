// =============================================
// 投球評分演算法（支援等級 + 投球風格）
// =============================================

function scorePitcher(userAngles, level = 'amateur', style = 'overhead') {

  // 根據投球風格調整手肘角度標準
  const elbowStandards = {
    overhead: {
      beginner:     { ideal: [50, 100], good: [40, 110], ok: [30, 120] },
      youth:        { ideal: [60, 95],  good: [50, 105], ok: [40, 115] },
      amateur:      { ideal: [65, 90],  good: [55, 100], ok: [45, 110] },
      professional: { ideal: [70, 88],  good: [62, 95],  ok: [55, 102] }
    },
    threequarter: {
      beginner:     { ideal: [60, 115], good: [50, 125], ok: [40, 135] },
      youth:        { ideal: [70, 110], good: [60, 120], ok: [50, 130] },
      amateur:      { ideal: [75, 105], good: [65, 115], ok: [55, 125] },
      professional: { ideal: [80, 100], good: [72, 108], ok: [65, 115] }
    },
    sidearm: {
      beginner:     { ideal: [80, 140], good: [70, 150], ok: [60, 160] },
      youth:        { ideal: [85, 135], good: [75, 145], ok: [65, 155] },
      amateur:      { ideal: [90, 130], good: [80, 140], ok: [70, 150] },
      professional: { ideal: [95, 125], good: [87, 133], ok: [80, 140] }
    },
    submarine: {
      beginner:     { ideal: [100, 155], good: [90, 165], ok: [80, 175] },
      youth:        { ideal: [105, 150], good: [95, 160], ok: [85, 170] },
      amateur:      { ideal: [110, 145], good: [100, 155], ok: [90, 165] },
      professional: { ideal: [115, 140], good: [107, 148], ok: [100, 155] }
    }
  };

  const standards = {
    beginner: {
      elbow: elbowStandards[style].beginner,
      shoulder: {
        ideal: style === 'overhead' ? 30 : style === 'threequarter' ? 40 : style === 'sidearm' ? 55 : 65,
        good:  style === 'overhead' ? 45 : style === 'threequarter' ? 58 : style === 'sidearm' ? 72 : 82,
        ok:    style === 'overhead' ? 60 : style === 'threequarter' ? 75 : style === 'sidearm' ? 88 : 98
      },
      knee: {
        ideal: style === 'overhead' ? [90, 175]  : style === 'threequarter' ? [85, 172]  : style === 'sidearm' ? [80, 168]  : [75, 165],
        good:  style === 'overhead' ? [80, 180]  : style === 'threequarter' ? [75, 178]  : style === 'sidearm' ? [70, 174]  : [65, 170],
        ok:    style === 'overhead' ? [70, 185]  : style === 'threequarter' ? [65, 182]  : style === 'sidearm' ? [60, 178]  : [55, 175]
      },
      followThrough: {
        ideal: style === 'overhead' ? 90  : style === 'threequarter' ? 85  : style === 'sidearm' ? 80  : 75,
        good:  style === 'overhead' ? 70  : style === 'threequarter' ? 65  : style === 'sidearm' ? 60  : 55,
        ok:    style === 'overhead' ? 50  : style === 'threequarter' ? 45  : style === 'sidearm' ? 40  : 35
      },
      injury: { elbow: 40, shoulder: 55, knee: 80 }
    },
    youth: {
      elbow: elbowStandards[style].youth,
      shoulder: {
        ideal: style === 'overhead' ? 25 : style === 'threequarter' ? 35 : style === 'sidearm' ? 48 : 58,
        good:  style === 'overhead' ? 38 : style === 'threequarter' ? 50 : style === 'sidearm' ? 63 : 73,
        ok:    style === 'overhead' ? 52 : style === 'threequarter' ? 65 : style === 'sidearm' ? 78 : 88
      },
      knee: {
        ideal: style === 'overhead' ? [100, 170] : style === 'threequarter' ? [95, 167]  : style === 'sidearm' ? [90, 163]  : [85, 160],
        good:  style === 'overhead' ? [90, 178]  : style === 'threequarter' ? [85, 175]  : style === 'sidearm' ? [80, 171]  : [75, 168],
        ok:    style === 'overhead' ? [80, 183]  : style === 'threequarter' ? [75, 180]  : style === 'sidearm' ? [70, 176]  : [65, 173]
      },
      followThrough: {
        ideal: style === 'overhead' ? 100 : style === 'threequarter' ? 95  : style === 'sidearm' ? 90  : 85,
        good:  style === 'overhead' ? 80  : style === 'threequarter' ? 75  : style === 'sidearm' ? 70  : 65,
        ok:    style === 'overhead' ? 60  : style === 'threequarter' ? 55  : style === 'sidearm' ? 50  : 45
      },
      injury: { elbow: 45, shoulder: 50, knee: 85 }
    },
    amateur: {
      elbow: elbowStandards[style].amateur,
      shoulder: {
        ideal: style === 'overhead' ? 20 : style === 'threequarter' ? 30 : style === 'sidearm' ? 42 : 52,
        good:  style === 'overhead' ? 32 : style === 'threequarter' ? 44 : style === 'sidearm' ? 56 : 66,
        ok:    style === 'overhead' ? 45 : style === 'threequarter' ? 58 : style === 'sidearm' ? 70 : 80
      },
      knee: {
        ideal: style === 'overhead' ? [110, 165] : style === 'threequarter' ? [105, 162] : style === 'sidearm' ? [100, 158] : [95, 155],
        good:  style === 'overhead' ? [100, 173] : style === 'threequarter' ? [95, 170]  : style === 'sidearm' ? [90, 166]  : [85, 163],
        ok:    style === 'overhead' ? [90, 180]  : style === 'threequarter' ? [85, 177]  : style === 'sidearm' ? [80, 173]  : [75, 170]
      },
      followThrough: {
        ideal: style === 'overhead' ? 110 : style === 'threequarter' ? 105 : style === 'sidearm' ? 100 : 95,
        good:  style === 'overhead' ? 90  : style === 'threequarter' ? 85  : style === 'sidearm' ? 80  : 75,
        ok:    style === 'overhead' ? 70  : style === 'threequarter' ? 65  : style === 'sidearm' ? 60  : 55
      },
      injury: { elbow: 50, shoulder: 45, knee: 88 }
    },
    professional: {
      elbow: elbowStandards[style].professional,
      shoulder: {
        ideal: style === 'overhead' ? 15 : style === 'threequarter' ? 25 : style === 'sidearm' ? 36 : 46,
        good:  style === 'overhead' ? 25 : style === 'threequarter' ? 36 : style === 'sidearm' ? 48 : 58,
        ok:    style === 'overhead' ? 36 : style === 'threequarter' ? 48 : style === 'sidearm' ? 60 : 70
      },
      knee: {
        ideal: style === 'overhead' ? [120, 160] : style === 'threequarter' ? [115, 157] : style === 'sidearm' ? [110, 153] : [105, 150],
        good:  style === 'overhead' ? [112, 167] : style === 'threequarter' ? [107, 164] : style === 'sidearm' ? [102, 160] : [97, 157],
        ok:    style === 'overhead' ? [104, 174] : style === 'threequarter' ? [99, 171]  : style === 'sidearm' ? [94, 167]  : [89, 164]
      },
      followThrough: {
        ideal: style === 'overhead' ? 125 : style === 'threequarter' ? 118 : style === 'sidearm' ? 112 : 106,
        good:  style === 'overhead' ? 108 : style === 'threequarter' ? 102 : style === 'sidearm' ? 96  : 90,
        ok:    style === 'overhead' ? 92  : style === 'threequarter' ? 86  : style === 'sidearm' ? 80  : 74
      },
      injury: { elbow: 55, shoulder: 38, knee: 92 }
    }
  };

  const std = standards[level];
  const scores = {};

  // 手肘角度評分
  const throwingElbow = Math.min(userAngles.middle.rightElbow, userAngles.middle.leftElbow);
  scores.elbow =
    throwingElbow >= std.elbow.ideal[0] && throwingElbow <= std.elbow.ideal[1] ? 100
    : throwingElbow >= std.elbow.good[0] && throwingElbow <= std.elbow.good[1] ? 80
    : throwingElbow >= std.elbow.ok[0]   && throwingElbow <= std.elbow.ok[1]   ? 60 : 40;

  // 肩膀平衡評分
  const shoulderDiff = Math.abs(userAngles.middle.rightShoulder - userAngles.middle.leftShoulder);
  scores.shoulder =
    shoulderDiff <= std.shoulder.ideal ? 100
    : shoulderDiff <= std.shoulder.good ? 80
    : shoulderDiff <= std.shoulder.ok   ? 60 : 40;

  // 膝蓋彎曲評分
  const leadKnee = Math.min(userAngles.start.rightKnee, userAngles.start.leftKnee);
  scores.knee =
    leadKnee >= std.knee.ideal[0] && leadKnee <= std.knee.ideal[1] ? 100
    : leadKnee >= std.knee.good[0] && leadKnee <= std.knee.good[1] ? 80
    : leadKnee >= std.knee.ok[0]   && leadKnee <= std.knee.ok[1]   ? 60 : 40;

  // 跟進動作評分
  const endElbow = Math.min(userAngles.end.rightElbow, userAngles.end.leftElbow);
  scores.followThrough =
    endElbow >= std.followThrough.ideal ? 100
    : endElbow >= std.followThrough.good ? 80
    : endElbow >= std.followThrough.ok   ? 60 : 40;

  // 傷害風險（根據投球風格調整閾值）
  const elbowRiskThreshold = {
    overhead: 55, threequarter: 50, sidearm: 45, submarine: 40
  };
  const shoulderRiskThreshold = {
    overhead: 38, threequarter: 48, sidearm: 60, submarine: 70
  };

  const injuryRisk = [];
  if (throwingElbow < elbowRiskThreshold[style])
    injuryRisk.push('手肘角度過小，有手肘受傷風險');
  if (shoulderDiff > shoulderRiskThreshold[style])
    injuryRisk.push('肩膀不平衡程度超出此投球風格的安全範圍');
  if (leadKnee < std.injury.knee)
    injuryRisk.push('膝蓋彎曲過多，下肢負擔過大');

  const total = Math.round(
    (scores.elbow + scores.shoulder + scores.knee + scores.followThrough) / 4
  );

  const levelNames = {
    beginner:     '初學者',
    youth:        '青少年',
    amateur:      '業餘',
    professional: '職業'
  };

  return { scores, total, injuryRisk, levelName: levelNames[level] };
}