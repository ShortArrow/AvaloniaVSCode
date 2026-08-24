import * as assert from "assert";
import * as path from "path";

import { pickSolutionPath } from "../../util/solutionSelection";

suite("pickSolutionPath", () => {
	test("prefers the workspace root over a solution nested in an ignored directory", () => {
		const picked = pickSolutionPath([
			"V:/NasmPsR9Gui/work/past/PsInterfaceUnitTester_GUI/PS-InterfaceTester_GUI/PSインタフェース装置_GUI.sln",
			"V:/NasmPsR9Gui/NasmPsR9Gui.slnx",
		]);

		assert.strictEqual(picked, "V:/NasmPsR9Gui/NasmPsR9Gui.slnx");
	});

	test("prefers a classic .sln over a .slnx sitting at the same depth", () => {
		const picked = pickSolutionPath(["V:/app/App.slnx", "V:/app/App.sln"]);

		assert.strictEqual(picked, "V:/app/App.sln");
	});

	test("orders same-depth candidates deterministically", () => {
		const candidates = ["V:/app/Beta.sln", "V:/app/Alpha.sln"];

		assert.strictEqual(pickSolutionPath(candidates), "V:/app/Alpha.sln");
		assert.strictEqual(pickSolutionPath([...candidates].reverse()), "V:/app/Alpha.sln");
	});

	test("handles Windows separators when measuring depth", () => {
		const nested = path.win32.join("V:", "app", "nested", "deep", "Deep.sln");
		const root = path.win32.join("V:", "app", "Root.slnx");

		assert.strictEqual(pickSolutionPath([nested, root]), root);
	});

	test("returns undefined when no solution was found", () => {
		assert.strictEqual(pickSolutionPath([]), undefined);
	});

	test("leaves the caller's array untouched", () => {
		const candidates = ["V:/app/nested/Nested.sln", "V:/app/Root.sln"];

		pickSolutionPath(candidates);

		assert.deepStrictEqual(candidates, ["V:/app/nested/Nested.sln", "V:/app/Root.sln"]);
	});
});
