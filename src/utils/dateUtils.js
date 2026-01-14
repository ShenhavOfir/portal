export function getIsraelYMDHM(date = new Date()) {
  const tzDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Jerusalem" }));

  const year = tzDate.getFullYear();
  const month = String(tzDate.getMonth() + 1).padStart(2, "0");
  const day = String(tzDate.getDate()).padStart(2, "0");
  const hour = String(tzDate.getHours()).padStart(2, "0");
  const minute = String(tzDate.getMinutes()).padStart(2, "0");

  return `${year}${month}${day}${hour}${minute}`;
}
