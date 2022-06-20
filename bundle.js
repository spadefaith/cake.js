require('esbuild').build({
    entryPoints: ['src/app.js'],
    bundle: true,
    outfile: 'dist/cfc.js',
    // minify:true,
    // target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  }).catch(() => process.exit(1))

  require('esbuild').build({
    entryPoints: ['src/app.js'],
    bundle: true,
    outfile: 'dist/cfc-min.js',
    minify:true,
    target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  }).catch(() => process.exit(1))