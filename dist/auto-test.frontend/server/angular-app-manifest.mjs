
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 9175, hash: 'e1307e6436ccf4dc68a57fa700eb231117667a16970574bac4e6fabbe95ecb39', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1109, hash: '1cb35a4e9d4991c07dd83e18abc1e8d88978c84c2d0f20300d584a9c20838a8b', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-JVNHWSQE.css': {size: 8755, hash: '6OQThRAm/hU', text: () => import('./assets-chunks/styles-JVNHWSQE_css.mjs').then(m => m.default)}
  },
};
