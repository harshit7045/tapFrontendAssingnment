import React, { useRef, useEffect, useState } from 'react';
import { SearchBox } from '@mapbox/search-js-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Hardcoded danger zones
const dangerZones = [
  { lat: 31.48017, lng: 76.18728, radius: 300 }, // Example: 300m radius
  // Add more zones as needed
];

const MapWithDangerZones = () => {
  const mapToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const [inputValue, setInputValue] = useState('');
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState([76.18727, 31.48016]); // [lng, lat]
  const [nearbyPlaces, setNearbyPlaces] = useState([]);

  // Geolocation watcher
  useEffect(() => {
    let watcher;
    if ('geolocation' in navigator) {
      watcher = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = [pos.coords.longitude, pos.coords.latitude];
          setUserLocation(coords);
        },
        (err) => {
          alert('Location error: ' + err.message);
        },
        { enableHighAccuracy: true }
      );
    }
    return () => {
      if (watcher) navigator.geolocation.clearWatch(watcher);
    };
  }, []);

  // Update map center and marker when userLocation changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(userLocation);
      if (!markerRef.current) {
        markerRef.current = new mapboxgl.Marker()
          .setLngLat(userLocation)
          .addTo(mapInstanceRef.current);
      } else {
        markerRef.current.setLngLat(userLocation);
      }
    }
  }, [userLocation]);

  // Map initialization and danger circles
  useEffect(() => {
    if (!mapToken) return;
    mapboxgl.accessToken = mapToken;
    mapInstanceRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: userLocation,
      zoom: 15,
      style: 'mapbox://styles/mapbox/streets-v12',
    });
    mapInstanceRef.current.on('load', () => {
      setMapLoaded(true);
      // Add danger zone circles as geojson
      const geojson = {
        type: "FeatureCollection",
        features: dangerZones.map(zone => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [zone.lng, zone.lat]
          },
          properties: {
            radius: zone.radius
          }
        }))
      };
      mapInstanceRef.current.addSource('danger-zones', {
        type: 'geojson',
        data: geojson
      });
      mapInstanceRef.current.addLayer({
        id: 'danger-zones-circle',
        type: 'circle',
        source: 'danger-zones',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            12, ['/', ['get', 'radius'], 12.5],
            16, ['/', ['get', 'radius'], 3]
          ],
          'circle-color': 'rgba(255,0,0,0.35)',
          'circle-stroke-color': 'rgba(255,0,0,0.7)',
          'circle-stroke-width': 2
        }
      });
    });
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [mapToken]);

  return (
    <div style={{ position: 'relative', height: '400px', width: '100%', margin: 0 }}>
      {mapLoaded && (
        <div style={{ position: 'absolute', top: 10, left: 10, width: '90%', zIndex: 2 }}>
          <SearchBox
            accessToken={mapToken}
            map={mapInstanceRef.current}
            mapboxgl={mapboxgl}
            value={inputValue}
            onChange={(d) => setInputValue(d?.value || '')}
            onRetrieve={(results) => {
              if (results && Array.isArray(results.features)) {
                setNearbyPlaces(results.features);
              } else {
                setNearbyPlaces([]);
              }
            }}
            marker
          />
        </div>
      )}
      <div
        ref={mapContainerRef}
        style={{ height: '400px', width: '100%' }}
      />
      {nearbyPlaces.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          background: 'rgba(255,255,255,0.97)',
          borderRadius: 8,
          padding: 12,
          maxHeight: 180,
          overflowY: 'auto',
          minWidth: 240,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 3,
        }}>
          <strong>Nearby Places:</strong>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {nearbyPlaces.map((place, idx) => (
              <li key={place.id || idx} style={{ marginBottom: 6 }}>
                <span style={{ fontWeight: 500 }}>{place.text}</span>
                {place.place_name && (
                  <span style={{ color: '#888', fontSize: 12, marginLeft: 4 }}>
                    ({place.place_name})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MapWithDangerZones;