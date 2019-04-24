#!/usr/bin/env node
/* eslint-env node */
/* eslint-disable no-sync */
'use strict';

const SVGIcons2SVGFontStream = require('svgicons2svgfont');
const fs = require('fs');
const path = require('path');
const svg2ttf = require('svg2ttf');
const ttf2eot = require('ttf2eot');
const ttf2woff = require('ttf2woff');
const ttf2woff2 = require('ttf2woff2');
const cssesc = require('cssesc');
const mkdirp = require('mkdirp');
const sanitizeFileName = require('sanitize-filename');
const {readDirDeep} = require('./src/utils/util');
const {ArgumentParser} = require('argparse');
const version = require('./package.json').version;

const parser = new ArgumentParser({
    version: version,
    addHelp: true,
    description: "Converts a directory full of SVG icons into webfonts"
});
parser.addArgument(
    'src',
    {
        help: 'Source directory'
    }
);

parser.addArgument(
    ['-of', '--out-dir-font'],
    {
        help: 'Output directory for font'
    }
);

parser.addArgument(
    ['-os', '--out-dir-style'],
    {
        help: 'Output directory for style'
    }
);

parser.addArgument(
    ['-n', '--font-name'],
    {
        help: 'Font name',
    }
);

parser.addArgument(
    ['-f', '--file'],
    {
        help: 'Output filenames (without extension)',
    }
);

parser.addArgument(
    ['-p', '--prefix'],
    {
        help: 'CSS class name prefix',
    }
);

parser.addArgument(
    ['-b', '--base'],
    {
        help: 'CSS class name added to all icons',
    }
);

parser.addArgument(
    '--directory-separator',
    {
        help: 'The string to use in CSS class names when the icon files are in sub-directories',
        defaultValue: '-'
    }
);

parser.addArgument(
    '--fixed-width',
    {
        help: 'Creates a monospace font of the width of the largest input icon',
        action: 'storeTrue',
    }
);

const args = parser.parseArgs();

if(!args.prefix && !args.base) {
    console.error(`${path.basename(process.argv[1])}: Not enough arguments. Either --prefix, --base or both must be provided.`);
    process.exit(1);
}

// console.log(args);process.exit();


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const cssStr = s => cssesc(s, {wrap: true});
const cssId = s => cssesc(s, {isIdentifier: true});

const inputDir = args.src;
const outputDirFont = args.out_dir_font || '.';
const outputDirStyle = args.out_dir_style || '.';
const fontName = args.font_name || path.basename(inputDir);
const fileName = args.file || sanitizeFileName(fontName);
const cssPrefix = args.prefix || '';
const cssBase = args.base || null;

const svgFontFile = `${outputDirFont}/${fileName}-v${version}.svg`;
const ttfFontFile = `${outputDirFont}/${fileName}-v${version}.ttf`;
const woffFontFile = `${outputDirFont}/${fileName}-v${version}.woff`;
const woff2FontFile = `${outputDirFont}/${fileName}-v${version}.woff2`;
const eotFile = `${outputDirFont}/${fileName}-v${version}.eot`;
const cssFile = `${outputDirStyle}/_${fileName}.scss`;


mkdirp.sync(outputDirFont);

const fontStream = new SVGIcons2SVGFontStream({
    fontName: fontName,
    normalize: true,
    fontHeight: 5000,
    fixedWidth: args.fixed_width,
    centerHorizontally: true,
    log: () => {
    },
});

const svgFileStream = fs.createWriteStream(svgFontFile);

fontStream.pipe(svgFileStream)
    .on('finish', function() {
        console.log(`Wrote ${svgFontFile}`);
        createFonts();
    })
    .on('error', function(err) {
        console.log(err);
    });


readDirDeep(inputDir).then(icons => {
    icons = icons.filter(filename => /\.svg$/i.test(filename));
    const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
    icons.sort(collator.compare);

    // console.log(icons);process.exit();

    let codePointCounter = 0xF000;

    const cssDir = path.dirname(cssFile);

    let css = `
@font-face {
  font-family: ${cssStr(fontName)};
  src: url(${cssStr(path.relative(cssDir, eotFile))}); /* IE9 Compat Modes */
  src: url(${cssStr(path.relative(cssDir, eotFile) + '?iefix')}) format('embedded-opentype'), /* IE6-IE8 */
    url(${cssStr(path.relative(cssDir, woff2FontFile))}) format('woff2'), /* Edge 14+, Chrome 36+, Firefox 39+, some mobile */
    url(${cssStr(path.relative(cssDir, woffFontFile))}) format('woff'),  /* IE 9+, Edge, Firefox 3.6+, Chrome 5+, Safari 5.1+ */
    url(${cssStr(path.relative(cssDir, ttfFontFile))}) format('truetype'), /* Safari, Android, iOS */
    url(${cssStr(path.relative(cssDir, svgFontFile))}) format('svg'); /* Legacy iOS */
  font-weight: normal;
  font-style: normal;
}
${cssBase ? `.${cssId(cssBase)}` : `[class^="${cssId(cssPrefix)}"], [class*=" ${cssId(cssPrefix)}"]`} {
  font-family: ${cssStr(fontName)} !important; /* Use !important to prevent issues with browser extensions that change fonts */
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  font-size: 24px;
  text-transform: none;
  line-height: 1;
  text-rendering: optimizeSpeed; /* Kerning and ligatures aren't needed */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
${cssBase ? `.${cssId(cssBase)}:before` : `[class^="${cssId(cssPrefix)}"]:before, [class*=" ${cssId(cssPrefix)}"]:before`} {
  color: #555F60;
}
`.trimLeft();


    let cssIcons = [];
    let codePointMap = {};

    for(let icon of icons) {
        let glyph = fs.createReadStream(icon);

        let relPath = path.relative(inputDir, icon);
        let iconName = relPath.slice(0, -4).replace(/[\/\\]+/g, args.directory_separator);

        if(!codePointMap[relPath]) {
            codePointMap[relPath] = codePointCounter++;
        }
        
        let iconChar = String.fromCodePoint(codePointMap[relPath]);
        
        glyph.metadata = {
            unicode: [iconChar],
            name: iconName,
        };
        fontStream.write(glyph);


        let className = `${cssPrefix}${iconName}`;

        let cssSelector = `.${cssId(className)}`;
        if(!cssPrefix) {
            cssSelector = `.${cssId(cssBase)}${cssSelector}`;
        }

        cssIcons.push(`${cssSelector}:before {
  content: ${cssStr(iconChar)}
}`);
    }
    
    css += cssIcons.join('\n');

    fontStream.end();

    fs.writeFile(cssFile, css, {encoding: 'utf8'}, err => {
        if(err) throw err;
        console.log(`Wrote ${cssFile}`);
    });
});

function createFonts() {
    let svgString = fs.readFileSync(svgFontFile, {encoding: 'utf8'});
    const ttf = svg2ttf(svgString, {});
    fs.writeFileSync(ttfFontFile, ttf.buffer);
    console.log(`Wrote ${ttfFontFile}`);

    let ttfBuffer = fs.readFileSync(ttfFontFile);
    const woff = ttf2woff(ttfBuffer, {});
    fs.writeFileSync(woffFontFile, woff.buffer);
    console.log(`Wrote ${woffFontFile}`);

    fs.writeFileSync(woff2FontFile, ttf2woff2(ttfBuffer));
    console.log(`Wrote ${woff2FontFile}`);

    fs.writeFileSync(eotFile, ttf2eot(ttfBuffer));
    console.log(`Wrote ${eotFile}`);
}
