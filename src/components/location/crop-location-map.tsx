'use client'

import { useEffect, useRef } from 'react'
import { MapPin, ShieldAlert, Compass } from 'lucide-react'

// Bangladesh District & Division Coordinates mapping (Lat, Lng)
export const BANGLADESH_COORDS: Record<string, [number, number]> = {
  // Divisions
  'Dhaka': [23.8103, 90.4125],
  'Chattogram': [22.3569, 91.7832],
  'Rajshahi': [24.3636, 88.6241],
  'Khulna': [22.8456, 89.5403],
  'Barishal': [22.7010, 90.3535],
  'Sylhet': [24.8949, 91.8687],
  'Rangpur': [25.7439, 89.2752],
  'Mymensingh': [24.7471, 90.4203],
  // Major Districts
  'Dinajpur': [25.6217, 88.6355],
  'Bogura': [24.8465, 89.3777],
  'Naogaon': [24.8103, 88.9324],
  'Natore': [24.4102, 89.0076],
  'Pabna': [24.0129, 89.2559],
  'Jashore': [23.1664, 89.2081],
  'Kushtia': [23.9013, 89.1205],
  'Cumilla': [23.4682, 91.1788],
  'Cox\'s Bazar': [21.4272, 92.0058],
  'Tangail': [24.2513, 89.9167],
  'Gazipur': [24.0023, 90.4264],
  'Narayanganj': [23.6238, 90.5000],
  'Faridpur': [23.6071, 89.8429],
  'Sunamganj': [25.0658, 91.3950],
  'Moulvibazar': [24.4829, 91.7774],
  'Bhola': [22.6859, 90.6481],
  'Patuakhali': [22.3596, 90.3299],
  'Jamalpur': [24.9375, 89.9378],
  'Sherpur': [25.0205, 90.0153],
  'Kurigram': [25.8054, 89.6362],
  'Thakurgaon': [26.0337, 88.4617],
  'Panchagarh': [26.3411, 88.5542]
}

interface CropLocationMapProps {
  district?: string
  division?: string
  upazila?: string
  title?: string
  height?: string
}

export function CropLocationMap({
  district = 'Dinajpur',
  division = 'Rangpur',
  upazila,
  title = 'Agricultural Origin',
  height = '280px'
}: CropLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined' || !mapContainerRef.current) return

    let isMounted = true

    // Dynamically import Leaflet so it never executes during SSR
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return

      // Clean up previous instance if already created
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }

      // Determine center coords
      const coords: [number, number] =
        BANGLADESH_COORDS[district] ||
        BANGLADESH_COORDS[division] ||
        [23.6850, 90.3563] // Bangladesh default center

      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: coords,
        zoom: district ? 11 : 8,
        scrollWheelZoom: false,
        zoomControl: true,
      })

      mapInstanceRef.current = map

      // OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map)

      // Privacy boundary circle (protecting precise private address)
      L.circle(coords, {
        color: '#15803d',
        fillColor: '#86efac',
        fillOpacity: 0.35,
        radius: 3500 // 3.5 km regional radius
      }).addTo(map)

      // Custom marker icon with HTML
      const harvestIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="background-color: #15803d; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white; font-size: 16px;">
            🌾
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      })

      const locationLabel = upazila ? `${upazila}, ${district}, ${division}` : `${district}, ${division}`

      L.marker(coords, { icon: harvestIcon })
        .addTo(map)
        .bindPopup(`
          <div style="padding: 4px; font-family: sans-serif; font-size: 12px;">
            <strong style="color: #15803d; font-size: 13px;">${title}</strong><br/>
            <span>📍 ${locationLabel}</span><br/>
            <small style="color: #64748b; font-size: 10px;">Regional approximate location (Privacy Protected)</small>
          </div>
        `)
        .openPopup()
    }).catch(err => {
      console.error('Failed to load Leaflet map:', err)
    })

    return () => {
      isMounted = false
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [district, division, upazila, title])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-bold text-slate-700">
          <Compass className="h-4 w-4 text-emerald-600" />
          {upazila ? `${upazila}, ${district}, ${division}` : `${district}, ${division}`}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          <ShieldAlert className="h-3 w-3" />
          General Area (Exact home address private)
        </span>
      </div>

      <div 
        ref={mapContainerRef} 
        style={{ height }}
        className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm z-0" 
      />
    </div>
  )
}
