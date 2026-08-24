# Change Log

All notable changes to the "vscode-avalonia" extension will be documented in this file.

> This is an independent, MIT-licensed continuation of
> [AvaloniaUI/AvaloniaVSCode](https://github.com/AvaloniaUI/AvaloniaVSCode),
> starting from that project's archived `ARCHIVE` branch (tag `upstream-archive`,
> commit `d0e5d9c`, upstream version 0.0.32). Upstream is frozen — no changes
> will be merged from it. Entries under _Unreleased_ and any fork releases
> (starting at 0.1.0) are changes made after the fork point; the upstream 0.0.x
> history is preserved unchanged below.

## [0.1.3] - 2026-08-24

### Fixed

- Pick the solution that governs the workspace. File search returned any `.sln`
  anywhere in the tree and the first hit won, and the `.sln` pattern was queried
  before `.slnx`. File search does not honour `.gitignore`, so a workspace whose
  root holds a `.slnx` could be driven by an unrelated solution archived in a
  git-ignored subtree. The previewer then built that project and stopped at its
  compile errors, never reaching the preview. Candidates are now ordered by path
  depth, with the extension and then the name breaking ties.

- Validate the assembly that owns the XAML file before starting the previewer.
  The pre-flight check covered only the executable project, while the assembly
  handed to the designer host comes from the cached solution model per XAML
  file. Renaming a project left that entry stale, so the previewer started and
  then died with `FileNotFoundException` on an assembly name that no longer
  existed. All designer host inputs are checked together, and a missing one now
  reaches the existing "build the project first" prompt.

- Name the build that is missing the language server. A VSIX packaged without
  `avaloniaServer/AvaloniaLanguageServer.dll` still launched `dotnet` against
  that path, so the only diagnostic was the .NET CLI's "Could not execute
  because the specified command or file was not found", repeated over five
  client restart attempts. The assembly is checked before launch and the error
  says which build is incomplete.

### Removed

- The solution model cache under `%TEMP%`. The branch that read it was never
  taken, so the file was written and never read. The stale project metadata it
  collected would have resurfaced the previewer's `FileNotFoundException` the
  moment that branch was used again.

## [0.1.2] - 2026-07-22

### Added

- Recognize `.slnx` (XML solution) files when locating a workspace's solution.
  Both the AXAML previewer and the language server's completion metadata now
  discover `.slnx` solutions, so preview and autocomplete work in repositories
  that use the newer solution format. Previously only classic `.sln` files were
  discovered; a workspace with only a `.slnx` yielded zero projects and surfaced
  as "No executable project found."

## [0.0.27] - 18 January 2024

Fixes:

