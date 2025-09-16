import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

// load the Admin view module by path
const adminPath = path.resolve(__dirname, '../src/views/pages/Admin.js');

function run() {
  let code = fs.readFileSync(adminPath, 'utf8');
  // remove ESM import lines and export keywords so we can evaluate as a script
  code = code.replace(/^\s*import[\s\S]*?;\s*/m, '');
  code = code.replace(/^\s*export\s+/m, '');
  // inline environment usages so the test doesn't depend on import.meta
  code = code.replace(
    /import\.meta\.env\.VITE_STELLAR_EXPLORER/g,
    "'https://stellar.expert/explorer/public'"
  );
  code = code.replace(
    /import\.meta\.env\.VITE_API_BASE/g,
    "'http://localhost:3000'"
  );

  // prepare a minimal DOM
  const dom = new JSDOM(`<!doctype html><html><body></body></html>`, {
    runScripts: 'dangerously',
    resources: 'usable',
  });
  const { window } = dom;
  global.window = window;
  global.document = window.document;
  global.HTMLElement = window.HTMLElement;
  global.Node = window.Node;
  global.navigator = window.navigator;

  // simple fetch stub that returns a predictable admin_summary response
  global.fetch = async () => ({
    ok: true,
    json: async () => ({
      total_expenses: 123.45,
      points_emitted: 987,
      fund_balance: 5000,
      recent_txs: [{ hash: 'abcdef123456', type: 'reserve' }],
    }),
  });

  // load el helper
  const elCode = fs.readFileSync(
    path.resolve(__dirname, '../src/utils/dom.js'),
    'utf8'
  );
  const elFn = new Function(elCode + '\nreturn el;');
  global.el = elFn();

  try {
    // evaluate transformed Admin.js and obtain Admin function
    const wrapper = new Function(
      code +
        '\nreturn typeof Admin !== "undefined" ? Admin : (typeof exports !== "undefined" && exports.Admin) ? exports.Admin : null;'
    );
    const Admin = wrapper();
    if (!Admin) throw new Error('Admin export not found after transform');

    const node = Admin();
    // basic assertions: totals exist and table exists
    const totals = node.querySelectorAll('.admin-totals, .p-3');
    const table = node.querySelector('table');
    console.log('totals-count', totals.length);
    console.log('has-table', !!table);
    if (totals.length < 1) throw new Error('no totals found');
    if (!table) throw new Error('no table found');
    console.log('JS-DOM test passed');
  } catch (e) {
    console.error('test-failed', e && e.message ? e.message : e);
    process.exitCode = 2;
  }
}

run();
