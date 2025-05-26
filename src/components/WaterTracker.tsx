
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Droplets, Plus, Minus, Target } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const WaterTracker = ({ waterIntake, waterGoal, onAddWater }) => {
  const { toast } = useToast();
  
  const waterProgress = (waterIntake / waterGoal) * 100;
  
  const addWater = (amount) => {
    onAddWater(amount);
    if (amount > 0) {
      toast({
        title: "Water Added!",
        description: `Added ${amount} glass${amount > 1 ? 'es' : ''} of water`,
      });
      
      if (waterIntake + amount >= waterGoal) {
        toast({
          title: "Goal Achieved! 🎉",
          description: "You've reached your daily water goal!",
        });
      }
    }
  };

  const removeWater = () => {
    if (waterIntake > 0) {
      onAddWater(-1);
      toast({
        title: "Water Removed",
        description: "Removed 1 glass of water",
      });
    }
  };

  const getWaterLevel = () => {
    const percentage = Math.min((waterIntake / waterGoal) * 100, 100);
    return percentage;
  };

  const getMotivationalMessage = () => {
    const percentage = waterProgress;
    
    if (percentage >= 100) return "Excellent! You've reached your goal! 🎉";
    if (percentage >= 75) return "Almost there! Keep it up! 💪";
    if (percentage >= 50) return "Great progress! You're halfway there! 🌊";
    if (percentage >= 25) return "Good start! Keep drinking! 💧";
    return "Let's start hydrating! Your body will thank you! 🚰";
  };

  return (
    <div className="space-y-6">
      {/* Water Progress Card */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5" />
            Daily Water Intake
          </CardTitle>
          <CardDescription className="text-cyan-100">
            Stay hydrated for optimal health
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {/* Water Visualization */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              {/* Water Bottle SVG */}
              <div className="w-32 h-48 relative">
                <svg viewBox="0 0 120 180" className="w-full h-full">
                  {/* Bottle outline */}
                  <path
                    d="M35 40 L35 20 Q35 10 45 10 L75 10 Q85 10 85 20 L85 40 L90 40 Q95 40 95 45 L95 165 Q95 175 85 175 L35 175 Q25 175 25 165 L25 45 Q25 40 30 40 Z"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="3"
                    className="drop-shadow-sm"
                  />
                  
                  {/* Water fill */}
                  <defs>
                    <clipPath id="bottle-clip">
                      <path d="M28 42 L92 42 L92 172 Q92 172 85 172 L35 172 Q28 172 28 172 Z" />
                    </clipPath>
                    <linearGradient id="water-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#0891b2" />
                    </linearGradient>
                  </defs>
                  
                  <rect
                    x="28"
                    y={172 - (getWaterLevel() / 100) * 130}
                    width="64"
                    height={(getWaterLevel() / 100) * 130}
                    fill="url(#water-gradient)"
                    clipPath="url(#bottle-clip)"
                    className="transition-all duration-500 ease-out"
                  />
                  
                  {/* Water surface animation */}
                  {waterIntake > 0 && (
                    <ellipse
                      cx="60"
                      cy={172 - (getWaterLevel() / 100) * 130}
                      rx="32"
                      ry="2"
                      fill="#0891b2"
                      opacity="0.8"
                      className="animate-pulse"
                    />
                  )}
                  
                  {/* Bottle cap */}
                  <rect x="40" y="5" width="40" height="15" rx="3" fill="#64748b" />
                </svg>
              </div>
            </div>
          </div>

          {/* Progress Info */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {waterIntake} / {waterGoal}
            </div>
            <div className="text-gray-600 mb-4">glasses of water</div>
            
            <Progress value={waterProgress} className="h-3 mb-4" />
            
            <div className="text-lg font-medium text-cyan-600">
              {Math.round(waterProgress)}% Complete
            </div>
            
            <p className="text-sm text-gray-600 mt-2">
              {getMotivationalMessage()}
            </p>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={removeWater}
              disabled={waterIntake === 0}
              className="hover:bg-red-50 hover:border-red-300"
            >
              <Minus className="w-5 h-5" />
            </Button>
            
            <Button
              size="lg"
              onClick={() => addWater(1)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Glass
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Add Options */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Quick Add</CardTitle>
          <CardDescription>Add multiple glasses at once</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                onClick={() => addWater(amount)}
                className="h-16 flex flex-col items-center justify-center hover:bg-cyan-50 hover:border-cyan-300"
              >
                <Droplets className="w-5 h-5 mb-1 text-cyan-500" />
                <span className="text-sm font-medium">{amount} glass{amount > 1 ? 'es' : ''}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hydration Tips */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Hydration Tips
          </CardTitle>
          <CardDescription>Stay healthy and hydrated</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💧 Start Your Day</h4>
              <p className="text-sm text-blue-700">Drink a glass of water when you wake up to kickstart your metabolism.</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">🕐 Set Reminders</h4>
              <p className="text-sm text-green-700">Set hourly reminders to drink water throughout the day.</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">🍽️ Before Meals</h4>
              <p className="text-sm text-purple-700">Drink water 30 minutes before meals to aid digestion.</p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">🏃 During Exercise</h4>
              <p className="text-sm text-orange-700">Increase water intake when exercising or in hot weather.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaterTracker;
