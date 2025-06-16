import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Leaf, Car, Home, Utensils, Trash2, Lightbulb } from 'lucide-react';
import FeedbackForm from './FeedbackForm';

interface CarbonData {
  energy: {
    electricity: number;
    gas: number;
    heating: string;
  };
  transport: {
    carMiles: number;
    carType: string;
    flights: number;
    publicTransport: number;
  };
  food: {
    meatFrequency: string;
    localFood: string;
    organicFood: string;
  };
  waste: {
    recycling: string;
    wasteReduction: string;
  };
}

const CarbonCalculator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<CarbonData>({
    energy: { electricity: 0, gas: 0, heating: '' },
    transport: { carMiles: 0, carType: '', flights: 0, publicTransport: 0 },
    food: { meatFrequency: '', localFood: '', organicFood: '' },
    waste: { recycling: '', wasteReduction: '' }
  });
  const [results, setResults] = useState<any>(null);

  const calculateCarbon = () => {
    // Energy calculations (kWh to CO2)
    const electricityEmissions = data.energy.electricity * 0.92; // kg CO2 per kWh
    const gasEmissions = data.energy.gas * 2.04; // kg CO2 per cubic meter
    const heatingMultiplier = data.energy.heating === 'gas' ? 1.2 : data.energy.heating === 'electric' ? 0.8 : 1;
    const totalEnergy = (electricityEmissions + gasEmissions) * heatingMultiplier;

    // Transport calculations
    const carTypeMultiplier = {
      'electric': 0.1,
      'hybrid': 0.3,
      'petrol': 0.6,
      'diesel': 0.7,
      'suv': 0.9
    };
    const carEmissions = data.transport.carMiles * 52 * (carTypeMultiplier[data.transport.carType as keyof typeof carTypeMultiplier] || 0.6);
    const flightEmissions = data.transport.flights * 150; // kg CO2 per flight
    const publicTransportEmissions = data.transport.publicTransport * 52 * 0.1; // kg CO2 per week
    const totalTransport = carEmissions + flightEmissions + publicTransportEmissions;

    // Food calculations
    const meatMultiplier = {
      'daily': 2.5,
      'weekly': 1.8,
      'monthly': 1.2,
      'never': 0.8
    };
    const localMultiplier = data.food.localFood === 'always' ? 0.8 : data.food.localFood === 'sometimes' ? 0.9 : 1;
    const organicMultiplier = data.food.organicFood === 'always' ? 0.9 : data.food.organicFood === 'sometimes' ? 0.95 : 1;
    const totalFood = 1200 * (meatMultiplier[data.food.meatFrequency as keyof typeof meatMultiplier] || 1.5) * localMultiplier * organicMultiplier;

    // Waste calculations
    const recyclingMultiplier = data.waste.recycling === 'always' ? 0.7 : data.waste.recycling === 'sometimes' ? 0.85 : 1;
    const wasteReductionMultiplier = data.waste.wasteReduction === 'high' ? 0.8 : data.waste.wasteReduction === 'medium' ? 0.9 : 1;
    const totalWaste = 500 * recyclingMultiplier * wasteReductionMultiplier;

    const total = totalEnergy + totalTransport + totalFood + totalWaste;
    const averageHousehold = 4800; // kg CO2 per year

    return {
      breakdown: [
        { name: 'Energy', value: Math.round(totalEnergy), color: '#ef4444' },
        { name: 'Transport', value: Math.round(totalTransport), color: '#3b82f6' },
        { name: 'Food', value: Math.round(totalFood), color: '#22c55e' },
        { name: 'Waste', value: Math.round(totalWaste), color: '#f59e0b' }
      ],
      total: Math.round(total),
      comparison: Math.round(((total - averageHousehold) / averageHousehold) * 100),
      averageHousehold
    };
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      const calculatedResults = calculateCarbon();
      setResults(calculatedResults);
      setCurrentStep(4);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (category: string, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof CarbonData],
        [field]: value
      }
    }));
  };

  const steps = [
    {
      title: 'Energy Usage',
      icon: <Home className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div>
            <Label htmlFor="electricity">Monthly Electricity Usage (kWh)</Label>
            <Input
              id="electricity"
              type="number"
              value={data.energy.electricity}
              onChange={(e) => updateData('energy', 'electricity', parseFloat(e.target.value) || 0)}
              placeholder="e.g., 300"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="gas">Monthly Gas Usage (cubic meters)</Label>
            <Input
              id="gas"
              type="number"
              value={data.energy.gas}
              onChange={(e) => updateData('energy', 'gas', parseFloat(e.target.value) || 0)}
              placeholder="e.g., 100"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="heating">Primary Heating Source</Label>
            <Select value={data.energy.heating} onValueChange={(value) => updateData('energy', 'heating', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select heating type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gas">Natural Gas</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="oil">Oil</SelectItem>
                <SelectItem value="renewable">Renewable Energy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    },
    {
      title: 'Transportation',
      icon: <Car className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div>
            <Label htmlFor="carMiles">Weekly Car Miles</Label>
            <Input
              id="carMiles"
              type="number"
              value={data.transport.carMiles}
              onChange={(e) => updateData('transport', 'carMiles', parseFloat(e.target.value) || 0)}
              placeholder="e.g., 200"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="carType">Car Type</Label>
            <Select value={data.transport.carType} onValueChange={(value) => updateData('transport', 'carType', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select car type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="petrol">Petrol</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="suv">SUV/Large Vehicle</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="flights">Annual Flights</Label>
            <Input
              id="flights"
              type="number"
              value={data.transport.flights}
              onChange={(e) => updateData('transport', 'flights', parseFloat(e.target.value) || 0)}
              placeholder="e.g., 4"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="publicTransport">Weekly Public Transport Hours</Label>
            <Input
              id="publicTransport"
              type="number"
              value={data.transport.publicTransport}
              onChange={(e) => updateData('transport', 'publicTransport', parseFloat(e.target.value) || 0)}
              placeholder="e.g., 5"
              className="mt-2"
            />
          </div>
        </div>
      )
    },
    {
      title: 'Food & Diet',
      icon: <Utensils className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div>
            <Label htmlFor="meatFrequency">How often do you eat meat?</Label>
            <Select value={data.food.meatFrequency} onValueChange={(value) => updateData('food', 'meatFrequency', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Few times a week</SelectItem>
                <SelectItem value="monthly">Few times a month</SelectItem>
                <SelectItem value="never">Never (Vegetarian/Vegan)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="localFood">Do you buy local food?</Label>
            <Select value={data.food.localFood} onValueChange={(value) => updateData('food', 'localFood', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="always">Always</SelectItem>
                <SelectItem value="sometimes">Sometimes</SelectItem>
                <SelectItem value="rarely">Rarely</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="organicFood">Do you buy organic food?</Label>
            <Select value={data.food.organicFood} onValueChange={(value) => updateData('food', 'organicFood', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="always">Always</SelectItem>
                <SelectItem value="sometimes">Sometimes</SelectItem>
                <SelectItem value="rarely">Rarely</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    },
    {
      title: 'Waste & Recycling',
      icon: <Trash2 className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div>
            <Label htmlFor="recycling">How much do you recycle?</Label>
            <Select value={data.waste.recycling} onValueChange={(value) => updateData('waste', 'recycling', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="always">Always</SelectItem>
                <SelectItem value="sometimes">Sometimes</SelectItem>
                <SelectItem value="rarely">Rarely</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="wasteReduction">Do you try to reduce waste?</Label>
            <Select value={data.waste.wasteReduction} onValueChange={(value) => updateData('waste', 'wasteReduction', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High effort</SelectItem>
                <SelectItem value="medium">Medium effort</SelectItem>
                <SelectItem value="low">Low effort</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    }
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-sm font-medium">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-eco-50 to-eco-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Leaf className="w-16 h-16 text-eco-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Carbon Footprint</h1>
            <p className="text-xl text-gray-600">Annual household emissions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-eco-600" />
                  Total Emissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">{results.total}</div>
                  <div className="text-lg text-gray-600 mb-4">kg CO₂ per year</div>
                  <div className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${
                    results.comparison < 0 ? 'bg-eco-100 text-eco-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {results.comparison < 0 ? `${Math.abs(results.comparison)}% below` : `${results.comparison}% above`} average
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Emissions Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={results.breakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {results.breakdown.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value} kg CO₂`, 'Annual Emissions']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="animate-fade-in mb-8">
            <CardHeader>
              <CardTitle>Category Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={results.breakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`${value} kg CO₂`, 'Annual Emissions']} />
                  <Bar dataKey="value" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="animate-fade-in mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.breakdown.map((category: any, index: number) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">{category.name}</h4>
                    <p className="text-sm text-gray-600">
                      {category.name === 'Energy' && 'Switch to renewable energy, improve home insulation, use LED bulbs'}
                      {category.name === 'Transport' && 'Walk, cycle, use public transport, consider electric vehicles'}
                      {category.name === 'Food' && 'Eat less meat, buy local and seasonal produce, reduce food waste'}
                      {category.name === 'Waste' && 'Reduce, reuse, recycle, compost organic waste, buy less packaging'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mb-8">
            <FeedbackForm />
          </div>

          <div className="text-center mt-8">
            <Button onClick={() => { setResults(null); setCurrentStep(0); }} className="bg-eco-600 hover:bg-eco-700">
              Calculate Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-50 to-eco-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Leaf className="w-16 h-16 text-eco-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Carbon Footprint Calculator</h1>
          <p className="text-xl text-gray-600">Calculate your household's environmental impact</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-700">Step {currentStep + 1} of 4</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(((currentStep + 1) / 4) * 100)}%</span>
          </div>
          <Progress value={((currentStep + 1) / 4) * 100} className="h-2" />
        </div>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {steps[currentStep].icon}
              {steps[currentStep].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {steps[currentStep].content}
            
            <div className="flex justify-between mt-8">
              <Button 
                onClick={handlePrevious} 
                disabled={currentStep === 0}
                variant="outline"
              >
                Previous
              </Button>
              <Button 
                onClick={handleNext}
                className="bg-eco-600 hover:bg-eco-700"
              >
                {currentStep === 3 ? 'Calculate Results' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarbonCalculator;
