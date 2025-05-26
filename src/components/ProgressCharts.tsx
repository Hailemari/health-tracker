
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Target } from 'lucide-react';

const ProgressCharts = () => {
  // Sample data for the past week
  const weeklyData = [
    { day: 'Mon', calories: 1800, exercise: 45, water: 6 },
    { day: 'Tue', calories: 2100, exercise: 30, water: 8 },
    { day: 'Wed', calories: 1950, exercise: 60, water: 7 },
    { day: 'Thu', calories: 2200, exercise: 25, water: 5 },
    { day: 'Fri', calories: 1750, exercise: 40, water: 9 },
    { day: 'Sat', calories: 2400, exercise: 90, water: 6 },
    { day: 'Sun', calories: 2000, exercise: 35, water: 8 }
  ];

  // Sample data for exercise breakdown
  const exerciseData = [
    { name: 'Cardio', value: 45, color: '#ef4444' },
    { name: 'Strength', value: 30, color: '#3b82f6' },
    { name: 'Flexibility', value: 15, color: '#10b981' },
    { name: 'Sports', value: 10, color: '#f59e0b' }
  ];

  // Sample monthly progress data
  const monthlyProgress = [
    { week: 'Week 1', avgCalories: 1900, avgExercise: 40, avgWater: 7 },
    { week: 'Week 2', avgCalories: 2050, avgExercise: 45, avgWater: 6.5 },
    { week: 'Week 3', avgCalories: 1950, avgExercise: 55, avgWater: 7.5 },
    { week: 'Week 4', avgCalories: 2100, avgExercise: 50, avgWater: 8 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Calories Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Weekly Calories
            </CardTitle>
            <CardDescription>Daily calorie intake over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#1d4ed8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Exercise Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Weekly Exercise
            </CardTitle>
            <CardDescription>Daily exercise minutes over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="exercise" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exercise Type Breakdown */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Exercise Breakdown</CardTitle>
            <CardDescription>Distribution of workout types this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={exerciseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {exerciseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Water Intake Trend */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Water Intake Trend</CardTitle>
            <CardDescription>Daily water consumption over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="water" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  dot={{ fill: '#06b6d4', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#0891b2' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Overview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Monthly Overview
          </CardTitle>
          <CardDescription>Weekly averages for all health metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="avgCalories" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Avg Calories"
              />
              <Line 
                type="monotone" 
                dataKey="avgExercise" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Avg Exercise (min)"
              />
              <Line 
                type="monotone" 
                dataKey="avgWater" 
                stroke="#06b6d4" 
                strokeWidth={2}
                name="Avg Water (glasses)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">14,500</div>
            <div className="text-blue-700 font-medium">Total Calories This Week</div>
            <div className="text-sm text-blue-500 mt-1">↑ 5% from last week</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">285</div>
            <div className="text-green-700 font-medium">Total Exercise Minutes</div>
            <div className="text-sm text-green-500 mt-1">↑ 12% from last week</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-50 to-cyan-100">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-cyan-600 mb-2">49</div>
            <div className="text-cyan-700 font-medium">Total Glasses of Water</div>
            <div className="text-sm text-cyan-500 mt-1">↓ 2% from last week</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressCharts;
