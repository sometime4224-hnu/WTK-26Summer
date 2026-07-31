const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.resolve(__dirname, '..');
const mapRoot = path.join(
    projectRoot,
    'assets',
    'c16',
    'grammar4',
    'images',
    'country-maps'
);
const sourceRoot = path.join(mapRoot, 'sources');
const generatedRoot = path.join(sourceRoot, 'generated');

const jobs = [
    {
        id: 'mongolia',
        source: 'mongolia-provinces-cc0.svg',
        generated: 'mongolia-imagegen.png',
        output: 'mongolia-region-map.webp',
        width: 1600,
        xStart: 0.04,
        xEnd: 0.96,
        yStart: 0.08,
        yEnd: 0.92,
        strokeWidth: 4
    },
    {
        id: 'kazakhstan',
        source: 'kazakhstan-regions-cc-by-sa-4.svg',
        generated: 'kazakhstan-imagegen.png',
        output: 'kazakhstan-region-map.webp',
        width: 1600,
        xStart: 0.04,
        xEnd: 0.96,
        yStart: 0.08,
        yEnd: 0.92,
        strokeWidth: 4
    },
    {
        id: 'syria',
        source: 'syria-governorates-cc-by-sa-4.svg',
        generated: 'syria-imagegen.png',
        output: 'syria-region-map.webp',
        width: 1200,
        xStart: 0.08,
        xEnd: 0.92,
        yStart: 0.06,
        yEnd: 0.94,
        strokeWidth: 1.5
    },
    {
        id: 'thailand',
        source: 'thailand-provinces-cc0.svg',
        generated: 'thailand-imagegen.png',
        output: 'thailand-region-map.webp',
        width: 900,
        xStart: 0.08,
        xEnd: 0.92,
        yStart: 0.06,
        yEnd: 0.94,
        strokeWidth: 1.6,
        isolateThailand: true
    }
];

function isolateThailand(svg) {
    const paths = (svg.match(/<path\b[\s\S]*?\/>/gi) || [])
        .filter((node) => /class="[^"]*\bth-\d+/i.test(node));

    if (paths.length < 77) {
        throw new Error(`Expected Thailand province paths, found ${paths.length}.`);
    }

    return [
        '<svg xmlns="http://www.w3.org/2000/svg"',
        ' xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"',
        ' xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"',
        ' viewBox="0 0 1051.164 1849.133">',
        paths.join(''),
        '</svg>'
    ].join('');
}

function readCountrySvg(job) {
    let svg = fs.readFileSync(path.join(sourceRoot, job.source), 'utf8');
    if (job.isolateThailand) svg = isolateThailand(svg);
    return svg;
}

function withStyle(svg, css) {
    return svg.replace('</svg>', `<style>${css}</style></svg>`);
}

async function renderTrimmed(svg) {
    return sharp(Buffer.from(svg), { density: 220 })
        .trim({ threshold: 4 })
        .png()
        .toBuffer();
}

async function fitToCanvas(trimmed, layout, background) {
    const resized = await sharp(trimmed)
        .resize({
            width: layout.innerWidth,
            height: layout.innerHeight,
            fit: 'fill'
        })
        .png()
        .toBuffer();

    return sharp({
        create: {
            width: layout.width,
            height: layout.height,
            channels: 4,
            background
        }
    })
        .composite([{
            input: resized,
            left: layout.left,
            top: layout.top
        }])
        .png()
        .toBuffer();
}

async function build(job) {
    const sourceSvg = readCountrySvg(job);
    const maskSvg = withStyle(
        sourceSvg,
        'path{fill:#fff!important;fill-opacity:1!important;stroke:#fff!important;stroke-opacity:1!important}'
    );
    const outlineSvg = withStyle(
        sourceSvg,
        [
            'path{',
            'fill:none!important;',
            'fill-opacity:0!important;',
            'stroke:#52647b!important;',
            'stroke-opacity:.82!important;',
            `stroke-width:${job.strokeWidth}px!important;`,
            'stroke-linecap:round!important;',
            'stroke-linejoin:round!important;',
            '}'
        ].join('')
    );

    const trimmedMask = await renderTrimmed(maskSvg);
    const maskMetadata = await sharp(trimmedMask).metadata();
    const innerWidth = Math.round(job.width * (job.xEnd - job.xStart));
    const innerHeight = Math.round(
        innerWidth * maskMetadata.height / maskMetadata.width
    );
    const height = Math.round(innerHeight / (job.yEnd - job.yStart));
    const layout = {
        width: job.width,
        height,
        innerWidth,
        innerHeight,
        left: Math.round(job.width * job.xStart),
        top: Math.round(height * job.yStart)
    };

    const [maskCanvas, outlineCanvas, generatedCanvas] = await Promise.all([
        fitToCanvas(
            trimmedMask,
            layout,
            { r: 0, g: 0, b: 0, alpha: 0 }
        ),
        renderTrimmed(outlineSvg).then((outline) => fitToCanvas(
            outline,
            layout,
            { r: 0, g: 0, b: 0, alpha: 0 }
        )),
        sharp(path.join(generatedRoot, job.generated))
            .resize({
                width: layout.width,
                height: layout.height,
                fit: 'fill'
            })
            .ensureAlpha()
            .png()
            .toBuffer()
    ]);

    const clippedTerrain = await sharp(generatedCanvas)
        .composite([{ input: maskCanvas, blend: 'dest-in' }])
        .png()
        .toBuffer();

    const backgroundSvg = Buffer.from(`
        <svg width="${layout.width}" height="${layout.height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="paper" cx="50%" cy="42%" r="72%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="100%" stop-color="#eef3f7"/>
                </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#paper)"/>
        </svg>
    `);

    await sharp(backgroundSvg)
        .composite([
            { input: clippedTerrain, blend: 'over' },
            { input: outlineCanvas, blend: 'over' }
        ])
        .webp({ quality: 90, smartSubsample: true })
        .toFile(path.join(mapRoot, job.output));

    return {
        id: job.id,
        output: job.output,
        width: layout.width,
        height: layout.height,
        bounds: {
            xStart: job.xStart,
            xEnd: job.xEnd,
            yStart: job.yStart,
            yEnd: job.yEnd
        }
    };
}

(async () => {
    fs.mkdirSync(mapRoot, { recursive: true });
    const results = [];
    for (const job of jobs) {
        results.push(await build(job));
    }
    process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
})().catch((error) => {
    process.stderr.write(`${error.stack || error.message}\n`);
    process.exitCode = 1;
});
