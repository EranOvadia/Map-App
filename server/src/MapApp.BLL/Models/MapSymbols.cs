namespace MapApp.BLL.Models;

/// <summary>The symbols a map object can be drawn with. "marker" is the classic map pin.</summary>
public static class MapSymbols
{
    public const string Marker = "marker";

    public static readonly IReadOnlyList<string> All = [Marker, "star", "triangle", "square", "circle", "jeep"];

    private static readonly HashSet<string> Lookup = new(All, StringComparer.OrdinalIgnoreCase);

    public static bool IsValid(string? symbol) => !string.IsNullOrWhiteSpace(symbol) && Lookup.Contains(symbol);
}
