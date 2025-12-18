import React, { useState, useEffect, useRef } from 'react';
import { MapPin, X, Check, Search, Loader2 } from 'lucide-react';
import { Button } from './Button';

interface LocationPickerProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
}

declare global {
  interface Window {
    L: any;
  }
}

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange, placeholder = "Select location..." }) => {
  // Modal State
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [tempAddress, setTempAddress] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  
  // Map Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Main Input Suggestions State
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Map Internal Search State
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [mapSuggestions, setMapSuggestions] = useState<NominatimResult[]>([]);
  const [isMapSearching, setIsMapSearching] = useState(false);
  const mapSearchTimeoutRef = useRef<any>(null);

  // --- Main Input Logic ---

  useEffect(() => {
    // Close suggestions when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPlaces = async (query: string, setter: (results: NominatimResult[]) => void, loader: (l: boolean) => void) => {
    if (!query || query.length < 3) {
      setter([]);
      return;
    }
    loader(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'CafeKothay/1.0 (https://cafe-kothay.com; contact@cafe-kothay.com)'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setter(data || []);
    } catch (error) {
      console.error("Search failed:", error);
      setter([]);
    } finally {
      loader(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    onChange(newVal);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    searchTimeoutRef.current = setTimeout(() => {
      fetchPlaces(newVal, setSuggestions, setIsSearching);
    }, 800);
  };

  const handleSelectSuggestion = (suggestion: NominatimResult) => {
    onChange(suggestion.display_name);
    setSuggestions([]);
  };

  // --- Map Logic ---

  useEffect(() => {
    if (isMapOpen && mapContainerRef.current && !mapInstanceRef.current) {
      if (!window.L) {
        console.error("Leaflet not loaded");
        return;
      }

      // Default to New York
      const defaultPos = [40.7128, -74.0060];

      // Initialize Leaflet Map
      const map = window.L.map(mapContainerRef.current).setView(defaultPos, 13);

      // Add CartoDB Dark Matter Tiles
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      // Custom Icon
      const customIcon = window.L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      const marker = window.L.marker(defaultPos, { 
          draggable: true,
          icon: customIcon 
      }).addTo(map);

      // Helper to move map
      const updateMapPosition = (lat: number, lng: number) => {
         const pos = [lat, lng];
         map.setView(pos, 16);
         marker.setLatLng(pos);
         reverseGeocode(lat, lng);
      };

      // Try geolocation if value is empty, otherwise try to search value
      if (!value && navigator.geolocation) {
        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            updateMapPosition(position.coords.latitude, position.coords.longitude);
            setLoadingLocation(false);
          },
          () => setLoadingLocation(false)
        );
      } else if (value) {
        // Try to geocode current value to set initial map position
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
        
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=1`, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'CafeKothay/1.0 (https://cafe-kothay.com; contact@cafe-kothay.com)'
          }
        })
          .then(r => {
            clearTimeout(timeoutId);
            if (!r.ok) {
              throw new Error(`HTTP error! status: r.status}`);
            }
            return r.json();
          })
          .then(d => {
            if (d && d[0]) {
               updateMapPosition(parseFloat(d[0].lat), parseFloat(d[0].lon));
            }
          })
          .catch(err => {
            clearTimeout(timeoutId);
            console.error("Initial geocoding failed:", err);
          });
      }

      // Events
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        reverseGeocode(lat, lng);
      });

      marker.on('dragend', (e: any) => {
        const { lat, lng } = marker.getLatLng();
        reverseGeocode(lat, lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }

    // Cleanup
    if (!isMapOpen && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        setMapSearchQuery('');
        setMapSuggestions([]);
    }
  }, [isMapOpen]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
        setTempAddress("Fetching address...");
        
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'CafeKothay/1.0 (https://cafe-kothay.com; contact@cafe-kothay.com)'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.display_name) {
             // Simplify address
            const parts = data.display_name.split(',');
            // Heuristic: Take first 2 parts (Street, City) usually, or just full if needed
            const simplified = parts.slice(0, 3).join(',').trim();
            setTempAddress(simplified);
        } else {
            setTempAddress("Location selected");
        }
    } catch (err) {
        if (err.name === 'AbortError') {
            setTempAddress("Request timeout - try again");
        } else {
            setTempAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
    }
  };

  const handleMapSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setMapSearchQuery(q);

    if (mapSearchTimeoutRef.current) clearTimeout(mapSearchTimeoutRef.current);
    
    mapSearchTimeoutRef.current = setTimeout(() => {
      fetchPlaces(q, setMapSuggestions, setIsMapSearching);
    }, 800);
  };

  const handleSelectMapSuggestion = (suggestion: NominatimResult) => {
      if (mapInstanceRef.current && markerRef.current) {
          const lat = parseFloat(suggestion.lat);
          const lon = parseFloat(suggestion.lon);
          mapInstanceRef.current.setView([lat, lon], 16);
          markerRef.current.setLatLng([lat, lon]);
          
          setTempAddress(suggestion.display_name);
          setMapSearchQuery('');
          setMapSuggestions([]);
      }
  };

  const handleConfirm = () => {
    if (tempAddress) onChange(tempAddress);
    setIsMapOpen(false);
  };

  return (
    <>
      <div className="relative group" ref={wrapperRef}>
        <div className="relative">
            <input 
                type="text" 
                value={value} 
                onChange={handleInputChange}
                placeholder={placeholder}
                className="w-full bg-[#15171B] border border-white/10 rounded-lg p-3 pr-10 text-sm text-white focus:outline-none focus:border-[#5E6AD2]/50 transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {isSearching && <Loader2 size={14} className="animate-spin text-[#555]" />}
                <button 
                    type="button"
                    onClick={() => setIsMapOpen(true)}
                    className="text-[#555] hover:text-[#5E6AD2] transition-colors"
                    title="Open Map"
                >
                    <MapPin size={16} />
                </button>
            </div>
        </div>
        
        {/* Main Input Suggestions Dropdown */}
        {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1A1D21] border border-white/10 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                {suggestions.map((place) => (
                    <button
                        key={place.place_id}
                        type="button"
                        onClick={() => handleSelectSuggestion(place)}
                        className="w-full text-left px-4 py-3 text-sm text-[#E0E0E0] hover:bg-white/5 border-b border-white/5 last:border-0 flex items-start gap-2"
                    >
                        <MapPin size={14} className="mt-0.5 text-[#5E6AD2] shrink-0" />
                        <span className="line-clamp-2">{place.display_name}</span>
                    </button>
                ))}
            </div>
        )}
      </div>

      {isMapOpen && (
        <div className="fixed inset-0 z-[100] bg-[#08090A] flex flex-col animate-in fade-in duration-200">
            {/* Header */}
            <div className="p-4 bg-[#15171B] border-b border-white/10 flex items-center gap-4 shrink-0 z-20 shadow-md">
                <div className="flex-1 min-w-0">
                    <h3 className="text-white text-base font-medium">Select Location</h3>
                    <p className="text-[#8A8F98] text-xs mt-0.5 truncate">
                        {loadingLocation ? "Locating you..." : (tempAddress || "Tap map or search")}
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button variant="secondary" onClick={() => setIsMapOpen(false)} className="!px-0 !w-9 !h-9 flex items-center justify-center rounded-lg">
                         <X size={18} />
                    </Button>
                    <Button onClick={handleConfirm} disabled={!tempAddress} className="!px-4 !h-9 flex items-center gap-2">
                        <span className="hidden sm:inline text-sm">Confirm</span>
                        <Check size={16} />
                    </Button>
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative w-full h-full bg-[#08090A]">
                {/* Map Search Overlay */}
                <div className="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-[400]">
                    <div className="relative shadow-2xl">
                        <input 
                            type="text" 
                            value={mapSearchQuery}
                            onChange={handleMapSearch}
                            placeholder="Search places in map..."
                            className="w-full bg-[#1A1D21]/90 backdrop-blur-md border border-white/20 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#5E6AD2] transition-all placeholder:text-[#555]"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]">
                            {isMapSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                        </div>
                    </div>
                    
                    {/* Map Suggestions */}
                    {mapSuggestions.length > 0 && (
                        <div className="mt-2 bg-[#1A1D21]/90 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                            {mapSuggestions.map((place) => (
                                <button
                                    key={place.place_id}
                                    type="button"
                                    onClick={() => handleSelectMapSuggestion(place)}
                                    className="w-full text-left px-4 py-3 text-sm text-[#E0E0E0] hover:bg-white/10 border-b border-white/5 last:border-0 flex items-start gap-2"
                                >
                                    <MapPin size={14} className="mt-0.5 text-[#5E6AD2] shrink-0" />
                                    <span className="line-clamp-2">{place.display_name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div ref={mapContainerRef} className="w-full h-full z-0" />
            </div>
        </div>
      )}
    </>
  );
};