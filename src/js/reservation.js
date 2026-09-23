// Reservation Engine & Table Booking for Café KOI

import confetti from 'canvas-confetti';

export function initReservation() {
  const form = document.getElementById('reservation-form');
  const successBox = document.getElementById('reservation-success-box');
  const guestChips = document.querySelectorAll('.guest-chip');
  const dateInput = document.getElementById('res-date');
  const timeSelect = document.getElementById('res-time');
  const guestsInput = document.getElementById('res-guests-hidden');
  const resetBtn = document.getElementById('book-another-btn');
  const downloadIcsBtn = document.getElementById('download-calendar-btn');

  // Set default minimum date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  // Guest count chip selection
  guestChips.forEach(chip => {
    chip.addEventListener('click', () => {
      guestChips.forEach(c => c.classList.remove('is-selected'));
      chip.classList.add('is-selected');
      const val = chip.getAttribute('data-guests') || '2';
      if (guestsInput) guestsInput.value = val;
    });
  });

  let currentReservationData = null;

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('res-name')?.value.trim() || 'Valued Guest';
      const email = document.getElementById('res-email')?.value.trim() || '';
      const phone = document.getElementById('res-phone')?.value.trim() || '';
      const date = dateInput?.value || new Date().toISOString().split('T')[0];
      const time = timeSelect?.value || '5:00 PM';
      const guests = guestsInput?.value || '2';
      const notes = document.getElementById('res-notes')?.value.trim() || 'None';

      const bookingRef = 'KOI-' + Math.floor(1000 + Math.random() * 9000);

      currentReservationData = {
        ref: bookingRef,
        name,
        email,
        phone,
        date,
        time,
        guests,
        notes
      };

      // Populate success view
      const refEl = document.getElementById('success-code-display');
      const detailsEl = document.getElementById('success-details-display');

      if (refEl) refEl.textContent = `Reservation #${bookingRef}`;
      if (detailsEl) {
        detailsEl.innerHTML = `
          <strong>${name}</strong> — ${guests} Guests<br />
          <strong>${date} at ${time}</strong><br />
          A table confirmation has been prepared for Café KOI and dispatched to <em>${email || 'your email'}</em>.
        `;
      }

      form.style.display = 'none';
      if (successBox) successBox.classList.add('is-visible');

      // Trigger celebration confetti with brand blue & purple
      try {
        confetti({
          particleCount: 40,
          spread: 45,
          origin: { y: 0.6 },
          colors: ['#008B9B', '#4A154B', '#00ACC1', '#C084FC']
        });
      } catch (err) {
        // Confetti optional
      }

      // Smooth scroll to confirmation view
      successBox?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // Reset button to book another
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (successBox) successBox.classList.remove('is-visible');
      if (form) {
        form.reset();
        form.style.display = 'block';
        if (dateInput) {
          const today = new Date().toISOString().split('T')[0];
          dateInput.value = today;
        }
      }
    });
  }

  // Download .ics Calendar event file
  if (downloadIcsBtn) {
    downloadIcsBtn.addEventListener('click', () => {
      if (!currentReservationData) return;
      const { ref, name, date, time, guests } = currentReservationData;

      const [year, month, day] = date.split('-');
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Cafe KOI//Table Reservation//EN',
        'BEGIN:VEVENT',
        `SUMMARY:Table at Café KOI (${guests} Guests)`,
        `DESCRIPTION:Reservation #${ref} for ${name}. 115/B D.S. Senanayake Veediya, Kandy.`,
        `LOCATION:Café KOI, 115/B D.S. Senanayake Veediya, Kandy, Sri Lanka`,
        `DTSTART:${year}${month}${day}T120000Z`,
        `DTEND:${year}${month}${day}T140000Z`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `cafe-koi-reservation-${ref}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}
