import { PreviewerParams } from "../models/PreviewerParams";

/**
 * Returns the previewer inputs that are absent from disk.
 *
 * The designer host loads the previewer, the executable project's runtime
 * configuration, and the assembly that owns the XAML file being previewed. The
 * last one comes from the cached solution model, so it goes stale whenever a
 * project is renamed and has to be validated alongside the rest.
 * @param previewParams Previewer assets recorded for the executable project.
 * @param xamlAssemblyPath Assembly built from the project that owns the XAML file.
 * @param exists Predicate reporting whether a path is present on disk.
 * @returns The missing paths, without duplicates, in load order.
 */
export function findMissingPreviewerInputs(
	previewParams: PreviewerParams,
	xamlAssemblyPath: string,
	exists: (candidate: string) => boolean
): string[] {
	const requiredPaths = [
		previewParams.previewerPath,
		previewParams.projectRuntimeConfigFilePath,
		previewParams.projectDepsFilePath,
		previewParams.targetPath,
		xamlAssemblyPath,
	];

	return [...new Set(requiredPaths)].filter((candidate) => !exists(candidate));
}