- VSCode Extension v0.0.26 still not working [#89](https://github.com/AvaloniaUI/AvaloniaVSCode/issues/89)
- SolutionParser is crashed and previewer is not loaded correctly [#86](https://github.com/AvaloniaUI/AvaloniaVSCode/issues/86)

## [0.0.26] - 03 January 2024

Fixes:

- Can't get past "Build the project first." [#81](https://github.com/AvaloniaUI/AvaloniaVSCode/issues/81)
- Problem with dotnet version dependency [#77](https://github.com/AvaloniaUI/AvaloniaVSCode/issues/77)


## [0.0.25] - 27 November 2023

Fixes: 

- AXAML intellisense in VS Code broken [#66](https://github.com/AvaloniaUI/AvaloniaVSCode/issues/66)
- ALWAYS: Previewer is not available. Build the project first. [#72](https://github.com/AvaloniaUI/AvaloniaVSCode/issues/72)
- [ERROR] dotnet build exited with code 1 [#68](https://github.com/AvaloniaUI/AvaloniaVSCode/issues/68)
- Preview not working, vscode Linux [#58](https://github.com/AvaloniaUI/AvaloniaVSCode/issues/58)
- Previewer not working in Linux. [#61](https://github.com/AvaloniaUI/AvaloniaVSCode/issues/61)

## [0.0.24] - 16 November 2023

Fixed the blocker issue [#65](https://github.com/AvaloniaUI/AvaloniaVSCode/issues/65)

## [0.0.22] - 25 October 2023

## What's Changed
* fixes: Previewer does not work in the v0.0.21 [#63](https://github.com/AvaloniaUI/AvaloniaVSCode/issues/63)

## [0.0.21] - 25 October 2023

## What's Changed
* feat: Add C# snippet for Avalonia AttachedProperty, DirectProperty, S… by @workgroupengineering in https://github.com/AvaloniaUI/AvaloniaVSCode/pull/59
* Fixes warnings by @workgroupengineering in https://github.com/AvaloniaUI/AvaloniaVSCode/pull/60

## New Contributors
* @workgroupengineering made their first contribution in https://github.com/AvaloniaUI/AvaloniaVSCode/pull/59

**Full Changelog**: https://github.com/AvaloniaUI/AvaloniaVSCode/compare/v0.0.20...v0.0.21

## [0.0.20] - 9 October 2023

## What's Changed
* Fix the mouse interaction in previewer by @prashantvc in https://github.com/AvaloniaUI/AvaloniaVSCode/pull/56
* Improve indentation by @prashantvc in https://github.com/AvaloniaUI/AvaloniaVSCode/pull/57


**Full Changelog**: https://github.com/AvaloniaUI/AvaloniaVSCode/compare/v0.0.19...v0.0.20

## [0.0.19] - 13 September 2023
### What's Changed
* Allow users to create a new project from VSCode by @prashantvc in https://github.com/AvaloniaUI/AvaloniaVSCode/pull/47
* Previewer Window Title does not update on tab switch by @prashantvc in https://github.com/AvaloniaUI/AvaloniaVSCode/pull/50


**Full Changelog**: https://github.com/AvaloniaUI/AvaloniaVSCode/compare/v0.0.18...v0.0.19
## [0.0.18] - 08 September 2023
### Fixes

- Extenstion not activating #39
- Extension fails to launch child process if VS Code path has spaces #41


## [0.0.17] - 01 September 2023

### Fixes

- Previewer is blank, it does not get update until focus change. [Issue #8](https://github.com/AvaloniaUI/Avalonia-VSCode-Extension/issues/8)
- Previewer doesn't work when opened from command palette. [Issue #5](https://github.com/AvaloniaUI/Avalonia-VSCode-Extension/issues/5)

## [0.0.13] - 25 August 2023

- Fixes the issue where extension fails to work when on .NET preview releases

## [0.0.11] - 24 August 2023

- Improve the XAML previewer performace
- Support Avalonia xplat solution

### Known issues

1. Previewer may take up to 10 seconds to activate for the first time if you’re using Avalonia `v0.10.*`
2. You must build the project before using the preivewer
3. Previewer may not be visible first time; switch to XAML code tab or save the file

## [0.0.6] - 03 August 2023

- Improved code completion

## [0.0.4] - 25 July 2023

- Code completion will not work for files with `\n` as newline chars [#23](https://github.com/AvaloniaUI/AvaloniaVSCode/issues/23)
- Set higher/lower limit for previewer [#18](https://github.com/AvaloniaUI/AvaloniaVSCode/issues/18)

## [0.0.3] - 19 July 2023

- Fixed the issue where `Show preview` command is available for all `xml` files (issue #15)
- Previewer now shows the preview from the active `axaml` file (issue #19)

### Known issues

- Previewer may take over 5 seconds to render if you're using Avalonia 0.10.*
- Auto complete my crash for large files

## [0.0.2] - 12 July 2023

- Offers previewer zoom in/out functionality
- Previewer now has grid bacground
- Previewer changes backgroud based on VS Code theme

### Known issues

- Previewer will not update when you switch between `axaml` files

## [0.0.1]

- Initial release
- Offers XAML auto-complete
- Offers Basic XMAL Previewer

### Known issues

- Extension works when only Avalonia project in the workspace
- You cannot zoom-in or out previwer panel
- Auto-complete lists duplicate items