
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Utensils, Dumbbell, Droplets, Calendar, TrendingUp, Plus } from 'lucide-react';
import MealLogger from '@/components/MealLogger';
import WorkoutLogger from '@/components/WorkoutLogger';
import WaterTracker from '@/components/WaterTracker';
import ProgressCharts from '@/components/ProgressCharts';
import DailySummary from '@/components/DailySummary';

const Index = () => {
  const [todayData, setTodayData] = useState({
    meals: [],
    workouts: [],
    waterIntake: 0,
    waterGoal: 8,
    caloriesConsumed: 0,
    caloriesGoal: 2000,
    exerciseMinutes: 0,
    exerciseGoal: 30
  });

  const [activeTab, setActiveTab] = useState('dashboard');

  const addMeal = (meal) => {
    setTodayData(prev => ({
      ...prev,
      meals: [...prev.meals, { ...meal, id: Date.now(), timestamp: new Date() }],
      caloriesConsumed: prev.caloriesConsumed + meal.calories
    }));
  };

  const addWorkout = (workout) => {
    setTodayData(prev => ({
      ...prev,
      workouts: [...prev.workouts, { ...workout, id: Date.now(), timestamp: new Date() }],
      exerciseMinutes: prev.exerciseMinutes + workout.duration
    }));
  };

  const addWater = (amount) => {
    setTodayData(prev => ({
      ...prev,
      waterIntake: Math.min(prev.waterIntake + amount, prev.waterGoal)
    }));
  };

  const waterProgress = (todayData.waterIntake / todayData.waterGoal) * 100;
  const calorieProgress = (todayData.caloriesConsumed / todayData.caloriesGoal) * 100;
  const exerciseProgress = (todayData.exerciseMinutes / todayData.exerciseGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Health Tracker</h1>
          <p className="text-gray-600">Track your daily wellness journey</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit mx-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="meals" className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Meals
            </TabsTrigger>
            <TabsTrigger value="workouts" className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4" />
              Workouts
            </TabsTrigger>
            <TabsTrigger value="water" className="flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              Water
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Summary
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="w-5 h-5" />
                    Calories Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">
                    {todayData.caloriesConsumed}
                  </div>
                  <div className="text-blue-100">
                    Goal: {todayData.caloriesGoal} cal
                  </div>
                  <Progress value={calorieProgress} className="mt-3 bg-blue-400" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5" />
                    Exercise Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">
                    {todayData.exerciseMinutes}m
                  </div>
                  <div className="text-emerald-100">
                    Goal: {todayData.exerciseGoal} min
                  </div>
                  <Progress value={exerciseProgress} className="mt-3 bg-emerald-400" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="w-5 h-5" />
                    Water Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">
                    {todayData.waterIntake}/{todayData.waterGoal}
                  </div>
                  <div className="text-cyan-100">
                    glasses
                  </div>
                  <Progress value={waterProgress} className="mt-3 bg-cyan-400" />
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Meals</CardTitle>
                  <CardDescription>Your latest food entries</CardDescription>
                </CardHeader>
                <CardContent>
                  {todayData.meals.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No meals logged today</p>
                  ) : (
                    <div className="space-y-3">
                      {todayData.meals.slice(-3).map((meal) => (
                        <div key={meal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{meal.name}</div>
                            <div className="text-sm text-gray-500">{meal.type}</div>
                          </div>
                          <Badge variant="secondary">{meal.calories} cal</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Workouts</CardTitle>
                  <CardDescription>Your latest exercise sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  {todayData.workouts.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No workouts logged today</p>
                  ) : (
                    <div className="space-y-3">
                      {todayData.workouts.slice(-3).map((workout) => (
                        <div key={workout.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{workout.exercise}</div>
                            <div className="text-sm text-gray-500">{workout.type}</div>
                          </div>
                          <Badge variant="secondary">{workout.duration}m</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Add new entries quickly</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => setActiveTab('meals')}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Log Meal
                </Button>
                <Button 
                  onClick={() => setActiveTab('workouts')}
                  className="bg-emerald-500 hover:bg-emerald-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Log Workout
                </Button>
                <Button 
                  onClick={() => addWater(1)}
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Water
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meals Tab */}
          <TabsContent value="meals">
            <MealLogger onAddMeal={addMeal} meals={todayData.meals} />
          </TabsContent>

          {/* Workouts Tab */}
          <TabsContent value="workouts">
            <WorkoutLogger onAddWorkout={addWorkout} workouts={todayData.workouts} />
          </TabsContent>

          {/* Water Tab */}
          <TabsContent value="water">
            <WaterTracker 
              waterIntake={todayData.waterIntake}
              waterGoal={todayData.waterGoal}
              onAddWater={addWater}
            />
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary">
            <DailySummary todayData={todayData} />
            <div className="mt-6">
              <ProgressCharts />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
