import * as assert from "assert";
import * as path from "path";

import { resolveLanguageServerPath } from "../../util/languageServerPath";

suite("resolveLanguageServerPath", () => {
	const extensionPath = path.join("C:", "extensions", "vscode-avalonia");
	const bundledServer = path.join(extensionPath, "avaloniaServer", "AvaloniaLanguageServer.dll");

	test("returns the bundled assembly when it is present", () => {
		const resolved = resolveLanguageServerPath(extensionPath, (candidate) => candidate === bundledServer);

		assert.strictEqual(resolved, bundledServer);
	});

	test("names the missing assembly when the VSIX was packaged without it", () => {
		assert.throws(
			() => resolveLanguageServerPath(extensionPath, () => false),
			(error: Error) => error.message.includes(bundledServer)
		);
	});
});
