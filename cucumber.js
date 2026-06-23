module.exports = {
  default: {
    require: ['step-definitions/**/*.js', 'hooks/**/*.js'],
    paths: ['features/**/*.feature'],
    format: [
      'summary',
      'progress-bar',
      'html:reports/cucumber-report.html'
    ],
    publishQuiet: true
  }
};
