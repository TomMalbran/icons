/**
 * A Zip Generator
 */
class Zip {

    zip   = [];
    files = [];

    constructor(name) {
        this.name = name;
    }

    decimalToBinary(dec, size) {
        return dec.toString(2).padStart(size, "0");
    }

    stringToDecimal(string) {
        const encoded = new TextEncoder().encode(string);
        return Array.from(encoded);
    }

    stringToHex(string) {
        return this.stringToDecimal(string).map((x) => x.toString(16).padStart(2, "0"));
    }

    hexToBuffer(hex) {
        return new Uint8Array(hex.split(" ").map((x) => parseInt(x, 16)));
    }

    binaryToHex(bin) {
        const first  = parseInt(bin.slice(8), 2).toString(16).padStart(2, "0");
        const second = parseInt(bin.slice(0, 8), 2).toString(16).padStart(2, "0");
        return `${first} ${second}`;
    }

    reverse(hex) {
        const hexArray = [];
        for(let i = 0; i < hex.length; i += 2) {
            hexArray[i] = `${hex[i]}${hex[i + 1]}`;
        }
        return hexArray.filter((a) => a).reverse().join(" ");
    }

    crc32(r) {
        for(var a, o = [], c = 0; c < 256; c++) {
            a = c;
            for (var f = 0; f < 8; f++) {
                a = 1 & (a ? 3988292384 ^ a >>> 1 : a) >>> 1;
            }
            o[c] = a;
        }
        for (var n = -1, t = 0; t < r.length; t++) {
            n = n >>> 8 ^ o[255&(n^r[t])];
        }
        return this.reverse(((-1^n) >>> 0).toString(16).padStart(8, "0"));
    }

    add(name, str, folder = "") {
        const uint = [ ...new Uint8Array(this.stringToDecimal(str)) ];
        uint.name    = name;
        uint.modTime = new Date();
        uint.fileUrl =`${this.name}/${folder}${name}`;
        this.zip[name] = uint;
    }

    getModTime(modTime) {
        const lastMod = new Date(modTime);
        const hour    = this.decimalToBinary(lastMod.getHours(), 5);
        const minutes = this.decimalToBinary(lastMod.getMinutes(), 6);
        const seconds = this.decimalToBinary(Math.round(lastMod.getSeconds() / 2), 5);
        const year    = this.decimalToBinary(lastMod.getFullYear() - 1980, 7);
        const month   = this.decimalToBinary(lastMod.getMonth() + 1, 4);
        const day     = this.decimalToBinary(lastMod.getDate(), 5);
        const first   = this.binaryToHex(`${hour}${minutes}${seconds}`);
        const second  = this.binaryToHex(`${year}${month}${day}`);
        return `${first} ${second}`;
    }

    create() {
        let count = 0;
        let centralDirectoryFileHeader = '';
        let directoryInit = 0;
        let offSetLocalHeader = '00 00 00 00';

        for (const name in this.zip) {
            const zip     = this.zip[name];
            const modTime = this.getModTime(zip.modTime);

            const crc              = this.crc32(zip);
            const size             = this.reverse(parseInt(zip.length).toString(16).padStart(8, "0"));
            const nameFile         = this.stringToHex(zip.fileUrl).join(' ');
            const nameSize         = this.reverse(zip.fileUrl.length.toString(16).padStart(4, "0"));
            const fileHeader       = `50 4B 03 04 14 00 00 00 00 00 ${modTime} ${crc} ${size} ${size} ${nameSize} 00 00 ${nameFile}`;
            const fileHeaderBuffer = this.hexToBuffer(fileHeader);

            directoryInit = directoryInit + fileHeaderBuffer.length + zip.length;
            centralDirectoryFileHeader = `${centralDirectoryFileHeader}50 4B 01 02 14 00 14 00 00 00 00 00 ${modTime} ${crc} ${size} ${size} ${nameSize} 00 00 00 00 00 00 01 00 20 00 00 00 ${offSetLocalHeader} ${nameFile} `;
            offSetLocalHeader = this.reverse(directoryInit.toString(16).padStart(8, "0"));
            this.files.push(fileHeaderBuffer, new Uint8Array(zip));
            count++;
        }

        centralDirectoryFileHeader=centralDirectoryFileHeader.trim();
        let entries = this.reverse(count.toString(16).padStart(4, "0"));
        let dirSize = this.reverse(centralDirectoryFileHeader.split(" ").length.toString(16).padStart(8, "0"));
        let dirInit = this.reverse(directoryInit.toString(16).padStart(8, "0"));
        let centralDirectory = `50 4b 05 06 00 00 00 00 ${entries} ${entries} ${dirSize} ${dirInit} 00 00`;

        this.files.push(this.hexToBuffer(centralDirectoryFileHeader), this.hexToBuffer(centralDirectory));

        let a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([ ...this.files ], { type: "application/octet-stream" }));
        console.log(a.href)
        a.download = `${this.name}.zip`;
        a.click();
    }
}
