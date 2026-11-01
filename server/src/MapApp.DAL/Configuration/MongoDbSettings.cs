namespace MapApp.DAL.Configuration;

public class MongoDbSettings
{
    public const string SectionName = "MongoDb";

    public string ConnectionString { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = string.Empty;
    public string PolygonsCollectionName { get; set; } = "polygons";
    public string MapObjectsCollectionName { get; set; } = "mapObjects";
}
