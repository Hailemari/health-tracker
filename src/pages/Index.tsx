import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Utensils, Dumbbell, Droplets, Calendar, TrendingUp, Plus, LogOut, User } from 'lucide-react';
import MealLogger from '@/components/MealLogger';
import WorkoutLogger from '@/components/WorkoutLogger';
import WaterTracker from '@/components/WaterTracker';
import ProgressCharts from '@/components/ProgressCharts';
import DailySummary from '@/components/DailySummary';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Meal {
  id: string;
  name: string;
  type: string;
  calories: number;
  logged_at: string;
}

interface Workout {
  id: string;
  type: string;
  duration: number;
  calories_burned: number;
  logged_at: string;
}

interface WaterIntake {
  id: string;
  amount: number;
  logged_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [meals, setMeals] = useState<Meal[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [waterIntakes, setWaterIntakes] = useState<WaterIntake[]>([]);
  const [loading, setLoading] = useState(true);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadTodayData();
  }, [user, navigate]);

  const loadTodayData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [mealsData, workoutsData, waterData] = await Promise.all([
        supabase
          .from('meals')
          .select('*')
          .eq('user_id', user.id)
          .gte('logged_at', todayStart.toISOString())
          .lte('logged_at', todayEnd.toISOString())
          .order('logged_at', { ascending: false }),
        
        supabase
          .from('workouts')
          .select('*')
          .eq('user_id', user.id)
          .gte('logged_at', todayStart.toISOString())
          .lte('logged_at', todayEnd.toISOString())
          .order('logged_at', { ascending: false }),
        
        supabase
          .from('water_intake')
          .select('*')
          .eq('user_id', user.id)
          .gte('logged_at', todayStart.toISOString())
          .lte('logged_at', todayEnd.toISOString())
          .order('logged_at', { ascending: false })
      ]);

      if (mealsData.data) setMeals(mealsData.data);
      if (workoutsData.data) setWorkouts(workoutsData.data);
      if (waterData.data) setWaterIntakes(waterData.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const addMeal = async (mealData: { name: string; type: string; calories: number }) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('meals')
        .insert([
          {
            user_id: user.id,
            name: mealData.name,
            type: mealData.type,
            calories: mealData.calories,
            logged_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setMeals(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  const addWorkout = async (workoutData: { type: string; duration: number; calories_burned: number }) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('workouts')
        .insert([
          {
            user_id: user.id,
            type: workoutData.type,
            duration: workoutData.duration,
            calories_burned: workoutData.calories_burned,
            logged_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setWorkouts(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  const addWater = async (amount: number) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('water_intake')
        .insert([
          {
            user_id: user.id,
            amount: amount * 250, // Convert glasses to ml
            logged_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setWaterIntakes(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Error adding water intake:', error);
    }
  };

  // Calculate totals
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalExerciseMinutes = workouts.reduce((sum, workout) => sum + workout.duration, 0);
  const totalWaterGlasses = Math.floor(waterIntakes.reduce((sum, water) => sum + water.amount, 0) / 250);

  const caloriesGoal = 2000;
  const exerciseGoal = 30;
  const waterGoal = 8;

  const calorieProgress = (totalCalories / caloriesGoal) * 100;
  const exerciseProgress = (totalExerciseMinutes / exerciseGoal) * 100;
  const waterProgress = (totalWaterGlasses / waterGoal) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading your health data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Health Tracker</h1>
            <p className="text-gray-600">Welcome back, {user?.user_metadata?.full_name || 'User'}!</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-5 h-5" />
              <span>{user?.email}</span>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
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
                  <div className="text-3xl font-bold mb-2">{totalCalories}</div>
                  <div className="text-blue-100">Goal: {caloriesGoal} cal</div>
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
                  <div className="text-3xl font-bold mb-2">{totalExerciseMinutes}m</div>
                  <div className="text-emerald-100">Goal: {exerciseGoal} min</div>
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
                  <div className="text-3xl font-bold mb-2">{totalWaterGlasses}/{waterGoal}</div>
                  <div className="text-cyan-100">glasses</div>
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
                  {meals.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No meals logged today</p>
                  ) : (
                    <div className="space-y-3">
                      {meals.slice(0, 3).map((meal) => (
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
                  {workouts.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No workouts logged today</p>
                  ) : (
                    <div className="space-y-3">
                      {workouts.slice(0, 3).map((workout) => (
                        <div key={workout.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{workout.type}</div>
                            <div className="text-sm text-gray-500">{workout.calories_burned} cal burned</div>
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
            <MealLogger onAddMeal={addMeal} meals={meals.map(meal => ({
              ...meal,
              timestamp: new Date(meal.logged_at)
            }))} />
          </TabsContent>

          {/* Workouts Tab */}
          <TabsContent value="workouts">
            <WorkoutLogger onAddWorkout={addWorkout} workouts={workouts.map(workout => ({
              ...workout,
              exercise: workout.type,
              timestamp: new Date(workout.logged_at)
            }))} />
          </TabsContent>

          {/* Water Tab */}
          <TabsContent value="water">
            <WaterTracker 
              waterIntake={totalWaterGlasses}
              waterGoal={waterGoal}
              onAddWater={addWater}
            />
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary">
            <DailySummary todayData={{
              meals: meals.map(meal => ({
                ...meal,
                timestamp: new Date(meal.logged_at)
              })),
              workouts: workouts.map(workout => ({
                ...workout,
                exercise: workout.type,
                timestamp: new Date(workout.logged_at)
              })),
              waterIntake: totalWaterGlasses,
              waterGoal,
              caloriesConsumed: totalCalories,
              caloriesGoal,
              exerciseMinutes: totalExerciseMinutes,
              exerciseGoal
            }} />
            <div className="mt-6">
              <ProgressCharts />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
