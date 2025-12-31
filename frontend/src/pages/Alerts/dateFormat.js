export const formatDateTime = (dateTime) => {
  if (!dateTime) return "";

  // "2025-12-17T15:40:23"
  const [date, time] = dateTime.split("T");
  const [hour, minute] = time.split(":");

  return `${date} ${hour}:${minute}`;
};
