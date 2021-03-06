
declare module "lessjs" {

	class FileManager {
		extractUrlParts: (url: string, baseUrl: string) => string;
	}

	let less: {
		render: (content: string, callback: (e: Error, result: { css: string }) => void) => void;
		FileManager: typeof FileManager
	}


	export = less;
}

interface RequireJS {
	(modules: string[], success?: (arg0: any, arg1: any) => void, err?: (err) => void);
}


declare let requirejs: {
	(config: { context: string }, modules?: string[], callback?: Function, err?: Function): RequireJS;
	(modules: string[], callback?: Function, err?: Function): RequireJS;
};
