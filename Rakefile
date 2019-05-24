task :default do
  sh "hjson -j data.hjson > data.json"
  sh "browserify -o bundle.js app.js"
end

