import * as path from "path";
import * as Mocha from "mocha";
import * as glob from "glob";

/**
 * Runs the unit test suites that do not need a VS Code host, so they stay
 * runnable without downloading and launching the editor.
 */
function main() {
	const mocha = new Mocha({ ui: "tdd", color: true });
	const unitTestsRoot = path.resolve(__dirname, "unit");

	glob("**/*.test.js", { cwd: unitTestsRoot }, (error, files) => {
		if (error) {
			console.error(error);
			process.exit(1);
		}

		files.forEach((file) => mocha.addFile(path.resolve(unitTestsRoot, file)));
		mocha.run((failures) => process.exit(failures > 0 ? 1 : 0));
	});
}

main();
