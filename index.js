const {promises: fs} = require('fs');
const dree = require('dree');

class BrainFuckV2 {

    constructor(path, outputDir) {

        this.path = path || './';
        this.outputDir = outputDir || 'output';

        this.init().then(e => console.log('All compiled look in ' + this.outputDir + ' for result'));
    }


    compileJS(string) {
        const zero = '+[]';
        const one = '+!![]';

        const number = n => {
            if (n === 0) return zero;
            return Array.from({length: n}, () => one).join(' + ');
        };

        const map = {};

        const fromString = s => s.split('').map(x => {
            if (!(x in map)) {
                const charCode = x.charCodeAt(0);
                return `([]+[])[${fromString('constructor')}][${fromString('fromCharCode')}](${number(charCode)})`;
            }
            return map[x];
        }).join('+');

        map.a = `(+{}+[])[${number(1)}]`;
        map.b = `({}+[])[${number(2)}]`;
        map.o = `({}+[])[${number(1)}]`;
        map.e = `({}+[])[${number(4)}]`;
        map.c = `({}+[])[${number(5)}]`;
        map.t = `({}+[])[${number(6)}]`;
        map[' '] = `({}+[])[${number(7)}]`;
        map.f = `(![]+[])[${number(0)}]`;
        map.s = `(![]+[])[${number(3)}]`;
        map.r = `(!![]+[])[${number(1)}]`;
        map.u = `(!![]+[])[${number(2)}]`;
        map.i = `((+!![]/+[])+[])[${number(3)}]`;
        map.n = `((+!![]/+[])+[])[${number(4)}]`;
        map.S = `([]+([]+[])[${fromString('constructor')}])[${number(9)}]`;
        map.g = `([]+([]+[])[${fromString('constructor')}])[${number(14)}]`;
        map.p = `([]+(/-/)[${fromString('constructor')}])[${number(14)}]`;
        map['\\'] = `(/\\\\/+[])[${number(1)}]`;
        map.d = `(${number(13)})[${fromString('toString')}](${number(14)})`;
        map.h = `(${number(17)})[${fromString('toString')}](${number(18)})`;
        map.m = `(${number(22)})[${fromString('toString')}](${number(23)})`;
        map.C = `((()=>{})[${fromString('constructor')}](${fromString('return escape')})()(${map['\\']}))[${number(2)}]`;

        const compile = code => `(()=>{})[${fromString('constructor')}](${fromString(code)})()`;

        return compile(string);
    }

    async init() {
        await this.makeDir();
        const options = {
            stat: false,
            extensions: ['js'],
        };
        await dree.scanAsync(this.path, options, async (file) => {
            if(file.path.indexOf('node_modules') !== -1) return;
            if(file.path.indexOf(this.outputDir) !== -1) return;
            const relativePath = file.path.replace(__dirname, '');
            await this.makeOutputFileWithData(relativePath);
        });
    }

    async makeOutputFileWithData(file){
        const pathToFile = this.outputDir + file;
        // const stringOfFile = await this.getFileData(file);
        // const parsedResult = await this.compileJS(stringOfFile);
        const parsedResult = 'some text';
        try {
            await this.fileExist(pathToFile);
            await this.deleteFile(pathToFile);
            await this.makeFile(pathToFile, parsedResult);
        } catch (e) {
           await this.makeFile(pathToFile, parsedResult);
        }
    }

    async getFileData(path) {
        let data;
        try {
            data = await fs.readFile('./' + path, 'utf8');
        } catch (err) {
            console.error(err)
        }
        return data;
    }

    async makeDir() {
        try {
            await fs.mkdir(this.outputDir);
        } catch (e) {
            console.log('Dir already exist skip');
        }
    }

    async fileExist(filePath) {
        try {
            await fs.access(filePath, fs.F_OK, (err) => {
                return true
            })
        } catch (e) {
            return false;
        }
    }

    async makeFile(pathToFile, parsedResult){
        await fs.writeFile(pathToFile, parsedResult, (err) => {
            if (err) throw err;
            console.log('File is created successfully.');
        });
    }

    async deleteFile(pathToFile) {
        fs.unlink(pathToFile, (err) => {
            if (err) console.log('file exist some how?');
        })
    }
}

const b = new BrainFuckV2();