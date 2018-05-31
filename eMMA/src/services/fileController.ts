import { File } from '@ionic-native/file';

@Injectable()
export class FileController{
	file: File;


	constructor(private f: File) {
		this.file = f;
	}

	checkDirectory(dir) {
		this.file.checkDir(this.file.dataDirectory, dir).then(success => console.log('Directory exists')).catch(err => console.log('Directory doesn\'t exist'));
	}

	readFile() {

	}
}
