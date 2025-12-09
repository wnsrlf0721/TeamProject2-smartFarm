// createdTime으로부터 경과된 일수를 계산하는 함수
export function calculateElapsedDays(createdTime) {
  if (!createdTime) return 0;

  // createdTime 파싱 (형식: "2025-04-20 10:00:00")
  const createdDate = new Date(createdTime.replace(" ", "T"));
  const currentDate = new Date();

  // 밀리초 차이를 일수로 변환
  const diffTime = currentDate - createdDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays >= 0 ? diffDays : 0;
}

// stepId를 단계명으로 변환하는 함수
export function getStepName(stepId) {
  const stepNames = {
    1: "준비",
    2: "파종",
    3: "발아기",
    4: "육묘기",
    5: "생장기",
    6: "개화기",
    7: "결실기",
    8: "수확기",
  };

  return stepNames[stepId] || `${stepId}단계`;
}
