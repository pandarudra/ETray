import { useState } from "react";
import { AddEnvKeyInput } from "../types/envTypes";

interface AddEnvKeyProps {
  existingKeys: string[];
  onAdd: (input: AddEnvKeyInput) => void;
}

export const AddEnvKey = ({ existingKeys, onAdd }: AddEnvKeyProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState({
    name: "",
    value: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.name || !input.value) return;

    const keyExists = existingKeys.includes(input.name);
    const cleanedName = input.name.trim().toUpperCase();

    // If adding to an existing key, use the exact name
    const keyName = keyExists
      ? existingKeys.find((k) => k.toUpperCase() === cleanedName)!
      : cleanedName;

    onAdd({
      name: keyName,
      value: input.value,
      description: input.description,
    });

    setInput({ name: "", value: "", description: "" });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200"
      >
        + Add New Environment Key
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Key Name
          </label>
          <input
            type="text"
            id="name"
            value={input.name}
            onChange={(e) =>
              setInput((prev) => ({ ...prev, name: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="DATABASE_URL"
            required
          />
        </div>

        <div>
          <label
            htmlFor="value"
            className="block text-sm font-medium text-gray-700"
          >
            Value
          </label>
          <input
            type="text"
            id="value"
            value={input.value}
            onChange={(e) =>
              setInput((prev) => ({ ...prev, value: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="postgresql://user:password@localhost:5432/db"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description (Optional)
          </label>
          <input
            type="text"
            id="description"
            value={input.description}
            onChange={(e) =>
              setInput((prev) => ({ ...prev, description: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Database connection string for development"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Key
          </button>
        </div>
      </form>
    </div>
  );
};
