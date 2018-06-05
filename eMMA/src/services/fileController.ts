import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';

@Injectable()
export class FileController{
	file:File;
	fs:string;
	baseDir:string;

	constructor(private f: File) {
		this.file = f;
		this.fs =  this.file.dataDirectory;
		this.baseDir = 'brain';
	}

	checkDirectory(dir) {
		this.file.checkDir(this.file.dataDirectory, dir)
			.then(success => console.log('Directory exists'))
			.catch(err => console.log('Directory doesn\'t exist'));
	}

	readFile(fileName) {
		console.log('reading file ' + fileName);
		return this.file.readAsText(this.fs, fileName);
	}

	writeFile(fileName, content) {
		this.file.writeExistingFile(this.fs, fileName, content)
			.then(success => console.log('writing to file successful'))
			.catch(err => console.log('writing to file failed ' + err));
	}

	readDirectory(dir) {
		console.log('reading directory ' + dir);
		//only for testing purpose, delete later
		this.file.listDir(this.fs, this.baseDir);
		let fullpath = this.fs + dir;
		this.file.resolveDirectoryUrl(fullpath)
			.then(result => {
				let resolvedFileSystem = result;
				return this.file.getDirectory(resolvedFileSystem, dir, { create: false, exclusive: false });
			})
			.catch(err => console.log('reading directory failed ' + err));
	}
}
