import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { categories } from "@shared/utils/constants";
import { AGE_REQUIREMENTS } from "@/utils/constants";
import { UserPreferences } from "@/hooks/user/use-update-preferences";

const defaultPreferences: UserPreferences = {
  categoryPreference: [],
  minRating: 0,
  maxRating: 5,
  lat: 27.3289509,
  lng: 88.6073311,
  radiusKm: 10,
  price: 10000,
  ageRequirement: "",
};

export default function PreferencesCard({
  initialPreferences,
  onSave,
  loading = false,
}: {
  initialPreferences?: UserPreferences | null;
  onSave?: (prefs: UserPreferences) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState(initialPreferences || defaultPreferences);

  useEffect(() => {
    if (initialPreferences) setForm(initialPreferences);
  }, [initialPreferences]);

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (catId: string) => {
    setForm((prev: any) => {
      const exists = prev.categoryPreference.includes(catId);
      return {
        ...prev,
        categoryPreference: exists
          ? prev.categoryPreference.filter((c: string) => c !== catId)
          : [...prev.categoryPreference, catId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) await onSave(form);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label>Categories</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={
                    form.categoryPreference &&
                    form.categoryPreference.includes(cat.id)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => handleCategoryToggle(cat.id)}
                >
                  {cat.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minRating">Min Rating</Label>
              <Slider
                min={0}
                max={5}
                step={0.5}
                value={[form.minRating ? form.minRating : 0]}
                onValueChange={([v]) => handleChange("minRating", v)}
              />
              <div className="text-sm mt-1">{form.minRating}</div>
            </div>
            <div>
              <Label htmlFor="maxRating">Max Rating</Label>
              <Slider
                min={0}
                max={5}
                step={0.5}
                value={[form.maxRating ? form.maxRating : 5]}
                onValueChange={([v]) => handleChange("maxRating", v)}
              />
              <div className="text-sm mt-1">{form.maxRating}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                type="number"
                value={form.lat || 23.259933}
                onChange={(e) =>
                  handleChange("lat", parseFloat(e.target.value))
                }
                step="any"
              />
            </div>
            <div>
              <Label htmlFor="lng">Longitude</Label>
              <Input
                id="lng"
                type="number"
                value={form.lng || 77.412613}
                onChange={(e) =>
                  handleChange("lng", parseFloat(e.target.value))
                }
                step="any"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="radiusKm">Radius (km)</Label>
              <Input
                id="radiusKm"
                type="number"
                value={form.radiusKm || 10}
                onChange={(e) =>
                  handleChange("radiusKm", parseInt(e.target.value))
                }
                min={1}
              />
            </div>
            <div>
              <Label htmlFor="price">Max Price (INR)</Label>
              <Input
                id="price"
                type="number"
                value={form.price || 0}
                onChange={(e) =>
                  handleChange("price", parseInt(e.target.value))
                }
                min={0}
              />
            </div>
          </div>

          <div>
            <Label>Age Requirement</Label>
            <RadioGroup
              className="flex gap-4 mt-2"
              value={form.ageRequirement || ""}
              onValueChange={(value) => handleChange("ageRequirement", value)}
              name="ageRequirement"
            >
              {AGE_REQUIREMENTS.map((age) => (
                <label
                  key={age.value}
                  htmlFor={`age-${age.value}`}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <RadioGroupItem value={age.value} id={`age-${age.value}`} />
                  <span>{age.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-4">
            {loading ? "Saving..." : "Save Preferences"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
