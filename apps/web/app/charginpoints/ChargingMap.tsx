'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import { geocoders } from 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

import {
    useEffect,
    useMemo,
    useRef,
} from 'react';

interface RoutesFoundEvent extends L.LeafletEvent {
    routes: Array<{
        coordinates: L.LatLng[];
    }>;
}

interface NlrStation {
    latitude: number;
    longitude: number;
    station_name?: string;
    station_phone?: string;
    ev_network_web?: string;
    street_address?: string;
    city?: string;
    state?: string;
    zip?: string;
    ev_connector_types?: string[];
}

interface NlrResponse {
    fuel_stations?: NlrStation[];
}

type RoutingControl =
    ReturnType<typeof L.Routing.control>;

const ChargingMap = () => {
    const mapRef = useRef<L.Map | null>(null);

    const routeRef =
        useRef<RoutingControl | null>(null);

    const stationLayerRef =
        useRef<L.LayerGroup | null>(null);

    const routeCoordinatesRef =
        useRef<L.LatLng[]>([]);

    const greenIcon = useMemo(
        () =>
            new L.Icon({
                iconUrl:
                    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl:
                    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
            }),
        []
    );

    useEffect(() => {
        if (mapRef.current) {
            return;
        }

        const map = L.map('charging-map').setView(
            [40.68255, -74.23647],
            13
        );

        mapRef.current = map;

        L.tileLayer(
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                maxZoom: 19,
                attribution: '© OpenStreetMap',
            }
        ).addTo(map);

        const routeControl = L.Routing.control({
            waypoints: [
                L.latLng(
                    40.6780173,
                    -74.2339287
                ),
                L.latLng(
                    40.7430122,
                    -74.1686127
                ),
            ],
            geocoder: geocoders.nominatim(),
        }).addTo(map);

        routeRef.current = routeControl;

        routeControl.on(
            'routesfound',
            (event: L.LeafletEvent) => {
                const routesFoundEvent =
                    event as RoutesFoundEvent;

                const coordinates =
                    routesFoundEvent.routes[0]
                        ?.coordinates ?? [];

                routeCoordinatesRef.current =
                    coordinates;

                const bounds = L.latLngBounds([]);

                coordinates.forEach(
                    (coordinate) => {
                        bounds.extend(coordinate);
                    }
                );

                if (bounds.isValid()) {
                    map.fitBounds(bounds);
                }
            }
        );

        return () => {
            routeControl.remove();
            map.remove();

            mapRef.current = null;
            routeRef.current = null;
            stationLayerRef.current = null;
            routeCoordinatesRef.current = [];
        };
    }, []);

    const buildRouteLineString = (): string => {
        const coordinates =
            routeCoordinatesRef.current;

        if (coordinates.length === 0) {
            throw new Error(
                'The route has not finished loading.'
            );
        }

        const samplingInterval =
            coordinates.length > 10000
                ? 1000
                : coordinates.length > 5000
                  ? 500
                  : coordinates.length > 2500
                    ? 250
                    : 100;

        return coordinates
            .filter(
                (_, index) =>
                    (index + 1) %
                        samplingInterval ===
                        0 ||
                    index ===
                        coordinates.length - 1
            )
            .map(
                (coordinate) =>
                    `${coordinate.lng} ${coordinate.lat}`
            )
            .join(',');
    };

    const addEvWaypoint = (
        latitude: number,
        longitude: number
    ): void => {
        const routeControl = routeRef.current;

        if (!routeControl) {
            return;
        }

        const waypoints =
            routeControl.getWaypoints();

        const newWaypoint =
            L.Routing.waypoint(
                L.latLng(
                    latitude,
                    longitude
                ),
                'EV charging station'
            );

        waypoints.splice(
            waypoints.length - 1,
            0,
            newWaypoint
        );

        routeControl.setWaypoints(waypoints);
    };

    const createStationPopup = (
        station: NlrStation
    ): HTMLDivElement => {
        const container =
            document.createElement('div');

        const title =
            document.createElement('strong');

        title.textContent =
            station.station_name ??
            'EV charging station';

        container.appendChild(title);

        if (station.station_phone) {
            const phone =
                document.createElement('p');

            phone.textContent =
                station.station_phone;

            container.appendChild(phone);
        }

        if (station.ev_network_web) {
            const link =
                document.createElement('a');

            link.href =
                station.ev_network_web;

            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent =
                station.ev_network_web;

            container.appendChild(link);
        }

        const address =
            document.createElement('p');

        address.textContent = [
            station.street_address,
            station.city,
            station.state,
            station.zip,
        ]
            .filter(Boolean)
            .join(', ');

        container.appendChild(address);

        if (
            station.ev_connector_types
                ?.length
        ) {
            const connectors =
                document.createElement('p');

            connectors.textContent =
                `Connector types: ${station.ev_connector_types.join(', ')}`;

            container.appendChild(
                connectors
            );
        }

        const button =
            document.createElement('button');

        button.type = 'button';
        button.textContent = 'Add to Route';

        button.addEventListener(
            'click',
            () => {
                addEvWaypoint(
                    station.latitude,
                    station.longitude
                );
            }
        );

        container.appendChild(button);

        return container;
    };

    const getChargingStations =
        async (): Promise<void> => {
            const map = mapRef.current;

            const apiKey =
                process.env
                    .NEXT_PUBLIC_NREL_API_KEY;

            if (!map) {
                alert(
                    'The map has not finished loading.'
                );
                return;
            }

            if (!apiKey) {
                alert(
                    'The charging-station API key is not configured.'
                );
                return;
            }

            try {
                const routeLineString =
                    buildRouteLineString();

                const parameters =
                    new URLSearchParams({
                        api_key: apiKey,
                        distance: '0.5',
                        fuel_type: 'ELEC',
                        route:
                            `LINESTRING(${routeLineString})`,
                    });

                const response = await fetch(
                    `https://developer.nlr.gov/api/alt-fuel-stations/v1/nearby-route.json?${parameters.toString()}`
                );

                if (!response.ok) {
                    throw new Error(
                        `Charging-station request failed: ${response.status}`
                    );
                }

                const result =
                    (await response.json()) as NlrResponse;

                if (
                    stationLayerRef.current
                ) {
                    map.removeLayer(
                        stationLayerRef.current
                    );
                }

                const stationLayer =
                    L.layerGroup();

                const stations =
                    result.fuel_stations ?? [];

                stations.forEach(
                    (station) => {
                        const marker =
                            L.marker(
                                [
                                    station.latitude,
                                    station.longitude,
                                ],
                                {
                                    icon: greenIcon,
                                }
                            );

                        marker.bindPopup(
                            createStationPopup(
                                station
                            )
                        );

                        stationLayer.addLayer(
                            marker
                        );
                    }
                );

                stationLayer.addTo(map);

                stationLayerRef.current =
                    stationLayer;
            } catch (error: unknown) {
                const message =
                    error instanceof Error
                        ? error.message
                        : 'An unknown map error occurred.';

                console.error(message);
                alert(message);
            }
        };

    return (
        <main className="pb-10">
            <div className="h-[60vh] w-full px-6 pt-16 md:px-10">
                <div
                    id="charging-map"
                    className="h-full overflow-hidden rounded-md"
                />
            </div>

            <button
                type="button"
                onClick={() =>
                    void getChargingStations()
                }
                className="square-button ml-6 mt-4 p-3 md:ml-10"
            >
                Find Nearby EVs
            </button>
        </main>
    );
};

export default ChargingMap;