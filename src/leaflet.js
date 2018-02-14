import 'leaflet/src/map/handler/Map.Drag'
import 'leaflet/src/map/handler/Map.TouchZoom'
import 'leaflet/src/map/handler/Map.DoubleClickZoom.js'
import 'leaflet/src/map/handler/Map.ScrollWheelZoom.js'
import 'leaflet/src/control/Control.Zoom'
import { createMap } from 'leaflet/src/map/Map'
import { tileLayer } from 'leaflet/src/layer/tile/TileLayer'
import { layerGroup } from 'leaflet/src/layer/LayerGroup'
import { marker } from 'leaflet/src/layer/marker/Marker'
import { icon } from 'leaflet/src/layer/marker/Icon'
import { divIcon } from 'leaflet/src/layer/marker/DivIcon'
import { toPoint } from 'leaflet/src/geometry/Point'

export { createMap, tileLayer, layerGroup, marker, icon, divIcon, toPoint }
