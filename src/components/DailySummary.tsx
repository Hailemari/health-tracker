
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, AlertCircle, TrendingUp, Award } from 'lucide-react';

const DailySummary = ({ todayData }) => {
  const {
    meals,
    workouts,
    waterIntake,
    waterGoal,
    caloriesConsumed,
    caloriesGoal,
    exerciseMinutes,
    exerciseGoal
  } = todayData;

  const calculateGoalProgress = () => {
    const waterProgress = (waterIntake / waterGoal) * 100;
    const calorieProgress = Math.min((caloriesConsumed / caloriesGoal) * 100, 100);
    const exerciseProgress = (exerciseMinutes / exerciseGoal) * 100;
    
    return {
      water: Math.round(waterProgress),
      calories: Math.round(calorieProgress),
      exercise: Math.round(exerciseProgress)
    };
  };

  const progress = calculateGoalProgress();
  
  const getOverallScore = () => {
    const totalProgress = progress.water + progress.exercise + Math.min(progress.calories, 100);
    return Math.round(totalProgress / 3);
  };

  const overallScore = getOverallScore();

  const getScoreMessage = (score) => {
    if (score >= 90) return { message: "Excellent day! You're crushing your goals! 🌟", color: "text-green-600", icon: Award };
    if (score >= 75) return { message: "Great job! You're doing really well today! 👍", color: "text-blue-600", icon: CheckCircle };
    if (score >= 50) return { message: "Good progress! Keep pushing forward! 💪", color: "text-yellow-600", icon: TrendingUp };
    return { message: "Every step counts! Let's make progress! 🚀", color: "text-orange-600", icon: AlertCircle };
  };

  const scoreInfo = getScoreMessage(overallScore);
  const ScoreIcon = scoreInfo.icon;

  const getHealthTips = () => {
    const tips = [];
    
    if (progress.water < 75) {
      tips.push({
        type: "Hydration",
        message: "Try to drink more water throughout the day",
        color: "bg-blue-50 text-blue-700 border-blue-200"
      });
    }
    
    if (progress.exercise < 50) {
      tips.push({
        type: "Exercise",
        message: "Consider adding a short walk or stretching session",
        color: "bg-green-50 text-green-700 border-green-200"
      });
    }
    
    if (meals.length === 0) {
      tips.push({
        type: "Nutrition",
        message: "Don't forget to log your meals to track your nutrition",
        color: "bg-orange-50 text-orange-700 border-orange-200"
      });
    }
    
    return tips;
  };

  const healthTips = getHealthTips();

  const formatTime = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Daily Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-6 h-6" />
            Daily Summary
          </CardTitle>
          <CardDescription className="text-purple-100">
            {formatTime()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold mb-2">{overallScore}%</div>
              <div className="text-purple-100">Overall Progress</div>
            </div>
            <div className="text-right">
              <ScoreIcon className="w-12 h-12 mx-auto mb-2" />
              <div className="text-sm text-purple-100">Daily Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal Progress */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Goal Progress</CardTitle>
          <CardDescription>How you're doing with today's targets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Water Goal */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Water Intake</span>
              <span className="text-sm text-gray-600">{waterIntake}/{waterGoal} glasses</span>
            </div>
            <Progress value={progress.water} className="h-3" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{progress.water}% complete</span>
              <span className={progress.water >= 100 ? "text-green-600 font-medium" : ""}>
                {progress.water >= 100 ? "Goal achieved! ✅" : `${waterGoal - waterIntake} glasses to go`}
              </span>
            </div>
          </div>

          {/* Exercise Goal */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Exercise</span>
              <span className="text-sm text-gray-600">{exerciseMinutes}/{exerciseGoal} minutes</span>
            </div>
            <Progress value={progress.exercise} className="h-3" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{progress.exercise}% complete</span>
              <span className={progress.exercise >= 100 ? "text-green-600 font-medium" : ""}>
                {progress.exercise >= 100 ? "Goal achieved! ✅" : `${exerciseGoal - exerciseMinutes} minutes to go`}
              </span>
            </div>
          </div>

          {/* Calorie Goal */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Calories</span>
              <span className="text-sm text-gray-600">{caloriesConsumed}/{caloriesGoal} cal</span>
            </div>
            <Progress value={Math.min(progress.calories, 100)} className="h-3" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{progress.calories}% of goal</span>
              <span className={progress.calories >= 80 && progress.calories <= 120 ? "text-green-600 font-medium" : ""}>
                {progress.calories >= 80 && progress.calories <= 120 
                  ? "Perfect range! ✅" 
                  : progress.calories < 80 
                    ? `${caloriesGoal - caloriesConsumed} calories below goal`
                    : "Above daily goal"
                }
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivation Message */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <ScoreIcon className={`w-8 h-8 ${scoreInfo.color}`} />
            <div>
              <div className={`font-medium ${scoreInfo.color}`}>
                {scoreInfo.message}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Keep up the great work on your health journey!
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">{meals.length}</div>
            <div className="text-sm text-gray-600">meals logged</div>
            {meals.length > 0 && (
              <div className="mt-3 space-y-1">
                {['breakfast', 'lunch', 'dinner', 'snack'].map(type => {
                  const count = meals.filter(meal => meal.type === type).length;
                  if (count > 0) {
                    return (
                      <Badge key={type} variant="secondary" className="mr-1 mb-1">
                        {count} {type}{count > 1 ? 's' : ''}
                      </Badge>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">{workouts.length}</div>
            <div className="text-sm text-gray-600">sessions completed</div>
            {workouts.length > 0 && (
              <div className="mt-3 space-y-1">
                {['cardio', 'strength', 'flexibility', 'sports'].map(type => {
                  const count = workouts.filter(workout => workout.type === type).length;
                  if (count > 0) {
                    return (
                      <Badge key={type} variant="secondary" className="mr-1 mb-1">
                        {count} {type}
                      </Badge>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Hydration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-2">{progress.water}%</div>
            <div className="text-sm text-gray-600">of daily goal</div>
            <div className="mt-3">
              <Badge 
                variant="secondary" 
                className={
                  progress.water >= 100 
                    ? "bg-green-100 text-green-800" 
                    : progress.water >= 75 
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                }
              >
                {waterIntake} glasses
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Tips */}
      {healthTips.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Personalized Tips</CardTitle>
            <CardDescription>Suggestions to improve your health today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthTips.map((tip, index) => (
                <div key={index} className={`p-4 rounded-lg border ${tip.color}`}>
                  <div className="font-medium mb-1">{tip.type}</div>
                  <div className="text-sm">{tip.message}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DailySummary;
