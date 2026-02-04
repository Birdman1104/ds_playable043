import texturePacker from 'free-tex-packer-core'
import fs from 'fs/promises'
import { join } from 'path'
import { exec } from 'child_process'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SLASH = process.platform === 'win32' ? '\\' : '/';
const assetsPath = join(__dirname, `..${SLASH}src${SLASH}assets`);


const paths = {
    images: {
        path: join(assetsPath, 'images'),
        name: 'images',
    },
    uncompressed: {
        path: join(assetsPath, 'uncompressed'),
        name: 'uncompressed',
    },
    atlas: {
        path: join(assetsPath, 'atlases'),
        name: 'atlases',
    },
    spines: {
        path: join(assetsPath, 'spines'),
        name: 'spines'
    },
    sounds: {
        path: join(assetsPath, 'sounds'),
        name: 'sounds'
    }
};

const options = {
    textureName: '',
    width: 2048,
    height: 2048,
    quality: 80,
    scale: 1,
    fixedSize: false,
    powerOfTwo: false,
    padding: 2,
    extrude: 1,
    allowRotation: true,
    detectIdentical: true,
    allowTrim: true,
    trimMode: 'trim',
    alphaThreshold: 1,
    removeFileExtension: false,
    prependFolderName: true,
    textureFormat: 'png',
    base64Export: false,
    packer: 'MaxRectsPacker',
    packerMethod: 'Smart',
    exporter: 'Pixi',
    filter: 'none',
};

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

async function runPrettierOn(file) {
    // await exec(`prettier --write ${file}`);
}

function getFileNameWithExtension(path) {
    return path.slice(path.lastIndexOf(SLASH) + 1, path.length);
}

function getFileNameWithoutExtension(path) {
    return path.slice(path.lastIndexOf(SLASH) + 1, path.lastIndexOf('.'));
}

function getFileExtensionFromPath(path) {
    return path.slice(path.lastIndexOf('.') + 1, path.length);
}

function isImage(filePath) {
    return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(filePath);
}

function getShorterPath(path, fromFolder = 'src') {
    const dir = path.split(SLASH);
    const fileDir = dir.slice(dir.indexOf(fromFolder) + 1, dir.length);
    return fileDir.join(SLASH);
}

async function getFolderContent(folderPath, shorterPath = true, shortenFromFolder = 'src') {
    let result = [];
    const getFilesRecursively = async (path) => {
        const files = await fs.readdir(path);
        for (const f of files) {
            let newPath = join(path, f);
            const stat = await fs.stat(newPath);
            if (stat.isDirectory()) {
                await getFilesRecursively(newPath);
            } else {
                if (shorterPath) {
                    const dir = newPath.split(SLASH);
                    const fileDir = dir.slice(dir.indexOf(shortenFromFolder) + 1, dir.length);
                    newPath = fileDir.join(SLASH);
                }
                result.push(newPath);
            }
        }
    };
    await getFilesRecursively(folderPath);
    return result;
}

async function emptyAtlasFolder() {
    const { name, path } = paths.atlas;
    let files = await getFolderContent(path, true, name);
    if (files.length !== 0) {
        for (const f of files) {
            await fs.unlink(join(path, f));
        }
    }
}

async function generateSingleAtlas(data, name) {
    const assets = await Promise.all(
        data.map(async (key) => {
            const contents = await fs.readFile(join(paths.images.path, name, key));
            return { path: key, contents };
        }),
    );
    options.textureName = name;
    texturePacker(assets, options, async (files, error) => {
        if (error) throw error;
        for (const item of files) {
            let itemPath = join(paths.atlas.path, `${item.name}`);
            const ext = getFileExtensionFromPath(itemPath);
            if (ext === 'json') {
                const path = itemPath.slice(0, itemPath.lastIndexOf('.'));
                itemPath = `${path}.${ext}`;
            }
            await fs.appendFile(itemPath, item.buffer);
        }
    });
    const json = `${paths.atlas.path}${SLASH}${name}.json`;
    const png = `${paths.atlas.path}${SLASH}${name}.png`;
    return { name, json: getShorterPath(json, 'src'), png: getShorterPath(png, 'src') };
}

async function generateAtlases() {
    const { path } = paths.images;
    const atlases = [];
    try {
        const folders = await fs.readdir(path, 'utf8');
        const atlasNames = [];
        for (const folder of folders) {
            const folderPath = join(path, folder);
            const stat = await fs.stat(folderPath);
            if (!stat.isDirectory()) continue;
            const folderContent = await getFolderContent(join(path, folder), true, folder);
            if (folderContent.length === 0) continue;
            const imageFiles = folderContent.filter((f) => isImage(f));
            atlasNames.push(folder);
            const atl = await generateSingleAtlas(imageFiles, folder);
            atlases.push(atl);
        }

        let str = `// @ts-nocheck\nimport { parseBase64JsonToObject } from '..${SLASH}utils${SLASH}Utils';\n\n`
        for (const data of atlases) {
            const jsonPath = `'..${SLASH}assets${data.json.split('assets')[1]}'`
            const pngPath = `'..${SLASH}assets${data.png.split('assets')[1]}?inline'`
            str += `import ${data.name}Png from ${pngPath};\n`
            str += `import ${data.name}Json from ${jsonPath};\n\n`
        }

        str += 'export const ATLASES = ['
        for (const data of atlases) {
            if (data.name !== 'preload') {
                str += `{name: '${data.name}', img:${data.name}Png, json: ${data.name}Json,},`
            }
        }
        str += '];\n\n'

        const preload = atlases.find(a => a.name === 'preload')
        str += `export const PRELOAD_ATLAS = {name: '${preload.name}', img:${preload.name}Png, json: ${preload.name}Json,}`

        const file = join(__dirname, `..${SLASH}src${SLASH}assetsInfo${SLASH}atlases.ts`);
        await fs.writeFile(file, str);
        await runPrettierOn(file);
    } catch (e) {
        console.log(e.message);
    }
}

