'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { CheckCircle2, Clock, Target, TrendingUp, Calendar } from "lucide-react";
import type { Task, VoiceEvent } from "@/lib/types";

interface ActionExecutionViewProps {
    tasks: Task[];
    voiceEvents: VoiceEvent[];
}

export function ActionExecutionView({ tasks, voiceEvents }: ActionExecutionViewProps) {
    // Calculate completion metrics
    const completedTasks = tasks.filter(task => task.isCompleted);
    const pendingTasks = tasks.filter(task => !task.isCompleted);
    const overdueTasks = pendingTasks.filter(task => task.dueDate && task.dueDate < Date.now());
    
    const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
    
    // Analyze effort patterns from voice events
    const actionWords = ['completed', 'finished', 'done', 'accomplished', 'achieved', 'worked on', 'started', 'began'];
    const actionEvents = voiceEvents.filter(event => 
        actionWords.some(word => event.text.toLowerCase().includes(word))
    );

    // Get recent activity
    const recentActions = actionEvents
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5);

    // Calculate productivity score based on recent completion patterns
    const recentCompletions = completedTasks.filter(task => 
        task.completedAt && task.completedAt > Date.now() - (7 * 24 * 60 * 60 * 1000) // Last week
    );
    const productivityScore = Math.min(100, (recentCompletions.length / 7) * 100); // Max 1 task per day = 100%

    return (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground">
                            {completedTasks.length} of {tasks.length} tasks
                        </p>
                        <Progress value={completionRate} className="mt-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productivityScore.toFixed(0)}</div>
                        <p className="text-xs text-muted-foreground">
                            {recentCompletions.length} completed this week
                        </p>
                        <Progress value={productivityScore} className="mt-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{overdueTasks.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {pendingTasks.length} pending total
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Recent Action Insights
                    </CardTitle>
                    <CardDescription>
                        Activity patterns detected from your voice logs
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {recentActions.length > 0 ? (
                        <div className="space-y-3">
                            {recentActions.map((event, index) => (
                                <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className={`w-2 h-2 rounded-full ${
                                            event.sentimentScore > 0.2 ? 'bg-green-500' : 
                                            event.sentimentScore < -0.2 ? 'bg-red-500' : 'bg-yellow-500'
                                        }`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium line-clamp-2">{event.text}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-xs">
                                                {event.emotion}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(event.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            <CheckCircle2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
                            <p className="mt-2">No recent action patterns detected</p>
                            <p className="text-sm">Record voice notes about your activities to see insights here</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Task Summary */}
            {tasks.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Task Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {pendingTasks.slice(0, 5).map((task) => (
                                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium">{task.title}</p>
                                        {task.dueDate && (
                                            <p className="text-sm text-muted-foreground">
                                                Due: {new Date(task.dueDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    <Badge variant={task.dueDate && task.dueDate < Date.now() ? 'destructive' : 'secondary'}>
                                        {task.dueDate && task.dueDate < Date.now() ? 'Overdue' : 'Pending'}
                                    </Badge>
                                </div>
                            ))}
                            {pendingTasks.length > 5 && (
                                <p className="text-sm text-muted-foreground text-center">
                                    +{pendingTasks.length - 5} more tasks
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}