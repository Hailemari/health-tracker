
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Utensils, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const MealLogger = ({ onAddMeal, meals }) => {
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState('');
  const [calories, setCalories] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!mealName || !mealType || !calories) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const meal = {
      name: mealName,
      type: mealType,
      calories: parseInt(calories)
    };

    onAddMeal(meal);
    
    // Reset form
    setMealName('');
    setMealType('');
    setCalories('');

    toast({
      title: "Meal Added!",
      description: `${mealName} logged successfully`,
    });
  };

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'lunch', label: 'Lunch', color: 'bg-orange-100 text-orange-800' },
    { value: 'dinner', label: 'Dinner', color: 'bg-red-100 text-red-800' },
    { value: 'snack', label: 'Snack', color: 'bg-purple-100 text-purple-800' }
  ];

  const getMealTypeColor = (type) => {
    const mealType = mealTypes.find(mt => mt.value === type);
    return mealType ? mealType.color : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Add Meal Form */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5" />
            Log New Meal
          </CardTitle>
          <CardDescription className="text-blue-100">
            Track your food intake and calories
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meal-name">Meal Name</Label>
                <Input
                  id="meal-name"
                  placeholder="e.g., Grilled Chicken Salad"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meal-type">Meal Type</Label>
                <Select value={mealType} onValueChange={setMealType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {mealTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                placeholder="e.g., 350"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Meal
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Today's Meals */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Today's Meals</CardTitle>
          <CardDescription>
            Total calories: {meals.reduce((sum, meal) => sum + meal.calories, 0)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {meals.length === 0 ? (
            <div className="text-center py-8">
              <Utensils className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No meals logged yet today</p>
              <p className="text-sm text-gray-400">Add your first meal above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {meals.map((meal) => (
                <div key={meal.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{meal.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getMealTypeColor(meal.type)}>
                        {meal.type}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {meal.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{meal.calories} cal</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meal Type Summary */}
      {meals.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Meal Summary</CardTitle>
            <CardDescription>Calories by meal type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mealTypes.map((type) => {
                const typeMeals = meals.filter(meal => meal.type === type.value);
                const totalCalories = typeMeals.reduce((sum, meal) => sum + meal.calories, 0);
                
                return (
                  <div key={type.value} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${type.color} mb-2`}>
                      {type.label}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{totalCalories}</div>
                    <div className="text-sm text-gray-500">calories</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MealLogger;
