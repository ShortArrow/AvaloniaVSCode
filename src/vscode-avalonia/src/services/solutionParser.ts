import * as path from "path";

import * as vscode from "vscode";

import * as sln from "../models/solutionModel";
import { spawn } from "child_process";

import { AppConstants, logger } from "../util/Utilities";
import { getDotnetRuntimePath } from "../runtimeManager";
import { pickSolutionPath } from "../util/solutionSelection";

/**
 * Parses the workspace solution and stores the resulting model in the workspace state.
 * @param context The extension context.
 * @throws When the solution parser cannot be located or exits with a failure.
 */
export async function buildSolutionModel(context: vscode.ExtensionContext): Promise<void> {
	const avaloniaExtn = vscode.extensions.getExtension(AppConstants.extensionId);
	if (!avaloniaExtn) {
		throw new Error("Could not find sample extension.");
	}
	const solutionPath = await getSolutionFile();
	if (!solutionPath) {
		throw new Error("Could not find solution file.");
	}

	const parserLocation = path.join(avaloniaExtn.extensionPath, "solutionParserTool", "SolutionParser.dll");

	return new Promise<void>(async (resolve, reject) => {
		let dotnetCommandPath: string;
		try {
			dotnetCommandPath = await getDotnetRuntimePath();
		}
		catch (error) {
			reject(error);
			return;
		}

		let jsonContent = "";
		const previewer = spawn(dotnetCommandPath.putInQuotes(), [parserLocation.putInQuotes(), solutionPath.putInQuotes()], {
			windowsVerbatimArguments: false,
			env: process.env,
			shell: true,
		});

		previewer.on("spawn", () => {
			jsonContent = "";
			logger.appendLine(`parser process args: ${previewer.spawnargs}`);
		});

		previewer.stdout.on("data", (data) => {
			jsonContent += data.toString();
		});

		let errorData = "";

		previewer.stderr.on("data", (data) => {
			logger.appendLine(data.toString());
			errorData += data.toString();
		});

		previewer.on("close", (code) => {
			logger.appendLine(`parser process exited with code ${code}`);

			if (code === 0) {
				try {
					updateSolutionModel(context, jsonContent);
				}
				catch (error) {
					reject(error);
					return;
				}
				resolve();
			}			
			else {
				if (errorData.length === 0) {
					errorData = `Solution parser process exited with code ${code}`;
				}

				reject(new Error(errorData));
			}
		});
	});
}

/**
 * Returns the solution model from the workspace state.
 * @param context The extension context.
 * @returns The solution model, or undefined if it doesn't exist.
 */
export function getSolutionModel(context: vscode.ExtensionContext): sln.Solution | undefined {
	const solutionData = context.workspaceState.get<sln.Solution | undefined>(AppConstants.solutionData, undefined);
	return solutionData;
}

function updateSolutionModel(context: vscode.ExtensionContext, jsonContect: string) {
	const data = JSON.parse(jsonContect);
	context.workspaceState.update(AppConstants.solutionData, data);
}

/**
 * Locates the workspace solution file. The parser accepts a classic `.sln` or
 * the newer `.slnx` (XML solution) by path; when neither exists it returns the
 * first workspace folder.
 * @returns The solution file path, or the workspace folder path when none is found.
 */
async function getSolutionFile(): Promise<string | undefined> {
	const candidates = await vscode.workspace.findFiles("**/*.{sln,slnx}");
	const solutionPath = pickSolutionPath(candidates.map((candidate) => candidate.fsPath));

	return solutionPath ?? vscode.workspace.workspaceFolders?.[0].uri.fsPath;
}
