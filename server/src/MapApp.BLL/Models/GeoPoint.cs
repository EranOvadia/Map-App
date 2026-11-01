namespace MapApp.BLL.Models;

/// <summary>A geographic position. Order follows GeoJSON: longitude first.</summary>
public readonly record struct GeoPoint(double Longitude, double Latitude);
