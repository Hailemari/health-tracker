
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Utensils, Dumbbell, Droplets, TrendingUp, Users, Shield, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Utensils,
      title: "Meal Tracking",
      description: "Log your meals with detailed calorie and nutrition information"
    },
    {
      icon: Dumbbell,
      title: "Workout Logger",
      description: "Track your exercise routines and monitor your fitness progress"
    },
    {
      icon: Droplets,
      title: "Hydration Monitor",
      description: "Stay hydrated with our intuitive water intake tracking"
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Visualize your health journey with detailed charts and insights"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "1M+", label: "Meals Logged" },
    { number: "500K+", label: "Workouts Tracked" },
    { number: "99%", label: "User Satisfaction" }
  ];

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
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate('/auth?tab=login')}>
              Sign In
            </Button>
            <Button onClick={() => navigate('/auth?tab=signup')} className="bg-blue-500 hover:bg-blue-600">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200">
          🎉 Now with Real-time Analytics
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
          Transform Your
          <span className="bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent"> Health Journey</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Track meals, workouts, and hydration in one beautiful app. Get insights that help you reach your wellness goals faster.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate('/auth?tab=signup')} className="bg-blue-500 hover:bg-blue-600 text-lg px-8 py-6">
            Start Your Journey
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/auth?tab=login')} className="text-lg px-8 py-6">
            Sign In to Continue
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Everything You Need</h2>
          <p className="text-xl text-gray-600">Comprehensive health tracking tools in one place</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white/50 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Why Choose HealthTracker?</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">Community Driven</h4>
                    <p className="text-gray-600">Join thousands of users on their wellness journey</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">Secure & Private</h4>
                    <p className="text-gray-600">Your health data is encrypted and protected</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">Always Accessible</h4>
                    <p className="text-gray-600">Track your progress anywhere, anytime</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur-2xl opacity-20"></div>
              <Card className="border-0 shadow-2xl relative">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Ready to Start?</CardTitle>
                  <CardDescription className="text-center">
                    Join our community and begin your transformation today
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button size="lg" onClick={() => navigate('/auth?tab=signup')} className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-lg py-6">
                    Create Free Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <p className="text-sm text-gray-500 mt-4">
                    Already have an account?{' '}
                    <button
                      onClick={() => navigate('/auth?tab=login')}
                      className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                      Sign in here
                    </button>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">HealthTracker</span>
          </div>
          <p className="text-gray-400 mb-6">Transform your health, one day at a time.</p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <span>© {new Date().getFullYear()} HealthTracker. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
