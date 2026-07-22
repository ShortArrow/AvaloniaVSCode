
using System.Linq;
using System.Text.Json;
using Avalonia.Ide.CompletionEngine;
using Avalonia.Ide.CompletionEngine.AssemblyMetadata;
using Avalonia.Ide.CompletionEngine.DnlibMetadataProvider;
using AvaloniaLanguageServer.Services;


namespace AvaloniaLanguageServer.Models;

public class Workspace
{
    public ProjectInfo? ProjectInfo { get; private set; }
    public BufferService BufferService { get; } = new();

    public async Task InitializeAsync(DocumentUri uri, string? RootPath)
    {
        try
        {
            ProjectInfo = await ProjectInfo.GetProjectInfoAsync(uri);
            CompletionMetadata = BuildCompletionMetadata(RootPath);
        }
        catch (Exception e)
        {
            throw new Exception($"Failed to initialize workspace: {uri}", e);
        }
    }

    Metadata? BuildCompletionMetadata(string? RootPath)
    {
        if (RootPath == null)
            return null;

        var slnFile = SolutionName(RootPath) ?? Path.GetFileNameWithoutExtension(RootPath);

        if (slnFile == null)
            return null;


        var slnFilePath = Path.Combine(Path.GetTempPath(), $"{slnFile}.json");

        if (!File.Exists(slnFilePath))
            return null;

        string content = File.ReadAllText(slnFilePath);
        var package = JsonSerializer.Deserialize<SolutionData>(content);
        var exeProj = package!.GetExecutableProject();

        return _metadataReader.GetForTargetAssembly(exeProj?.TargetPath ?? "");
    }

    /// <summary>
    /// Finds the workspace's solution file, preferring a classic <c>.sln</c> and
    /// falling back to the <c>.slnx</c> solution format, mirroring the extension's
    /// own precedence. The full filename (with extension) is returned because the
    /// generated metadata JSON is named after it (e.g. <c>App.slnx.json</c>).
    /// </summary>
    string? SolutionName(string RootPath)
    {
        return FindSolution(RootPath, ".sln") ?? FindSolution(RootPath, ".slnx");
    }

    static string? FindSolution(string RootPath, string extension)
    {
        // A "*.sln" search pattern also matches ".slnx" on Windows, so the
        // extension is compared explicitly to keep precedence deterministic.
        return Directory
            .EnumerateFiles(RootPath, $"*{extension}", SearchOption.AllDirectories)
            .Where(path => Path.GetExtension(path).Equals(extension, StringComparison.OrdinalIgnoreCase))
            .Select(Path.GetFileName)
            .FirstOrDefault();
    }

    public Metadata? CompletionMetadata { get; private set; }
    readonly MetadataReader _metadataReader = new(new DnlibMetadataProvider());
}