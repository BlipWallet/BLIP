"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useBluetooth } from "@/hooks/use-bluetooth";
import Image from "next/image";

// Sample users for simulation
const MOCK_USERS = [
  {
    id: "device-001",
    name: "John's iPhone",
    distance: "2m",
    profileImage: "/images/profiles/profile1.png",
  },
  {
    id: "device-002",
    name: "Sarah's Galaxy",
    distance: "5m",
    profileImage: "/images/profiles/profile1.png",
  },
  {
    id: "device-003",
    name: "Mike's MacBook",
    distance: "8m",
    profileImage: "/images/profiles/profile1.png",
  },
  {
    id: "device-004",
    name: "Emma's iPad",
    distance: "10m",
    profileImage: "/images/profiles/profile1.png",
  },
  {
    id: "device-005",
    name: "David's Pixel",
    distance: "15m",
    profileImage: "/images/profiles/profile1.png",
  },
];

export default function BluetoothSearchPage() {
  const {
    devices,
    isScanning,
    error,
    isBluetoothSupported,
    startScan,
    connectToDevice,
  } = useBluetooth();

  // State for simulation mode
  const [useSimulation, setUseSimulation] = useState(false);
  const [simulatedUsers, setSimulatedUsers] = useState<typeof MOCK_USERS>([]);
  const [isSimulationScanning, setIsSimulationScanning] = useState(false);

  // Start scanning in simulation mode
  const startSimulationScan = () => {
    setIsSimulationScanning(true);

    // Simulate scanning delay
    setTimeout(() => {
      setSimulatedUsers(MOCK_USERS);
      setIsSimulationScanning(false);
    }, 2000);
  };

  // Handle scan button click based on mode
  const handleScanClick = () => {
    if (useSimulation) {
      startSimulationScan();
    } else {
      startScan();
    }
  };

  // Determine if scanning is in progress
  const scanning = useSimulation ? isSimulationScanning : isScanning;

  // Get the list of devices/users to display
  const deviceList = useSimulation ? simulatedUsers : devices;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Nearby Users</h1>

      {/* Simulation mode toggle */}
      <div className="mb-4 flex items-center">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={useSimulation}
            onChange={() => setUseSimulation(!useSimulation)}
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-700">
            {useSimulation ? "Simulation Mode" : "Real Bluetooth Mode"}
          </span>
        </label>
      </div>

      {!isBluetoothSupported && !useSimulation ? (
        <div className="bg-red-50 p-4 rounded-md text-red-600 mb-4">
          Bluetooth is not supported by your browser. Please try using a
          different browser or switch to simulation mode.
        </div>
      ) : (
        <>
          <div className="mb-6 text-center">
            <Button
              onClick={handleScanClick}
              disabled={scanning}
              className="w-full md:w-auto"
            >
              {scanning ? "Scanning..." : "Scan for Nearby Users"}
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              {useSimulation
                ? "This will simulate finding nearby users"
                : "This will scan for nearby Bluetooth devices"}
            </p>
          </div>

          {error && !useSimulation && (
            <div className="bg-red-50 p-4 rounded-md text-red-600 mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Discovered Users</h2>

            {deviceList.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {scanning
                  ? "Scanning for users..."
                  : "No users found. Click the button above to start scanning."}
              </p>
            ) : (
              <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
                {deviceList.map((device) => (
                  <li key={device.id} className="p-4 bg-white hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {useSimulation && "profileImage" in device && (
                          <div className="flex-shrink-0 mr-3">
                            <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 relative">
                              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                {/* Fallback if image fails to load */}
                                {device.name.charAt(0)}
                              </div>
                              <Image
                                src={device.profileImage}
                                alt={`${device.name}'s profile`}
                                width={48}
                                height={48}
                                className="object-cover z-10 relative"
                                onError={(e) => {
                                  // Hide image on error, showing fallback
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            </div>
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium">{device.name}</h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="truncate mr-2">{device.id}</span>
                            {"distance" in device && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                {device.distance}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() =>
                          useSimulation
                            ? alert(`Connecting to ${device.name}...`)
                            : connectToDevice(device.id)
                        }
                      >
                        Connect
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
