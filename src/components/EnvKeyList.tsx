import { useState } from "react";
import { EnvKey } from "../types/envTypes";
import {
  FiEye,
  FiEyeOff,
  FiTrash2,
  FiCopy,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import toast from "react-hot-toast";

interface EnvKeyListProps {
  keys: EnvKey[];
  onDeleteValue: (keyName: string, valueId: string) => void;
  onDeleteKey: (keyName: string) => void;
}

export const EnvKeyList = ({
  keys,
  onDeleteValue,
  onDeleteKey,
}: EnvKeyListProps) => {
  const [visibleValues, setVisibleValues] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  const toggleVisibility = (keyName: string, valueId: string) => {
    const key = `${keyName}-${valueId}`;
    setVisibleValues((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleExpand = (keyName: string) => {
    setExpandedKeys((prev) => ({
      ...prev,
      [keyName]: !prev[keyName],
    }));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  if (keys.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No environment keys added yet
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {keys.map((key) => (
        <div
          key={key.name}
          className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleExpand(key.name)}
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  {expandedKeys[key.name] ? (
                    <FiChevronUp size={18} />
                  ) : (
                    <FiChevronDown size={18} />
                  )}
                </button>
                <h3 className="font-medium text-gray-900">{key.name}</h3>
                <span className="text-sm text-gray-500">
                  ({key.values.length}{" "}
                  {key.values.length === 1 ? "value" : "values"})
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => onDeleteKey(key.name)}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                title="Delete key and all values"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>

          {expandedKeys[key.name] && (
            <div className="mt-4 pl-8 space-y-3">
              {key.values.map((value) => (
                <div key={value.id} className="border-l-2 border-gray-200 pl-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {value.description && (
                        <p className="text-sm text-gray-500 mb-1">
                          {value.description}
                        </p>
                      )}
                      <div className="font-mono text-sm bg-gray-50 p-2 rounded flex items-center justify-between">
                        <span className="flex-1">
                          {visibleValues[`${key.name}-${value.id}`]
                            ? value.value
                            : "••••••••"}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(value.value)}
                            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                            title="Copy value"
                          >
                            <FiCopy size={16} />
                          </button>
                          <button
                            onClick={() => toggleVisibility(key.name, value.id)}
                            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                            title={
                              visibleValues[`${key.name}-${value.id}`]
                                ? "Hide value"
                                : "Show value"
                            }
                          >
                            {visibleValues[`${key.name}-${value.id}`] ? (
                              <FiEyeOff size={16} />
                            ) : (
                              <FiEye size={16} />
                            )}
                          </button>
                          <button
                            onClick={() => onDeleteValue(key.name, value.id)}
                            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                            title="Delete value"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
