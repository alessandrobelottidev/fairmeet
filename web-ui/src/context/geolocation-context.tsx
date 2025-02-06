// contexts/GeolocationContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Coordinates = [number, number];

interface GeolocationContextType {
  coordinates: Coordinates;
  error: string | null;
  permissionStatus: PermissionState;
  isTracking: boolean;
  requestPermission: () => Promise<void>;
  startTracking: () => void;
  stopTracking: () => void;
}

const GeolocationContext = createContext<GeolocationContextType | null>(null);

export function GeolocationProvider({ children }: { children: ReactNode }) {
  const [coordinates, setCoordinates] = useState<Coordinates>([
    46.068548, 11.123382,
  ]);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionState>("prompt");
  const [watchId, setWatchId] = useState<number | null>(null);

  const handleSuccess = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    setCoordinates([latitude, longitude]);
    setError(null);
  };

  const handleError = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setError("Location permission denied by user.");
        setPermissionStatus("denied");
        break;
      case error.POSITION_UNAVAILABLE:
        setError("Location information unavailable.");
        break;
      case error.TIMEOUT:
        setError("Location request timed out.");
        break;
      default:
        setError("An unknown error occurred.");
    }
  };

  const requestPermission = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    try {
      // This will trigger the browser's permission popup
      await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
        });
      });

      // If we get here, permission was granted
      setPermissionStatus("granted");
      startTracking();
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        handleError(err);
      } else {
        setError("Failed to get location permission");
      }
    }
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const id = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  // Check initial permission status
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setPermissionStatus(result.state);

        // If permission is already granted, start tracking
        if (result.state === "granted") {
          startTracking();
        }

        // Listen for permission changes
        result.addEventListener("change", () => {
          setPermissionStatus(result.state);
          if (result.state === "granted") {
            startTracking();
          } else if (result.state === "denied") {
            stopTracking();
          }
        });
      });
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return (
    <GeolocationContext.Provider
      value={{
        coordinates,
        error,
        permissionStatus,
        isTracking: watchId !== null,
        requestPermission,
        startTracking,
        stopTracking,
      }}
    >
      {children}
    </GeolocationContext.Provider>
  );
}

export function useGeolocation() {
  const context = useContext(GeolocationContext);
  if (!context) {
    throw new Error("useGeolocation must be used within a GeolocationProvider");
  }
  return context;
}
