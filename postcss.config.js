module.exports = {

  plugins: [
     require('postcss-import')(),
     require('postcss-preset-env')({
      browsers: ['last 2 versions', '> 5%'],
     }),
     require('tailwindcss')('./tailwind.config.js'),
     require('postcss-reporter')({ clearReportedMessages: true }),
     process.env.NODE_ENV === 'production' ? require('autoprefixer')() : null,
     process.env.NODE_ENV === 'production' ? require('cssnano')({ preset: 'default' }) : null,
  ]
}
