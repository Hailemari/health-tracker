
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MealLogger from '@/components/MealLogger';
import WorkoutLogger from '@/components/WorkoutLogger';
import WaterTracker from '@/components/WaterTracker';
import ProgressCharts from '@/components/ProgressCharts';
import DailySummary from '@/components/DailySummary';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user's meals
  const { data: meals = [] } = useQuery({
    queryKey: ['meals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch user's workouts
  const { data: workouts = [] } = useQuery({
    queryKey: ['workouts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch user's water intake
  const { data: waterIntakes = [] } = useQuery({
    queryKey: ['water_intake', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('water_intake')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const handleAddMeal = async (mealData: any) => {
    if (!user?.id) return;
    
    const { error } = await supabase
      .from('meals')
      .insert({
        user_id: user.id,
        name: mealData.name,
        calories: mealData.calories,
        protein: mealData.protein,
        carbs: mealData.carbs,
        fat: mealData.fat,
        logged_at: new Date().toISOString()
      });

    if (!error) {
      queryClient.invalidateQueries({ queryKey: ['meals', user.id] });
    }
  };

  const handleAddWorkout = async (workoutData: any) => {
    if (!user?.id) return;
    
    const { error } = await supabase
      .from('workouts')
      .insert({
        user_id: user.id,
        exercise: workoutData.exercise,
        duration: workoutData.duration,
        calories_burned: workoutData.calories_burned,
        logged_at: new Date().toISOString()
      });

    if (!error) {
      queryClient.invalidateQueries({ queryKey: ['workouts', user.id] });
    }
  };

  const handleAddWater = async (amount: number) => {
    if (!user?.id) return;
    
    const { error } = await supabase
      .from('water_intake')
      .insert({
        user_id: user.id,
        amount: amount,
        logged_at: new Date().toISOString()
      });

    if (!error) {
      queryClient.invalidateQueries({ queryKey: ['water_intake', user.id] });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getUserInitial = () => {
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  // Calculate today's water intake
  const today = new Date().toDateString();
  const todayWaterIntake = waterIntakes
    .filter(intake => new Date(intake.logged_at).toDateString() === today)
    .reduce((total, intake) => total + intake.amount, 0);

  // Prepare today's data for DailySummary
  const todayData = {
    meals: meals.filter(meal => new Date(meal.logged_at).toDateString() === today),
    workouts: workouts.filter(workout => new Date(workout.logged_at).toDateString() === today),
    waterIntake: todayWaterIntake
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">HealthTracker</span>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
                {getUserInitial()}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Loggers */}
          <div className="lg:col-span-2 space-y-6">
            <MealLogger onAddMeal={handleAddMeal} meals={meals} />
            <WorkoutLogger onAddWorkout={handleAddWorkout} workouts={workouts} />
            <WaterTracker 
              waterIntake={todayWaterIntake} 
              waterGoal={2000} 
              onAddWater={handleAddWater} 
            />
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            <DailySummary todayData={todayData} />
          </div>
        </div>

        {/* Charts Section */}
        <ProgressCharts 
          meals={meals}
          workouts={workouts}
          waterIntakes={waterIntakes}
        />
      </main>
    </div>
  );
};

export default Dashboard;
