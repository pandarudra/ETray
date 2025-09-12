import { useState, useEffect } from "react";
import { EnvKey, AddEnvKeyInput } from "../types/envTypes";

import { AddEnvKey } from "../components/AddEnvKey";
import toast from "react-hot-toast";
import { EnvKeyList } from "../components/EnvKeyList";

export const Manager = () => {
  const [envKeys, setEnvKeys] = useState<EnvKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved keys on component mount
  useEffect(() => {
    const loadKeys = async () => {
      try {
        const savedKeys = await window.ipcRenderer.loadEnvKeys();
        setEnvKeys(savedKeys || []);
      } catch (error) {
        toast.error("Failed to load environment keys");
      } finally {
        setIsLoading(false);
      }
    };
    loadKeys();
  }, []);

  // Save keys whenever they change
  useEffect(() => {
    if (!isLoading) {
      window.ipcRenderer
        .saveEnvKeys(envKeys)
        .catch(() => toast.error("Failed to save environment keys"));
    }
  }, [envKeys, isLoading]);

  const handleAddKey = (input: AddEnvKeyInput) => {
    const newValue = {
      id: crypto.randomUUID(),
      value: input.value,
      description: input.description,
      createdAt: new Date(),
    };

    setEnvKeys((prev) => {
      // Check if key already exists
      const existingKeyIndex = prev.findIndex((k) => k.name === input.name);

      if (existingKeyIndex >= 0) {
        // Add new value to existing key
        const updatedKeys = [...prev];
        updatedKeys[existingKeyIndex] = {
          ...updatedKeys[existingKeyIndex],
          values: [...updatedKeys[existingKeyIndex].values, newValue],
        };
        return updatedKeys;
      } else {
        // Create new key with first value
        return [
          ...prev,
          {
            name: input.name,
            values: [newValue],
          },
        ];
      }
    });
    toast.success("Environment value added successfully!");
  };

  const handleDeleteValue = (keyName: string, valueId: string) => {
    setEnvKeys((prev) => {
      const updatedKeys = prev
        .map((key) => {
          if (key.name !== keyName) return key;

          const updatedValues = key.values.filter((v) => v.id !== valueId);
          return {
            ...key,
            values: updatedValues,
          };
        })
        .filter((key) => key.values.length > 0); // Remove keys with no values

      return updatedKeys;
    });
    toast.success("Environment value deleted successfully!");
  };

  const handleDeleteKey = (keyName: string) => {
    setEnvKeys((prev) => prev.filter((key) => key.name !== keyName));
    toast.success("Environment key deleted successfully!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-2xl font-bold text-gray-900">ETray</h1>
            <p className="text-sm text-gray-500 mt-1">
              Secure Environment Variable Manager
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Add New Key
            </h2>
            <AddEnvKey
              existingKeys={envKeys.map((k) => k.name)}
              onAdd={handleAddKey}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Environment Keys
            </h2>
            <EnvKeyList
              keys={envKeys}
              onDeleteValue={handleDeleteValue}
              onDeleteKey={handleDeleteKey}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
