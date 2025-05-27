
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Dumbbell, Timer, TrendingUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const WorkoutLogger = ({ onAddWorkout, workouts }) => {
  const [exercise, setExercise] = useState('');
  const [workoutType, setWorkoutType] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!exercise || !workoutType || !duration || !intensity) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const workout = {
      exercise, // This is used for display purposes only
      type: workoutType, // This matches the database schema
      duration: parseInt(duration),
      intensity // This is used for calorie calculation
    };

    console.log('Submitting workout:', workout); // Debug log
    onAddWorkout(workout);
    
    // Reset form
    setExercise('');
    setWorkoutType('');
    setDuration('');
    setIntensity('');

    toast({
      title: "Workout Added!",
      description: `${exercise} logged successfully`,
    });
  };

  const workoutTypes = [
    { value: 'cardio', label: 'Cardio', color: 'bg-red-100 text-red-800', icon: '❤️' },
    { value: 'strength', label: 'Strength', color: 'bg-blue-100 text-blue-800', icon: '💪' },
    { value: 'flexibility', label: 'Flexibility', color: 'bg-green-100 text-green-800', icon: '🧘' },
    { value: 'sports', label: 'Sports', color: 'bg-orange-100 text-orange-800', icon: '⚽' },
    { value: 'other', label: 'Other', color: 'bg-purple-100 text-purple-800', icon: '🏃' }
  ];

  const intensityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
  ];

  const getWorkoutTypeInfo = (type) => {
    return workoutTypes.find(wt => wt.value === type) || workoutTypes[4];
  };

  const getIntensityColor = (level) => {
    const intensity = intensityLevels.find(il => il.value === level);
    return intensity ? intensity.color : 'bg-gray-100 text-gray-800';
  };

  const totalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0);

  return (
    <div className="space-y-6">
      {/* Add Workout Form */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5" />
            Log New Workout
          </CardTitle>
          <CardDescription className="text-emerald-100">
            Track your exercise and fitness activities
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exercise">Exercise Name</Label>
                <Input
                  id="exercise"
                  placeholder="e.g., Running, Push-ups, Yoga"
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workout-type">Workout Type</Label>
                <Select value={workoutType} onValueChange={setWorkoutType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workout type" />
                  </SelectTrigger>
                  <SelectContent>
                    {workoutTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          {type.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="e.g., 30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="intensity">Intensity</Label>
                <Select value={intensity} onValueChange={setIntensity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select intensity" />
                  </SelectTrigger>
                  <SelectContent>
                    {intensityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Workout
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Today's Workouts */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            Today's Workouts
          </CardTitle>
          <CardDescription>
            Total exercise time: {totalDuration} minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workouts.length === 0 ? (
            <div className="text-center py-8">
              <Dumbbell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No workouts logged yet today</p>
              <p className="text-sm text-gray-400">Add your first workout above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {workouts.map((workout) => {
                const typeInfo = getWorkoutTypeInfo(workout.type);
                return (
                  <div key={workout.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        <span>{typeInfo.icon}</span>
                        {workout.exercise || `${workout.type.charAt(0).toUpperCase() + workout.type.slice(1)} Workout`}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={typeInfo.color}>
                          {workout.type}
                        </Badge>
                        <Badge className={getIntensityColor(workout.intensity || 'medium')}>
                          {workout.intensity || 'medium'} intensity
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {workout.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{workout.duration}m</div>
                      {workout.calories_burned && (
                        <div className="text-sm text-gray-500">{workout.calories_burned} cal</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workout Summary */}
      {workouts.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Workout Summary
            </CardTitle>
            <CardDescription>Exercise breakdown by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {workoutTypes.map((type) => {
                const typeWorkouts = workouts.filter(workout => workout.type === type.value);
                const totalMinutes = typeWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
                
                if (totalMinutes === 0) return null;
                
                return (
                  <div key={type.value} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${type.color} mb-2`}>
                      {type.label}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{totalMinutes}</div>
                    <div className="text-sm text-gray-500">minutes</div>
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

export default WorkoutLogger;
