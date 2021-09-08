export default class LocationAndUnit {
  constructor() {
    this._lat = '52.237049';
    this._lon = '21.017532';
    this._unit = "metric"
    this._city = "Warsaw"
  }
  setLat(lat) {
    this._lat = lat;
  }
  getLat() {
    return this._lat;
  }
  setLon(lon) {
    this._lon = lon;
  }
  getLon() {
    return this._lon;
  }
  setCity(city) {
    this._city = city;
  }
  getCity() {
    return this._city;
  }
  getUnit() {
    return this._unit;
  }
  toggleUnit() {
    this._unit = this._unit === "metric" ? "imperial" : "metric";
  }
  getTempUnit() {
    return this._unit === "metric" ? '°C' : '°F';
  }
  getWindUnit() {
    return this._unit === "metric" ? 'm/s' : 'mph';
  }
}