import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';

@Injectable()
export class FileController{
	const fs:string = cordova.file.dataDirectory;
	const baseDir:string = 'brain';
	file: File;
	baseDir: String;

	constructor(private f: File) {
		this.file = f;
	}

	checkDirectory(dir) {
		this.file.checkDir(this.file.dataDirectory, dir)
			.then(success => console.log('Directory exists'))
			.catch(err => console.log('Directory doesn\'t exist'));
	}

	readFile(fileName) {
		console.log('reading file ' + filename);
		let directoryResolvedUrl = this.file.resolveDirectoryUrl(this.file.checkDir(this.fs, this.baseDir));
		return this.file.getFile(directoryResolvedUrl, fileName, { create: false });
	}

	writeFile(fileName, content) {
		this.file.writeExistingFile(this.fs, fileName, content)
			.then(success => console.log('writing to file successful'))
			.catch(err => console.log('writing to file failed ' + err));
	)

	readDirectory(dir) {
		console.log('reading directory ' + dir);
		this.file.listDir(this.fs, this.baseDir);
		let directoryRes = this.file.getDirectory(dir);
		return this.file.readEntries(directoryRes);
	}
}
