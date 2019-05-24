task :default do
  sh "hjson -j data.hjson > data.json"
  sh "browserify -o bundle.js -t [ babelify --presets [ @babel/preset-env ] ] app.js"
end

