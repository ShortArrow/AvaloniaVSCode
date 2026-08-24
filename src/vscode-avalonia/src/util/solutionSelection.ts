/**
 * Picks the solution file that governs the workspace.
 *
 * A workspace can contain unrelated solutions in vendored, archived or
 * git-ignored subtrees, and file search does not honour `.gitignore`. The
 * shallowest candidate is therefore the one that governs the workspace; at
 * equal depth a classic `.sln` wins over the newer `.slnx`, and remaining ties
 * are broken by name so the choice does not depend on search order.
 * @param paths Solution file paths found in the workspace.
 * @returns The governing solution path, or undefined when there are none.
 */
export function pickSolutionPath(paths: string[]): string | undefined {
	return [...paths].sort(compareSolutionPaths)[0];
}

function compareSolutionPaths(left: string, right: string): number {
	return (
		pathDepth(left) - pathDepth(right) ||
		extensionRank(left) - extensionRank(right) ||
		left.localeCompare(right)
	);
}

function pathDepth(candidate: string): number {
	return candidate.split(/[\\/]/).length;
}

function extensionRank(candidate: string): number {
	return candidate.toLowerCase().endsWith(".slnx") ? 1 : 0;
}
