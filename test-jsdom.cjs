const express = require('express');
const { JSDOM } = require('jsdom');
const app = express();
app.use(express.static('dist'));
const server = app.listen(3002, () => {
  JSDOM.fromURL('http://localhost:3002/', { runScripts: 'dangerously', resources: 'usable' }).then(dom => {
    const { window } = dom;
    
    // Polyfill methods not available in JSDOM
    window.matchMedia = window.matchMedia || function() {
      return { matches : false, addListener : function() {}, removeListener: function() {} };
    };
    window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
    window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
    window.scrollTo = () => {};
    
    window.console.log = (...args) => console.log('DOM LOG:', ...args);
    window.console.error = (...args) => console.error('DOM ERROR:', ...args);
    window.console.warn = (...args) => console.warn('DOM WARN:', ...args);
    
    window.onerror = (msg, src, line, col, err) => console.error('Global Error:', msg, err);
    window.addEventListener('unhandledrejection', (e) => console.error('Promise Error:', e.reason));
    
    setTimeout(() => {
      console.log('Root HTML:', window.document.getElementById('root').innerHTML.substring(0, 500));
      server.close();
      process.exit(0);
    }, 4000);
  }).catch(err => {
    console.error('JSDOM INIT ERROR:', err);
    server.close();
    process.exit(1);
  });
});
