require('esbuild').build({
    entryPoints: ['src/app.js'],
    bundle: true,
    outfile: 'dist/cfc.js',
    // minify:true,
    
  }).catch(() => process.exit(1))

  require('esbuild').build({
    entryPoints: ['src/app.js'],
    bundle: true,
    outfile: 'dist/cfc-min.js',
    minify:true,
    
  }).catch(() => process.exit(1))