async function generateUncompressedSprites() {
    const { path } = paths.uncompressed;
    try {
        const files = await getFolderContent(path, true);
        const images = files.filter((f) => isImage(f));
        let filesNamesAndPaths = [];
        if (images.length !== 0) {
            filesNamesAndPaths = images.map((el) => {
                const name = getFileNameWithExtension(el);
                return { name, path: el };
            });
        }

        let str = "// @ts-nocheck\n\n"

        for (const data of filesNamesAndPaths) {
            const path = `'..${SLASH}assets${data.path.split('assets')[1]}'`
            str += `import ${data.name.split('.')[0]} from ${path}; \n`
        }

        str += 'export const IMAGES = ['
        for (const data of filesNamesAndPaths) {
            str += `{name: '${data.name}', path:${data.name.split('.')[0]},},`
        }
        str += ']'

        const file = join(__dirname, `..${SLASH}src${SLASH}assetsInfo${SLASH}images.ts`);
        await fs.writeFile(file, str);
        await runPrettierOn(file);
    } catch (e) {
        console.log(e.message);
    }
}

async function generateSpines() {
    const { path } = paths.spines
    const spines = {};
    const spineVariables = {};
    try {
        const folders = await fs.readdir(path, 'utf8');
        for (const folder of folders) {
            const folderPath = join(path, folder);
            const stat = await fs.stat(folderPath);
            if (!stat.isDirectory()) continue
            const folderContent = await getFolderContent(join(path, folder), true, folder);
            const data = {}
            spineVariables[folder] = {}

            for (const file of folderContent) {
                const extension = getFileExtensionFromPath(file)
                const variableName = folder + capitalize(extension)
                spineVariables[folder][extension] = variableName
                if (extension === 'png') {
                    spineVariables[folder].pngFile = file
                }
                data[variableName] = getShorterPath(join(path, folder, file), 'src')
            }
            spines[folder] = data
        }
        // TODO - cleanup, make simpler logic
        let fileData = '// @ts-nocheck\n\n';
        let SPINES_DATA = {}

        Object.keys(spines).forEach(key => {
            const spine = spines[key]
            Object.keys(spine).forEach(fileName => {
                const filePath = spine[fileName]
                fileData += `import ${fileName} from '..${SLASH}${filePath}?`
                fileData += getFileExtensionFromPath(filePath) === 'json' ? 'raw' : 'inline'
                fileData += `';\n`
            })
            fileData += '\n'
        })

        fileData += '\n\nexport const SPINES_MANIFEST = ['

        Object.keys(spineVariables).forEach(key => {
            const spine = spineVariables[key]
            SPINES_DATA[key] = {
                skeleton: spine.json,
                atlas: spine.atlas
            }
            fileData += `\n{
            alias: '${spine.json}',
            src: 'data:application/json;base64,' + btoa(${spine.json}),
        },
        {
            alias: '${spine.atlas}',
            src: ${spine.atlas},
            data: {
            images: {
                '${spine.pngFile}': ${spine.png}
            },
            },
        },
        `
        })

        fileData += ']\n\n'

        fileData += 'export const SPINES_DATA = ' + JSON.stringify(SPINES_DATA)

        const file = join(__dirname, `..${SLASH}src${SLASH}assetsInfo${SLASH}spines.ts`)
        await fs.writeFile(file, fileData);
    } catch (e) {
        console.log(e.message);
    }
}

async function generateAudioAssets() {
    const { path } = paths.sounds;
    try {
        const files = await getFolderContent(path, true);
        let filesNamesAndPath = [];
        if (files.length !== 0) {
            filesNamesAndPath = files.map((el) => {
                const name = getFileNameWithoutExtension(el);
                return { name, path: el };
            });
        }

        let str = "// @ts-nocheck\n\n"

        for (const data of filesNamesAndPath) {
            const path = `'..${SLASH}assets${data.path.split('assets')[1]}'`
            str += `import ${data.name.split('.')[0]} from ${path}; \n`
        }

        str += 'export const SOUNDS = ['
        for (const data of filesNamesAndPath) {
            str += `{name: '${data.name}', path:${data.name.split('.')[0]},},`
        }
        str += ']'


        const file = join(__dirname, `..${SLASH}src${SLASH}assetsInfo${SLASH}audio.ts`);
        // const data = `export const audioAssets = ${JSON.stringify(filesNamesAndPath)}`;
        await fs.writeFile(file, str);
        // await runPrettierOn(file);
    } catch (e) {
        console.log(e.message);
    }
}

async function start() {
    console.log('removing current atlases');
    await emptyAtlasFolder();
    console.log('generating atlases');
    await generateAtlases();
    console.log('generating uncompressed sprites');
    await generateUncompressedSprites();
    console.log('generating Spines');
    await generateSpines();
    console.log('generating audio assets');
    await generateAudioAssets();
    console.log('asset generation complete');
    console.log('running the game');
}

start();