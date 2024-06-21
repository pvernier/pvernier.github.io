const select_country = document.getElementById("select_country");

const country = select_country.value;

mapboxgl.accessToken =
  "pk.eyJ1IjoidW5oY3IiLCJhIjoiY2xueDQ3djRjMGl6dTJycW9vbG4zcWhodyJ9.GzR4WHJx3qrCf8H5ijZZSQ";

// async function that fetches the data from the URL
async function fetch_data(iso) {
  const url_extent = `https://gis.unhcr.org/arcgis/rest/services/core_v2/wrl_polbnd_int_15m_a_unhcr/FeatureServer/0/query?where=iso3='${iso}'&returnGeometry=true&outSR=4326&returnExtentOnly=true&f=json`;
  const response = await fetch(url_extent);
  const data = await response.json();
  return data;
}

// call the function asynchronously
fetch_data(country).then((data) => {
  const extentLong = data.extent.xmax - data.extent.xmin;
  const extentLat = data.extent.ymax - data.extent.ymin;
  const margin = 0.02;

  const Xmax = data.extent.xmax + extentLong * margin;
  const Xmin = data.extent.xmin - extentLong * margin;
  const Ymax = data.extent.ymax + extentLat * margin;
  const Ymin = data.extent.ymin - extentLat * margin;

  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/unhcr/ckvl4xy2mj45z15mpkq6w2nv8", // style URL
    bounds: [
      [Xmin, Ymin],
      [Xmax, Ymax],
    ],
  });
  select_country.addEventListener("change", update_map);

  function update_map() {
    const val_country = select_country.value;
    fetch_data(val_country).then((data) => {
      const extentLong = data.extent.xmax - data.extent.xmin;
      const extentLat = data.extent.ymax - data.extent.ymin;
      const margin = 0.01;

      const Xmax = data.extent.xmax + extentLong * margin;
      const Xmin = data.extent.xmin - extentLong * margin;
      const Ymax = data.extent.ymax + extentLat * margin;
      const Ymin = data.extent.ymin - extentLat * margin;
      map.fitBounds([
        [Xmin, Ymin],
        [Xmax, Ymax],
      ]);
    });
  }

  // disable map rotation using right click + drag
  map.dragRotate.disable();

  // disable map rotation using touch rotation gesture
  map.touchZoomRotate.disableRotation();

  // disable zoom and pan
  map.scrollZoom.disable();
  map.dragPan.disable();
});
