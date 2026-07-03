module.exports = {
  input: ['src/**/*.{ts,tsx}', '!src/i18n/locales/**'],
  output: './',
  options: {
    debug: false,
    removeUnusedKeys: false,
    sort: true,
    func: {
      list: ['i18next.t', 'i18n.t', 't'],
      extensions: ['.ts', '.tsx'],
    },
    lngs: ['zh', 'en'],
    ns: ['translation'],
    defaultLng: 'zh',
    defaultNs: 'translation',
    defaultValue: '',
    resource: {
      loadPath: 'src/i18n/locales/{{lng}}/{{ns}}.json',
      savePath: 'src/i18n/locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '\n',
    },
  },
};
