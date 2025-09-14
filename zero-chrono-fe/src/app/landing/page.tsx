"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowRight, Mic, Calendar, Shield, Zap, Users, FileText, Phone, Brain, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">0</span>
              </div>
              <span className="text-xl font-bold text-gray-900">chrono</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200">
            AI-Native Medical Platform
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            See more patients,
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              not more pages
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Meet Bob, your AI assistant that transforms how medical professionals work. 
            Simply speak your commands and watch as patient records, prescriptions, and schedules 
            update automatically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-4 text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              Watch Demo
            </Button>
          </div>
          
          {/* Voice Demo */}
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Mic className="h-8 w-8 text-white" />
              </div>
            </div>
            <p className="text-lg text-gray-700 mb-2 font-medium">Try saying:</p>
            <p className="text-blue-600 text-xl font-semibold italic">
              "Hey Bob, add paracetamol for Jack as he has fever"
            </p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Bob is listening...</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need for modern healthcare
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From voice-activated patient management to AI-powered insurance processing, 
              0chrono handles the complexity so you can focus on patient care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Mic className="h-8 w-8" />}
              title="Voice-First Interface"
              description="Simply speak to Bob and watch patient records update in real-time. No more typing or clicking through endless forms."
            />
            <FeatureCard
              icon={<FileText className="h-8 w-8" />}
              title="Smart OPD Summaries"
              description="Automatically generate comprehensive patient summaries from voice commands and clinical conversations."
            />
            <FeatureCard
              icon={<Calendar className="h-8 w-8" />}
              title="Intelligent Scheduling"
              description="Bob manages your calendar, schedules follow-ups, and coordinates with your team automatically."
            />
            <FeatureCard
              icon={<Phone className="h-8 w-8" />}
              title="Emergency Services"
              description="Instantly connect with on-duty specialists like anesthetics with a simple voice command during surgeries."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Insurance Adjudication"
              description="AI-powered insurance claim processing and plan comparison for seamless billing and approvals."
            />
            <FeatureCard
              icon={<Brain className="h-8 w-8" />}
              title="Privacy-First AI"
              description="All conversation processing happens locally to ensure complete patient data privacy and HIPAA compliance."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How 0chrono transforms your workflow
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to revolutionize your medical practice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <WorkflowStep
              number="1"
              title="Speak Naturally"
              description="Talk to Bob like you would to a colleague. No special commands or syntax required."
              example="Hey Bob, add paracetamol 500mg twice daily for patient John Doe"
            />
            <WorkflowStep
              number="2"
              title="AI Processing"
              description="Bob understands context, extracts medical information, and updates relevant systems automatically."
              example="✓ Medication added to John Doe's profile
✓ Drug interactions checked
✓ Insurance coverage verified"
            />
            <WorkflowStep
              number="3"
              title="Review & Approve"
              description="Quickly review Bob's work and approve changes before they're finalized and sent to patients."
              example="All updates ready for your approval in the dashboard"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <StatCard number="85%" label="Less time on paperwork" />
            <StatCard number="3x" label="More patients per day" />
            <StatCard number="99.9%" label="Accuracy rate" />
            <StatCard number="<2min" label="Average task completion" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to transform your practice?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of medical professionals who've already made the switch to AI-native healthcare.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-4 text-lg">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">0</span>
                </div>
                <span className="text-xl font-bold">chrono</span>
              </div>
              <p className="text-gray-400">
                See more patients, not more pages.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 0chrono. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-6">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

function WorkflowStep({ number, title, description, example }: {
  number: string;
  title: string;
  description: string;
  example: string;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
        {number}
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
      <div className="bg-white rounded-lg p-4 border-l-4 border-blue-600 text-left">
        <p className="text-sm text-gray-700 font-mono">{example}</p>
      </div>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-bold mb-2">{number}</div>
      <div className="text-blue-100">{label}</div>
    </div>
  );
}
