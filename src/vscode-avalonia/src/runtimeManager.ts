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
 * Resolves the .NET runtime path via the ms-dotnettools `dotnet.findPath`
 * command, falling back to `dotnet` on the PATH when that command has no
 * acquisition record for this extension id (which otherwise throws and would
 * fail the whole activation).
 * @returns A promise that resolves to the path to the .NET runtime.
 */
export async function getDotnetRuntimePath(): Promise<string> {
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
