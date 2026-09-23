// Live Cafe Status Manager for Café KOI

export function initAmbiance() {
  updateCafeStatus();
  setInterval(updateCafeStatus, 60000);
}

// Live Cafe Open/Closed Status
function updateCafeStatus() {
  const statusLabel = document.getElementById('cafe-status-label');
  const statusSub = document.getElementById('cafe-status-sub');
  if (!statusLabel) return;

  const now = new Date();
  const hours = now.getHours();

  // Operating Hours: 9:00 AM to 7:00 PM (19:00)
  const isOpen = hours >= 9 && hours < 19;

  if (isOpen) {
    statusLabel.textContent = 'Open Today';
    if (statusSub) statusSub.textContent = 'Specialty coffee & fresh cakes until 7:00 PM';
  } else {
    statusLabel.textContent = 'Doors Resting';
    if (statusSub) statusSub.textContent = 'Baking fresh cakes at 9:00 AM tomorrow in Kandy';
  }
}
