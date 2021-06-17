module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  'plugins': [
    ['prismjs', {
      'languages': ['javascript', 'markup'],
      'plugins': ['autolinker', 'file-highlight'],
      'css': false
    }]
  ]
}
