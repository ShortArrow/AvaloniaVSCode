import * as assert from "assert";

import { findMissingPreviewerInputs } from "../../util/previewerInputs";
import { PreviewerParams } from "../../models/PreviewerParams";

suite("findMissingPreviewerInputs", () => {
	const previewParams: PreviewerParams = {
		previewerPath: "C:/nuget/Avalonia.Designer.HostApp.dll",
		projectRuntimeConfigFilePath: "V:/app/src/Host/bin/Debug/net8.0/App.runtimeconfig.json",
		projectDepsFilePath: "V:/app/src/Host/bin/Debug/net8.0/App.deps.json",
		targetPath: "V:/app/src/Host/bin/Debug/net8.0/App.dll",
	};
	const xamlAssemblyPath = "V:/app/src/Presentation/bin/Debug/net8.0/App.Presentation.dll";

	test("reports nothing when every input is on disk", () => {
		const missing = findMissingPreviewerInputs(previewParams, xamlAssemblyPath, () => true);

		assert.deepStrictEqual(missing, []);
	});

	test("reports the assembly owning the XAML file when a stale solution model names a renamed assembly", () => {
		const missing = findMissingPreviewerInputs(
			previewParams,
			xamlAssemblyPath,
			(candidate) => candidate !== xamlAssemblyPath
		);

		assert.deepStrictEqual(missing, [xamlAssemblyPath]);
	});

	test("reports an executable project input only once when it also owns the XAML file", () => {
		const missing = findMissingPreviewerInputs(previewParams, previewParams.targetPath, () => false);

		assert.strictEqual(missing.filter((input) => input === previewParams.targetPath).length, 1);
	});
});
