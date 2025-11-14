"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const availableColors = ['Gold', 'Red', 'Black', 'Green', 'Blue', 'White', 'Orange'];

interface ProductFiltersProps {
    filters: { colors: string[]; priceRange: [number, number] };
    setFilters: React.Dispatch<React.SetStateAction<{ colors: string[]; priceRange: [number, number] }>>;
}

export function ProductFilters({ filters, setFilters }: ProductFiltersProps) {

    const handleColorChange = (color: string) => {
        setFilters(prev => {
            const newColors = prev.colors.includes(color)
                ? prev.colors.filter(c => c !== color)
                : [...prev.colors, color];
            return { ...prev, colors: newColors };
        });
    };

    const handlePriceChange = (value: number[]) => {
        setFilters(prev => ({ ...prev, priceRange: [value[0], value[1]] as [number, number] }));
    };

    return (
        <Card className="sticky top-20">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="font-semibold mb-4">Color</h4>
                    <div className="space-y-2">
                        {availableColors.map(color => (
                            <div key={color} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`color-${color}`}
                                    checked={filters.colors.includes(color)}
                                    onCheckedChange={() => handleColorChange(color)}
                                />
                                <Label htmlFor={`color-${color}`}>{color}</Label>
                            </div>
                        ))}
                    </div>
                </div>
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
            </CardContent>
        </Card>
    );
}
