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
			.then(success => {
				alert('Directory ' + dir + ' exists');
				return true;
			})
			.catch(err => {
				alert('Directory ' +  dir + 'doesn\'t exist');
				return false;
			});
	}

	createDirectory(dir) {
		this.file.createDir(this.fs, dir, false)
		.then(success => {
			alert('Directory ' + dir + ' created in file system');
			return true;
		})
		.catch(err => {
			alert('Directory already exists');
			return false;
		});
	}

	readFile(fileName) {
		alert('reading file ' + fileName);
		return new Promise((resolve, reject) => {
			this.file.readAsText(this.fs, fileName)
			.then(content => {
				// TODO: do something with file content here
				alert("inpromise " + content);
				resolve(content);
			})
			.catch(err => {
				alert('reading file failed ' + err);
			});
		});
	}

	writeFile(fileName, content) {
		this.file.writeExistingFile(this.fs, fileName, content)
			.then(success => alert('writing to file successful'))
			.catch(err => alert('writing to file failed ' + err));
	}

	readDirectory(dir) {
		alert('reading directory ' + dir);
		//only for testing purpose, delete later
		this.file.listDir(this.fs, this.baseDir);
		let fullpath = this.fs + dir;
		this.file.resolveDirectoryUrl(fullpath)
			.then(result => {
				let resolvedFileSystem = result;
				return this.file.getDirectory(resolvedFileSystem, dir, { create: false, exclusive: false });
			})
			.catch(err => alert('reading directory failed ' + err));
	}
}
