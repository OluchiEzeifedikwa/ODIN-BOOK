// Page navigations ask for text/html; fetch() calls from the front end don't,
// so those get JSON responses instead of rendered pages.
export const wantsHtml = (req) => (req.get('Accept') || '').includes('text/html');
