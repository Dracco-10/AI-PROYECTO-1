import '@testing-library/jest-dom/vitest';

// jsdom no implementa scrollIntoView; el widget lo usa para autoscroll.
Element.prototype.scrollIntoView = function scrollIntoView() {};
