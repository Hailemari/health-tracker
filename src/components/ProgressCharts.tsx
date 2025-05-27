
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

interface ProgressChartsProps {
  meals: Meal[];
  workouts: Workout[];
  waterIntakes: WaterIntake[];
}

const ProgressCharts = ({ meals, workouts, waterIntakes }: ProgressChartsProps) => {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [exerciseData, setExerciseData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWeeklyData();
    }
  }, [user, meals, workouts, waterIntakes]);

  const loadWeeklyData = async () => {
    if (!user) return;

    try {
      // Get data for the past 7 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);

      const [mealsData, workoutsData, waterData] = await Promise.all([
        supabase
          .from('meals')
          .select('*')
          .eq('user_id', user.id)
          .gte('logged_at', startDate.toISOString())
          .lte('logged_at', endDate.toISOString()),
        
        supabase
          .from('workouts')
          .select('*')
          .eq('user_id', user.id)
          .gte('logged_at', startDate.toISOString())
          .lte('logged_at', endDate.toISOString()),
        
        supabase
          .from('water_intake')
          .select('*')
          .eq('user_id', user.id)
          .gte('logged_at', startDate.toISOString())
          .lte('logged_at', endDate.toISOString())
      ]);

      // Process data by day
      const weeklyStats = [];
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        const dayName = days[date.getDay()];
        
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        const dayMeals = mealsData.data?.filter(meal => {
          const mealDate = new Date(meal.logged_at);
          return mealDate >= dayStart && mealDate <= dayEnd;
        }) || [];

        const dayWorkouts = workoutsData.data?.filter(workout => {
          const workoutDate = new Date(workout.logged_at);
          return workoutDate >= dayStart && workoutDate <= dayEnd;
        }) || [];

        const dayWater = waterData.data?.filter(water => {
          const waterDate = new Date(water.logged_at);
          return waterDate >= dayStart && waterDate <= dayEnd;
        }) || [];

        const calories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0);
        const exercise = dayWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
        const water = Math.floor(dayWater.reduce((sum, intake) => sum + intake.amount, 0) / 250);

        weeklyStats.push({
          day: dayName,
          calories,
          exercise,
          water
        });
      }

      setWeeklyData(weeklyStats);

      // Process exercise type breakdown
      const exerciseTypes: { [key: string]: number } = {};
      workoutsData.data?.forEach(workout => {
        const type = workout.type;
        exerciseTypes[type] = (exerciseTypes[type] || 0) + workout.duration;
      });

      const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
      const exerciseBreakdown = Object.entries(exerciseTypes).map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
      }));

      setExerciseData(exerciseBreakdown);
      setLoading(false);
    } catch (error) {
      console.error('Error loading weekly data:', error);
      setLoading(false);
    }
  };

  // Custom label function to prevent NaN% display
  const renderCustomLabel = ({ name, percent }: any) => {
    const percentage = (percent * 100);
    if (isNaN(percentage) || percentage === 0) return '';
    return `${name} ${percentage.toFixed(0)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading charts...</div>
      </div>
    );
  }

  const totalWeeklyCalories = weeklyData.reduce((sum, day) => sum + day.calories, 0);
  const totalWeeklyExercise = weeklyData.reduce((sum, day) => sum + day.exercise, 0);
  const totalWeeklyWater = weeklyData.reduce((sum, day) => sum + day.water, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Weekly Calories Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              Weekly Calories
            </CardTitle>
            <CardDescription className="text-sm">Daily calorie intake over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#1d4ed8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Exercise Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Target className="w-4 h-4 sm:w-5 sm:h-5" />
              Weekly Exercise
            </CardTitle>
            <CardDescription className="text-sm">Daily exercise minutes over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="exercise" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Exercise Type Breakdown */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Exercise Breakdown</CardTitle>
            <CardDescription className="text-sm">Distribution of workout types this week</CardDescription>
          </CardHeader>
          <CardContent>
            {exerciseData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={exerciseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    fontSize={10}
                  >
                    {exerciseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-gray-500 text-sm">
                No exercise data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Water Intake Trend */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Water Intake Trend</CardTitle>
            <CardDescription className="text-sm">Daily water consumption over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="water" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#0891b2' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{totalWeeklyCalories.toLocaleString()}</div>
            <div className="text-blue-700 font-medium text-sm sm:text-base">Total Calories This Week</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">{totalWeeklyExercise}</div>
            <div className="text-green-700 font-medium text-sm sm:text-base">Total Exercise Minutes</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-cyan-100 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-cyan-600 mb-2">{totalWeeklyWater}</div>
            <div className="text-cyan-700 font-medium text-sm sm:text-base">Total Glasses of Water</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressCharts;
