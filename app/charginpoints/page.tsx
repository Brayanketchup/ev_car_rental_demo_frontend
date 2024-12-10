

'use client'


import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import 'leaflet-routing-machine';
import { Banner, ContactForm, ContactInfo, Navbar } from '@/components'
import { useEffect, useRef } from "react";
import "leaflet-control-geocoder";


const MapPage = () => {
    let map;
    let route;
    let ev_location_layer;
    var greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });


    var blueIcon = new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });


    useEffect(() => {
        map = L.map('map').setView([40.682550, -74.236470], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);


        route = L.Routing.control({
            waypoints: [
                L.latLng(40.6780173, -74.2339287),
                L.latLng(40.7430122, -74.1686127)
            ],
            geocoder: L.Control.Geocoder.nominatim(),
            createMarker: function (i, waypoint, n) {
                const markerIcon = i === 0 || i === n - 1 ? blueIcon : blueIcon; // Custom icon for start and end points
                return L.marker(waypoint.latLng, {
                    icon: markerIcon
                });
            }
        }).addTo(map);

        route.on('routesfound', function (e) {
            const routes = e.routes;
            const bounds = L.latLngBounds();
            routes[0].coordinates.forEach(coord => bounds.extend(coord));
            map.fitBounds(bounds);
        });

        return () => {
            map.remove();
        };
    }, []);

    async function getNRELData() {
        const nrel = 'qGHw8RBLmux9ttfgTiVFmzeN88uVpacKEkPf9O5k';
        var tempRoute = findEV();
        var params = `api_key=${nrel}&distance=0.5&fuel_type=ELEC&route=LINESTRING(${tempRoute})`;
        var url = `https://developer.nrel.gov/api/alt-fuel-stations/v1/nearby-route.json?${params}`;
        try {
            const response = await fetch(url, { method: 'POST' });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            if (ev_location_layer) {
                map.removeLayer(ev_location_layer);
            }

            const json = await response.json();
            var stations = json["fuel_stations"];
            var temp_markers = L.layerGroup();
            stations.forEach(e => {
                var temp_marker = L.marker([e['latitude'], e['longitude']], {
                    icon: greenIcon
                });

                temp_marker.bindPopup(`
                    <b>${e['station_name']}</b>
                    <br>${e['station_phone']} (<a target="_blank" rel="noopener noreferrer" href="${e['ev_network_web']}">${e['ev_network_web']}</a>)
                    <br>
                    <br>${e['street_address']}, ${e['city']} ${e['state']}, ${e['zip']}
                    <br>
                    <br>Connector Types: ${e['ev_connector_types']}
                    <br><button onclick="addEVWaypoint(${e['latitude']}, ${e['longitude']})">Add to Route</button>
                    

                `).openPopup();

                temp_markers.addLayer(temp_marker);
            })

            temp_markers.addTo(map);
            ev_location_layer = temp_markers;
        } catch (error) {
            console.error(error.message);
        }
    }

    function findEV() {
        var lineString = ''
        var selected_route = route._selectedRoute.coordinates;

        selected_route.forEach((e, i) => {
            let div = selected_route.length > 10000
                ? 1000
                : selected_route.length > 5000
                    ? 500
                    : selected_route.length > 2500
                        ? 250
                        : 100;

            if ((i + 1) % div === 0 || i === selected_route.length - 1) {
                lineString = lineString + e['lng'] + "+" + e['lat'] + ","
            }
        });
        // console.log(lineString);
        return lineString.slice(0, -1);
    }

    function resetRoute() {
        const waypoints = route.getWaypoints();
        route.setWaypoints([waypoints[0], waypoints[waypoints.length - 1]]);
        if (ev_location_layer) {
            getNRELData();
        }
    }

    function addEVWaypoint(lat, long) {
        console.log('lat', lat, 'long', long)
        const waypoints = route.getWaypoints();
        const newWaypoint = L.latLng(lat, long);
        waypoints.splice(waypoints.length - 1, 0, newWaypoint);
        route.setWaypoints(waypoints);
    }

    useEffect(() => {
        const handleAddWaypoint = (event) => {
            const { lat, lng } = event.detail;
            const route = routeRef.current;
            const waypoints = route.getWaypoints();
            const newWaypoint = L.latLng(lat, lng);
            waypoints.splice(waypoints.length - 1, 0, newWaypoint);
            route.setWaypoints(waypoints);
        };

        document.addEventListener('add-waypoint', handleAddWaypoint);
        return () => {
            document.removeEventListener('add-waypoint', handleAddWaypoint);
        };
    }, []);


    return (
        <div className=''>


            <Navbar />
            

                <div className='w-[80vw] h-[60vh] pl-10 pt-16 rounded-md overflow-hidden pb-3'>
                    <div id="map" style={{ height: '100%' }}></div>
                </div>



            <button onClick={getNRELData} className='square-button p-3 ml-10'>Find Nearby EVs</button>
            
        </div>
    );
};

export default MapPage;

