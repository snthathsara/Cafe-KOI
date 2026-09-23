// Reservation & Direct Channels Interactions for Café KOI

export function initReservation() {
  // Direct channel action tracking or enhancements if needed
  const channelBtns = document.querySelectorAll('.direct-channel-btn');
  channelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Subtle tactile click feedback
      btn.style.transform = 'scale(0.98)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 150);
    });
  });
}
