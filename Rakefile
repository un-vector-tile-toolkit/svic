task :default do
  sh "hjson -j data.hjson > data.json"
  sh "parcel build -d docs index.html"
  #sh "browserify -o bundle.js -t [ babelify --presets [ @babel/preset-env ] ] app.js"
end

