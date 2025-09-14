"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowRight, Mic, Brain, Play, Sparkles, Bot, BarChart3, Star, Globe, Award, TrendingUp, Users, CheckCircle, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(120,119,198,0.3),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(255,119,198,0.3),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_rgba(120,219,255,0.2),_transparent_50%)]" />
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-xl blur opacity-30 animate-pulse" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    0chrono
                  </span>
                  <div className="text-xs text-gray-400 -mt-1">AI Medical Platform</div>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white font-medium transition-all hover:scale-105">Platform</a>
              <a href="#demo" className="text-gray-300 hover:text-white font-medium transition-all hover:scale-105">Demo</a>
              <a href="#pricing" className="text-gray-300 hover:text-white font-medium transition-all hover:scale-105">Pricing</a>
              <a href="#enterprise" className="text-gray-300 hover:text-white font-medium transition-all hover:scale-105">Enterprise</a>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
                Sign In
              </Button>
              <Link href="/">
                <Button className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg shadow-purple-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40">
                  Launch Platform
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Social Proof Banner */}
          <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Badge className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-300 px-4 py-2 text-sm backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Trusted by 2.5M+ healthcare professionals worldwide
            </Badge>
          </div>

          {/* Main Headline */}
          <div className={`mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                The Future of
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Healthcare
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Transform patient care with Bob, your AI medical assistant. 
              <span className="text-cyan-400 font-semibold"> See more patients, not more pages.</span>
              <br />
              Powered by advanced AI to revolutionize medical workflows.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={`mb-16 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/">
                <Button className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 text-lg rounded-2xl shadow-2xl shadow-purple-500/25 transition-all hover:scale-105 hover:shadow-3xl hover:shadow-purple-500/40 group">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg rounded-2xl font-semibold group">
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">2.5M+</div>
              <div className="text-gray-400 text-sm">Healthcare Professionals</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">50M+</div>
              <div className="text-gray-400 text-sm">Patients Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">99.9%</div>
              <div className="text-gray-400 text-sm">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">$2.1B</div>
              <div className="text-gray-400 text-sm">Healthcare Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-300 px-4 py-2 text-sm backdrop-blur-sm mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Platform Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Built for the Future of Medicine
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-white/10 hover:border-purple-500/30 transition-all hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Mic className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Voice Commands</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Natural language processing for seamless medical documentation and patient management.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-white/10 hover:border-purple-500/30 transition-all hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Real-time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Live performance metrics and insights to optimize patient care and operational efficiency.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-white/10 hover:border-purple-500/30 transition-all hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">HIPAA Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Enterprise-grade security with end-to-end encryption and privacy-first architecture.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-300 px-4 py-2 text-sm backdrop-blur-sm mb-4">
              <Star className="w-4 h-4 mr-2" />
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Loved by Healthcare Professionals
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-white/10">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"0chrono has revolutionized our practice. Bob understands medical terminology perfectly and saves us hours every day."</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-white font-semibold">Dr. Sarah Chen</p>
                    <p className="text-gray-400 text-sm">Cardiologist, Mayo Clinic</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-white/10">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"The voice commands are incredibly accurate. I can update patient records while examining them - it's like having a super-efficient assistant."</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-white font-semibold">Dr. Michael Rodriguez</p>
                    <p className="text-gray-400 text-sm">Emergency Medicine, Johns Hopkins</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-white/10">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"Our patient satisfaction scores increased 40% after implementing 0chrono. Shorter wait times and better documentation quality."</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-white font-semibold">Dr. Emily Watson</p>
                    <p className="text-gray-400 text-sm">Family Medicine, Cleveland Clinic</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  0chrono
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                The future of AI-native healthcare. See more patients, not more pages.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 flex justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 0chrono. All rights reserved.</p>
            <div className="flex space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
