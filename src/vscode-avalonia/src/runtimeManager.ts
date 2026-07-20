import * as vscode from "vscode";
import * as path from "path";
import { AppConstants, logger } from "./util/Utilities";

/**
 * The version of the .NET runtime to acquire.
 */
const dotnetRuntimeVersion = "9.0";

interface IDotnetAcquireResult {
    dotnetPath: string;
}

/**
 * Gets the path to the .NET runtime.
 * @returns A promise that resolves to the path to the .NET runtime.
 * @throws An error if the .NET runtime path could not be resolved.
 */
export async function getDotnetRuntimePath(): Promise<string> {
	// ms-dotnettools の dotnet.findPath は requestingExtensionId に紐づく取得記録を
	// 参照する。フォークのように取得記録の無い拡張 ID だと内部で undefined を読み
	// ("Cannot read properties of undefined (reading 'extensionId')") 例外になる。
	// これを未捕捉で伝播させると activate ごと失敗し全コマンドが登録されない。
	// 失敗時は PATH の 'dotnet' にフォールバックして機能を止めない。
	try {
		const path = await vscode.commands.executeCommand<IDotnetAcquireResult>("dotnet.findPath", {
			acquireContext: {
				version: dotnetRuntimeVersion,
				requestingExtensionId: AppConstants.extensionId,
				mode: 'runtime',
				installType: 'global',
				architecture: process.arch
			},
			versionSpecRequirement: 'greater_than_or_equal'
		});

		if (path?.dotnetPath) {
			return path.dotnetPath;
		}
		logger.appendLine("dotnet.findPath returned no path; falling back to 'dotnet' on PATH.");
	} catch (error) {
		logger.appendLine(`dotnet.findPath failed (${error}); falling back to 'dotnet' on PATH.`);
	}

	return "dotnet";
}

/**
 * Gets the path to the Avalonia language server.
 * @returns The path to the Avalonia language server.
 * @throws An error if the extension could not be found.
 */
export function getLanguageServerPath() {
	const avaloniaExtn = vscode.extensions.getExtension(AppConstants.extensionId);
	if (!avaloniaExtn) {
		throw new Error("Could not find Avalonia extension.");
	}
	const serverLocation = path.join(avaloniaExtn.extensionPath, "avaloniaServer", "AvaloniaLanguageServer.dll");
	return serverLocation;
}
