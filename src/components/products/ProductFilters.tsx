"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

const availableColors = ['Gold', 'Red', 'Black', 'Green', 'Blue', 'White', 'Orange'];
const availableOccasions = ['Traditional', 'Wedding', 'Festival', 'Naming Ceremony', 'Everyday'];
const availableCategories = ['Stoles & Sashes', 'Full Cloths', 'Accessories', 'Ready-to-Wear'];
const availableAudience = ['Unisex', 'For Men', 'For Women'];

type Filters = {
    colors: string[];
    priceRange: [number, number];
    occasions: string[];
    categories: string[];
    audience: string[];
};

interface ProductFiltersProps {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export function ProductFilters({ filters, setFilters }: ProductFiltersProps) {

    const handleCheckboxChange = (filterType: keyof Filters, value: string) => {
        setFilters(prev => {
            const currentValues = prev[filterType] as string[];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            return { ...prev, [filterType]: newValues };
        });
    };

    const handlePriceChange = (value: number[]) => {
        setFilters(prev => ({ ...prev, priceRange: [value[0], value[1]] as [number, number] }));
    };

    return (
        <Card className="sticky top-20 bg-card/60 backdrop-blur-sm border-white/20">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="font-semibold mb-4">Price Range</h4>
                    <Slider
                        defaultValue={[0, 500]}
                        max={500}
                        step={10}
                        onValueCommit={handlePriceChange}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>${filters.priceRange[0]}</span>
                        <span>${filters.priceRange[1]}</span>
                    </div>
                </div>

                <Separator />
                
                <div>
                    <h4 className="font-semibold mb-4">Category</h4>
                    <div className="space-y-2">
                        {availableCategories.map(category => (
                            <div key={category} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`category-${category}`}
                                    checked={filters.categories.includes(category)}
                                    onCheckedChange={() => handleCheckboxChange('categories', category)}
                                />
                                <Label htmlFor={`category-${category}`}>{category}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                <div>
                    <h4 className="font-semibold mb-4">Audience</h4>
                    <div className="space-y-2">
                        {availableAudience.map(audience => (
                            <div key={audience} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`audience-${audience}`}
                                    checked={filters.audience.includes(audience)}
                                    onCheckedChange={() => handleCheckboxChange('audience', audience)}
                                />
                                <Label htmlFor={`audience-${audience}`}>{audience}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                <div>
                    <h4 className="font-semibold mb-4">Occasion</h4>
                    <div className="space-y-2">
                        {availableOccasions.map(occasion => (
                            <div key={occasion} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`occasion-${occasion}`}
                                    checked={filters.occasions.includes(occasion)}
                                    onCheckedChange={() => handleCheckboxChange('occasions', occasion)}
                                />
                                <Label htmlFor={`occasion-${occasion}`}>{occasion}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                <div>
                    <h4 className="font-semibold mb-4">Color</h4>
                    <div className="space-y-2">
                        {availableColors.map(color => (
                            <div key={color} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`color-${color}`}
                                    checked={filters.colors.includes(color)}
                                    onCheckedChange={() => handleCheckboxChange('colors', color)}
                                />
                                <Label htmlFor={`color-${color}`}>{color}</Label>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
