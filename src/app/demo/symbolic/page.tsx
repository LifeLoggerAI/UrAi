'use client';

import { SymbolicAIDemo } from '@/components/symbolic-ai-demo';
import { SymbolicInsightsView } from '@/components/symbolic-insights-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SymbolicDemoPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Symbolic Life Tracking Demo</h1>
          <p className="text-muted-foreground text-lg">
            Advanced pattern recognition and mythic storytelling for life journeys
          </p>
        </div>

        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="insights">Symbolic Insights View</TabsTrigger>
            <TabsTrigger value="demo">AI Flow Demo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights">
            <SymbolicInsightsView />
          </TabsContent>
          
          <TabsContent value="demo">
            <SymbolicAIDemo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}