
'use client';

import { useEffect, useState } from 'react';
import type { DashboardData } from '@/lib/types';
import { getDashboardDataAction } from '@/app/actions';
import { useAuth } from './auth-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent } from './ui/chart';
import { Eye, BotMessageSquare, NotebookPen, Users } from 'lucide-react';

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Memories</CardTitle>
                        <BotMessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-1/2" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dreams Logged</CardTitle>
                        <NotebookPen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-1/2" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">People Tracked</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-1/2" />
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Sentiment Over Time</CardTitle>
                    <CardDescription>30-day sentiment trend from your memories and dreams.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[250px] w-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Emotion Breakdown</CardTitle>
                    <CardDescription>Most frequent emotions from your entries.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[250px] w-full" />
                </CardContent>
            </Card>
        </div>
    )
}


export function DashboardView() {
    const { user } = useAuth();
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            getDashboardDataAction(user.uid)
                .then(result => {
                    if (result.data) {
                        setData(result.data);
                    } else {
                        setError(result.error || "Failed to load data.");
                    }
                })
                .catch(err => {
                    console.error(err);
                    setError("An unexpected error occurred.");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [user]);

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return <div className="text-center py-12 text-destructive-foreground bg-destructive/80 rounded-lg p-4">{error}</div>;
    }

    if (!data || (data.stats.totalMemories === 0 && data.stats.totalDreams === 0)) {
        return (
             <div className="text-center text-muted-foreground py-16 px-4 bg-card border rounded-lg animate-fadeIn">
                <Eye className="mx-auto h-12 w-12 text-primary/50" />
                <h3 className="mt-4 text-lg font-medium text-foreground">Your Dashboard Awaits</h3>
                <p className="mt-1 text-sm">Log some memories or dreams to see your personal insights here.</p>
            </div>
        )
    }

    const chartConfig = {
        sentiment: { label: "Sentiment", color: "hsl(var(--chart-1))" },
    };

    const emotionChartConfig = data.emotionBreakdown.reduce((acc, emotion, index) => {
        acc[emotion.name] = {
            label: emotion.name,
            color: `hsl(var(--chart-${(index % 5) + 1}))`
        }
        return acc;
    }, {} as any);

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Memories</CardTitle>
                        <BotMessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.stats.totalMemories}</div>
                         <p className="text-xs text-muted-foreground">in the last 30 days</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Dreams Logged</CardTitle>
                        <NotebookPen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.stats.totalDreams}</div>
                         <p className="text-xs text-muted-foreground">in the last 30 days</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">People Tracked</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.stats.totalPeople}</div>
                         <p className="text-xs text-muted-foreground">in your constellation</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Sentiment Over Time</CardTitle>
                    <CardDescription>30-day sentiment trend from your memories and dreams.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <LineChart data={data.sentimentOverTime} margin={{ left: -20, right: 20 }}>
                            <CartesianGrid vertical={false} />
                             <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                             <YAxis domain={[-1, 1]} tickLine={false} axisLine={false} tickMargin={8} />
                            <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                            <Line dataKey="sentiment" type="monotone" stroke="var(--color-sentiment)" strokeWidth={2} dot={true} />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Emotion Breakdown</CardTitle>
                    <CardDescription>Most frequent emotions from your entries in the last 30 days.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={emotionChartConfig} className="h-[250px] w-full">
                         <BarChart data={data.emotionBreakdown} layout="vertical" margin={{ left: 10, right: 10 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={4} width={80} />
                            <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                            <Bar dataKey="count" fill="var(--color-value)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

        </div>
    );
}
