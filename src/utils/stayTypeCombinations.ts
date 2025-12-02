import { generateId } from "./formatters";

export interface StayTypeCombination {
    id: string;
    roomTypeId: string;
    adults: number;
    children: number;
    mealPlanId: string;
    viewTypeId: string;
    pricing: Array<{ currency: string; price: number }>;
}

const STORAGE_KEY = "hotel-stay-type-combinations";

/**
 * Initialize sample stay type combinations if none exist in localStorage
 * This provides default data for demonstration purposes
 */
export function initializeSampleStayTypeCombinations(
    roomTypes: Array<{ id: string; name: string }>,
    mealPlans: Array<{ id: string; name: string }>,
    viewTypes: Array<{ id: string; name: string }>
): void {
    try {
        console.log("[StayTypeCombinations] Initializing sample data...");
        console.log("[StayTypeCombinations] Room types:", roomTypes.length);
        console.log("[StayTypeCombinations] Meal plans:", mealPlans.length);
        console.log("[StayTypeCombinations] View types:", viewTypes.length);

        // Check if combinations already exist
        const existing = localStorage.getItem(STORAGE_KEY);
        if (existing) {
            try {
                const parsed = JSON.parse(existing);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    console.log(
                        `[StayTypeCombinations] Found ${parsed.length} existing combinations, skipping initialization`
                    );
                    return;
                }
            } catch (parseError) {
                console.warn(
                    "[StayTypeCombinations] Error parsing existing data, will reinitialize:",
                    parseError
                );
                // Continue to create new data
            }
        }

        // Create sample combinations only if we have the required data
        if (
            !roomTypes ||
            !mealPlans ||
            !viewTypes ||
            roomTypes.length === 0 ||
            mealPlans.length === 0 ||
            viewTypes.length === 0
        ) {
            console.warn(
                "[StayTypeCombinations] Missing required data, skipping initialization"
            );
            return;
        }

        const sampleCombinations: StayTypeCombination[] = [];

        // Create combinations for each room type
        roomTypes.forEach((roomType) => {
            // Get the first meal plan and view type for basic combinations
            const firstMealPlan = mealPlans[0];
            const firstViewType = viewTypes[0];

            // Combination 1: Standard capacity (1 adult, 0 children)
            sampleCombinations.push({
                id: generateId(),
                roomTypeId: roomType.id,
                adults: 1,
                children: 0,
                mealPlanId: firstMealPlan.id,
                viewTypeId: firstViewType.id,
                pricing: [{ currency: "USD", price: 100 }],
            });

            // Combination 2: Double occupancy (2 adults, 0 children)
            sampleCombinations.push({
                id: generateId(),
                roomTypeId: roomType.id,
                adults: 2,
                children: 0,
                mealPlanId: firstMealPlan.id,
                viewTypeId: firstViewType.id,
                pricing: [{ currency: "USD", price: 150 }],
            });

            // Combination 3: Family (2 adults, 1 child) - if we have multiple meal plans
            if (mealPlans.length > 1) {
                sampleCombinations.push({
                    id: generateId(),
                    roomTypeId: roomType.id,
                    adults: 2,
                    children: 1,
                    mealPlanId: mealPlans[1].id,
                    viewTypeId: firstViewType.id,
                    pricing: [{ currency: "USD", price: 180 }],
                });
            }

            // Combination 4: Premium view - if we have multiple view types
            if (viewTypes.length > 1) {
                sampleCombinations.push({
                    id: generateId(),
                    roomTypeId: roomType.id,
                    adults: 2,
                    children: 0,
                    mealPlanId: firstMealPlan.id,
                    viewTypeId: viewTypes[1].id,
                    pricing: [{ currency: "USD", price: 170 }],
                });
            }
        });

        console.log(
            `[StayTypeCombinations] Created ${sampleCombinations.length} sample combinations`
        );

        // Save to localStorage with error handling
        try {
            const jsonString = JSON.stringify(sampleCombinations);
            localStorage.setItem(STORAGE_KEY, jsonString);
            console.log(
                `[StayTypeCombinations] Successfully saved ${sampleCombinations.length} combinations to localStorage`
            );

            // Verify the save worked
            const verification = localStorage.getItem(STORAGE_KEY);
            if (verification) {
                const parsed = JSON.parse(verification);
                console.log(
                    `[StayTypeCombinations] Verification: ${parsed.length} combinations in storage`
                );
            }
        } catch (storageError) {
            console.error(
                "[StayTypeCombinations] Error saving to localStorage:",
                storageError
            );
            throw storageError;
        }
    } catch (error) {
        console.error(
            "[StayTypeCombinations] Error initializing sample stay type combinations:",
            error
        );
    }
}

/**
 * Get stay type combinations from localStorage
 */
export function getStayTypeCombinations(): StayTypeCombination[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
            console.log("[StayTypeCombinations] No data found in localStorage");
            return [];
        }

        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) {
            console.warn(
                "[StayTypeCombinations] Data in localStorage is not an array"
            );
            return [];
        }

        console.log(
            `[StayTypeCombinations] Loaded ${parsed.length} combinations from localStorage`
        );
        return parsed;
    } catch (error) {
        console.error(
            "[StayTypeCombinations] Error loading stay type combinations:",
            error
        );
        return [];
    }
}
