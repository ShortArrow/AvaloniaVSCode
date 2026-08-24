import * as path from "path";

/** Folder inside the packaged extension that holds the bundled language server. */
export const languageServerDirectory = "avaloniaServer";

/** Entry assembly of the bundled Avalonia language server. */
export const languageServerAssembly = "AvaloniaLanguageServer.dll";

/**
 * Resolves the bundled language server assembly within an extension installation.
 * @param extensionPath Root directory of the installed extension.
 * @param exists Predicate reporting whether a path is present on disk.
 * @returns The absolute path to the language server assembly.
 * @throws When the assembly is absent, which means the VSIX was packaged without building it.
 */
export function resolveLanguageServerPath(extensionPath: string, exists: (candidate: string) => boolean): string {
	const serverLocation = path.join(extensionPath, languageServerDirectory, languageServerAssembly);

	if (!exists(serverLocation)) {
		throw new Error(
			`Avalonia language server not found at ${serverLocation}. ` +
				`This build of the extension was packaged without ${languageServerDirectory}/${languageServerAssembly}, ` +
				`so intellisense is unavailable.`
		);
	}

	return serverLocation;
}
