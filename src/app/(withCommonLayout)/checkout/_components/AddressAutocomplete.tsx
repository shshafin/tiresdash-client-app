"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Input } from "@heroui/input";

interface AddressComponents {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

interface AddressAutocompleteProps {
    id?: string;
    label?: string;
    value: string;
    onChange: (value: string) => void;
    onAddressSelect?: (address: AddressComponents) => void;
    required?: boolean;
    placeholder?: string;
}

// Declare google types
declare global {
    interface Window {
        google: typeof google;
        initGoogleMapsCallback?: () => void;
    }
}

// Track script loading state globally
let isScriptLoading = false;
let isScriptLoaded = false;
const callbacks: (() => void)[] = [];

const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (isScriptLoaded && window.google?.maps?.places) {
            resolve();
            return;
        }

        if (isScriptLoading) {
            callbacks.push(() => resolve());
            return;
        }

        const existingScript = document.querySelector(
            'script[src*="maps.googleapis.com/maps/api/js"]'
        );
        if (existingScript) {
            if (window.google?.maps?.places) {
                isScriptLoaded = true;
                resolve();
            } else {
                callbacks.push(() => resolve());
            }
            return;
        }

        isScriptLoading = true;

        window.initGoogleMapsCallback = () => {
            isScriptLoaded = true;
            isScriptLoading = false;
            resolve();
            callbacks.forEach((cb) => cb());
            callbacks.length = 0;
        };

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsCallback`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
            isScriptLoading = false;
            reject(new Error("Failed to load Google Maps script"));
        };
        document.head.appendChild(script);
    });
};

export const AddressAutocomplete = ({
    id,
    label,
    value,
    onChange,
    onAddressSelect,
    required = false,
    placeholder = "Start typing your address...",
}: AddressAutocompleteProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [suggestions, setSuggestions] = useState<
        google.maps.places.AutocompletePrediction[]
    >([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const autocompleteServiceRef =
        useRef<google.maps.places.AutocompleteService | null>(null);
    const placesServiceRef = useRef<google.maps.places.PlacesService | null>(
        null
    );

    // Load Google Maps script
    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            console.error("Google Maps API key is not configured");
            return;
        }

        loadGoogleMapsScript(apiKey)
            .then(() => {
                setIsLoaded(true);
                autocompleteServiceRef.current =
                    new google.maps.places.AutocompleteService();
                const dummyDiv = document.createElement("div");
                placesServiceRef.current = new google.maps.places.PlacesService(
                    dummyDiv
                );
            })
            .catch((error) => {
                console.error("Failed to load Google Maps:", error);
            });
    }, []);

    // Handle input change and fetch suggestions
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;
            onChange(inputValue);

            if (!isLoaded || !autocompleteServiceRef.current || inputValue.length < 3) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            autocompleteServiceRef.current.getPlacePredictions(
                {
                    input: inputValue,
                    types: ["address"],
                    componentRestrictions: { country: "us" },
                },
                (predictions, status) => {
                    if (
                        status === google.maps.places.PlacesServiceStatus.OK &&
                        predictions
                    ) {
                        setSuggestions(predictions);
                        setShowSuggestions(true);
                    } else {
                        setSuggestions([]);
                        setShowSuggestions(false);
                    }
                }
            );
        },
        [isLoaded, onChange]
    );

    // Handle suggestion selection
    const handleSuggestionSelect = useCallback(
        (prediction: google.maps.places.AutocompletePrediction) => {
            if (!placesServiceRef.current) return;

            placesServiceRef.current.getDetails(
                {
                    placeId: prediction.place_id,
                    fields: ["address_components", "formatted_address"],
                },
                (place, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                        const addressComponents = parseAddressComponents(
                            place.address_components || []
                        );

                        onChange(addressComponents.street);

                        if (onAddressSelect) {
                            onAddressSelect(addressComponents);
                        }
                    }
                    setSuggestions([]);
                    setShowSuggestions(false);
                }
            );
        },
        [onChange, onAddressSelect]
    );

    // Parse Google address components
    const parseAddressComponents = (
        components: google.maps.GeocoderAddressComponent[]
    ): AddressComponents => {
        const result: AddressComponents = {
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
        };

        let streetNumber = "";
        let route = "";

        components.forEach((component) => {
            const types = component.types;

            if (types.includes("street_number")) {
                streetNumber = component.long_name;
            }
            if (types.includes("route")) {
                route = component.long_name;
            }
            if (types.includes("locality") || types.includes("sublocality")) {
                result.city = component.long_name;
            }
            if (types.includes("administrative_area_level_1")) {
                result.state = component.short_name;
            }
            if (types.includes("postal_code")) {
                result.postalCode = component.long_name;
            }
            if (types.includes("country")) {
                result.country = component.short_name;
            }
        });

        result.street = [streetNumber, route].filter(Boolean).join(" ");

        return result;
    };

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(".address-autocomplete-container")) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="address-autocomplete-container relative">
            {label && (
                <label htmlFor={id} className="text-sm font-medium mb-1 block">
                    {label}
                </label>
            )}
            <Input
                ref={inputRef}
                id={id}
                value={value}
                onChange={handleInputChange}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                required={required}
                placeholder={placeholder}
                autoComplete="off"
            />

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion.place_id}
                            type="button"
                            className="w-full px-4 py-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
                            onClick={() => handleSuggestionSelect(suggestion)}
                        >
                            <div className="font-medium text-gray-900 text-sm">
                                {suggestion.structured_formatting.main_text}
                            </div>
                            <div className="text-gray-500 text-xs mt-0.5">
                                {suggestion.structured_formatting.secondary_text}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddressAutocomplete;
