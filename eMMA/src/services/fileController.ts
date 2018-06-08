import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';

@Injectable()
export class FileController {
	file: File;
	fs: string;
	baseDir: string;

	constructor(private f: File) {
		this.file = f;
		this.fs = this.file.dataDirectory;
		this.baseDir = 'brain';
	}

	checkDirectory(dir) {
		this.file.checkDir(this.file.dataDirectory, dir)
			.then(success => {
				console.log('Directory ' + dir + ' exists');
				return true;
			})
			.catch(err => {
				console.log('Directory ' + dir + 'doesn\'t exist');
				return false;
			});
	}

	createDirectory(dir) {
		this.file.createDir(this.fs, dir, false)
			.then(success => {
				console.log('Directory ' + dir + ' created in file system');
				return true;
			})
			.catch(err => {
				console.log('Directory already exists');
				return false;
			});
	}

	readFile(fileName) {
		console.log('reading file ' + fileName);
		return new Promise((resolve, reject) => {
			this.file.readAsText(this.fs, fileName)
				.then(content => {
					// TODO: do something with file content here
					resolve(content);
				})
				.catch(err => {
					console.log('reading file failed ' + err);
				});
		});
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
			.then(resolvedFileSystem => {
				return this.file.getDirectory(resolvedFileSystem, dir, { create: false, exclusive: false });
			})
			.catch(err => {
				console.log('reading directory failed ' + err)
			});
	}
}
