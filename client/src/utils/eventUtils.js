// Utility functions for calendar integration and sharing

export const generateGoogleCalendarLink = (event) => {
  const startDate = new Date(event.date);
  const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // Assume 2 hours duration

  const formatDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    location: event.venue,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const generateICalendarFile = (event) => {
  const startDate = new Date(event.date);
  const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // Assume 2 hours

  const formatICalDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0];
  };

  const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.venue}
DTSTART:${formatICalDate(startDate)}
DTEND:${formatICalDate(endDate)}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
  return URL.createObjectURL(blob);
};

export const shareEventOnSocial = (event, platform) => {
  const text = `Check out this event: ${event.title} on ${event.date} at ${event.venue}`;
  const url = window.location.href;

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
  };

  return shareUrls[platform];
};

export const copyEventLink = async (event) => {
  const link = `${window.location.origin}/event/${event.id}`;
  try {
    await navigator.clipboard.writeText(link);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = link;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
};