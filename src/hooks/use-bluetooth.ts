"use client";

import { useState, useEffect, useCallback } from "react";

// Define Bluetooth types
interface BluetoothDevice {
  id: string;
  name: string | null;
  device: any; // The actual Web Bluetooth device object
}

// Extend Navigator interface for TypeScript
declare global {
  interface Navigator {
    bluetooth?: {
      requestDevice(options: {
        acceptAllDevices?: boolean;
        filters?: Array<{ namePrefix?: string; services?: string[] }>;
        optionalServices?: string[];
      }): Promise<any>;
    };
  }
}

export function useBluetooth() {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBluetoothSupported, setIsBluetoothSupported] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(
    null
  );

  // Check if Bluetooth is supported
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsBluetoothSupported(!!navigator.bluetooth);
      if (!navigator.bluetooth) {
        setError("Bluetooth is not supported by this browser");
      }
    }
  }, []);

  // Start scanning for devices
  const startScan = useCallback(async () => {
    if (!navigator.bluetooth) {
      setError("Bluetooth is not supported by this browser");
      return;
    }

    setError(null);
    setIsScanning(true);

    try {
      // Request device with all available devices
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [], // You can specify services you're interested in
      });

      // Add the discovered device to the list
      const newDevice = {
        id: device.id,
        name: device.name || "Unknown Device",
        device: device,
      };

      setDevices((prevDevices) => {
        // Check if device already exists in the list
        if (!prevDevices.some((d) => d.id === newDevice.id)) {
          return [...prevDevices, newDevice];
        }
        return prevDevices;
      });
    } catch (err) {
      console.error("Bluetooth scan error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to scan for devices");
      }
    } finally {
      setIsScanning(false);
    }
  }, []);

  // Connect to a specific device
  const connectToDevice = useCallback(
    async (deviceId: string) => {
      const device = devices.find((d) => d.id === deviceId);
      if (!device) {
        setError("Device not found");
        return;
      }

      setSelectedDevice(device);

      try {
        // Here you would implement the actual connection logic
        // For example:
        // const server = await device.device.gatt.connect();
        // const service = await server.getPrimaryService('specific-service-uuid');
        // etc.

        console.log(`Connected to device: ${device.name}`);
        return true;
      } catch (err) {
        console.error("Connection error:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to connect to device");
        }
        return false;
      }
    },
    [devices]
  );

  // Disconnect from currently connected device
  const disconnect = useCallback(() => {
    if (selectedDevice) {
      // Implement disconnect logic
      // For example: selectedDevice.device.gatt.disconnect();

      console.log(`Disconnected from device: ${selectedDevice.name}`);
      setSelectedDevice(null);
      return true;
    }
    return false;
  }, [selectedDevice]);

  // Clear the device list
  const clearDevices = useCallback(() => {
    setDevices([]);
  }, []);

  return {
    devices,
    isScanning,
    error,
    isBluetoothSupported,
    selectedDevice,
    startScan,
    connectToDevice,
    disconnect,
    clearDevices,
  };
}
