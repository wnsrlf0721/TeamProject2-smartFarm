const POPUP_SEEN_KEY = "popupSeenAlarms";

export function getSeenPopupAlarms() {
  const raw = localStorage.getItem(POPUP_SEEN_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function markPopupAlarmSeen(alarmId) {
  const seen = getSeenPopupAlarms();
  if (seen.includes(alarmId)) return;
  localStorage.setItem(POPUP_SEEN_KEY, JSON.stringify([...seen, alarmId]));
}

export function hasSeenPopupAlarm(alarmId) {
  return getSeenPopupAlarms().includes(alarmId);
}
