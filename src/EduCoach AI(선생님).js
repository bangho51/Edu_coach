//EduCoach AI(선생님)_1번 코드 

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  BookOpen, 
  FileText,
  TrendingUp,
  Menu
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "대시보드",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "과제 관리",
    url: createPageUrl("Assignments"),
    icon: ClipboardList,
  },
  {
    title: "학생 관리",
    url: createPageUrl("Students"),
    icon: Users,
  },
  {
    title: "오답 노트",
    url: createPageUrl("WrongAnswers"),
    icon: BookOpen,
  },
  {
    title: "취약점 분석",
    url: createPageUrl("WeaknessAnalysis"),
    icon: TrendingUp,
  },
  {
    title: "리포트 생성",
    url: createPageUrl("Reports"),
    icon: FileText,
  },
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Sidebar className="border-r border-indigo-100 bg-white/80 backdrop-blur-lg">
          <SidebarHeader className="border-b border-indigo-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">학습 관리 시스템</h2>
                <p className="text-xs text-gray-500">교육 플랫폼</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                메뉴
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 rounded-xl mb-1 ${
                          location.pathname === item.url ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-indigo-100 p-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">선</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">선생님</p>
                <p className="text-xs text-gray-500 truncate">학습 관리자</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-lg border-b border-indigo-100 px-6 py-4 md:hidden sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-indigo-50 p-2 rounded-lg transition-colors duration-200">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                학습 관리 시스템
              </h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}


2번 코드 

import React, { useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Users, ClipboardCheck, AlertCircle, TrendingUp } from "lucide-react";

import StatsCard from "../components/dashboard/StatsCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import PerformanceChart from "../components/dashboard/PerformanceChart";

export default function Dashboard() {
  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: () => base44.entities.Student.list(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ['assignments'],
    queryFn: () => base44.entities.Assignment.list('-created_date'),
    staleTime: 5 * 60 * 1000,
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => base44.entities.Submission.list('-submission_date'),
    staleTime: 5 * 60 * 1000,
  });

  const recentSubmissions = useMemo(() => {
    return submissions.map((sub) => {
      const student = students.find(s => s.id === sub.student_id);
      const assignment = assignments.find(a => a.id === sub.assignment_id);
      return {
        ...sub,
        student_name: student?.name || '알 수 없음',
        assignment_title: assignment?.title || '알 수 없음'
      };
    });
  }, [submissions, students, assignments]);

  const performanceData = useMemo(() => {
    const subjectStats = {};
    
    assignments.forEach(assignment => {
      if (!subjectStats[assignment.subject]) {
        subjectStats[assignment.subject] = {
          total: 0,
          completed: 0,
          correctSum: 0,
          totalProblems: 0
        };
      }
      
      const assignmentSubs = submissions.filter(s => s.assignment_id === assignment.id);
      subjectStats[assignment.subject].total += assignmentSubs.length;
      
      assignmentSubs.forEach(sub => {
        if (sub.submission_status === '제출완료' || sub.submission_status === '재제출완료') {
          subjectStats[assignment.subject].completed++;
        }
        if (sub.correct_count && assignment.total_problems) {
          subjectStats[assignment.subject].correctSum += sub.correct_count;
          subjectStats[assignment.subject].totalProblems += assignment.total_problems;
        }
      });
    });

    return Object.entries(subjectStats).map(([subject, stats]) => ({
      subject,
      completion: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
      accuracy: stats.totalProblems > 0 ? Math.round((stats.correctSum / stats.totalProblems) * 100) : 0
    }));
  }, [assignments, submissions]);

  const completedSubmissions = submissions.filter(
    s => s.submission_status === '제출완료' || s.submission_status === '재제출완료'
  ).length;
  
  const needsRetry = submissions.filter(s => s.submission_status === '재풀이필요').length;
  
  const avgCompletionRate = assignments.length > 0 && students.length > 0
    ? Math.round((completedSubmissions / (assignments.length * students.length)) * 100)
    : 0;

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h1>
          <p className="text-gray-600">학습 현황을 한눈에 확인하세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="전체 학생"
            value={students.length}
            subtitle="등록된 학생 수"
            icon={Users}
            color="blue"
            trend={8}
          />
          <StatsCard
            title="진행 중 과제"
            value={assignments.filter(a => a.status === '진행중').length}
            subtitle="현재 진행 중"
            icon={ClipboardCheck}
            color="green"
          />
          <StatsCard
            title="평균 수행률"
            value={`${avgCompletionRate}%`}
            subtitle="전체 과제 기준"
            icon={TrendingUp}
            color="purple"
            trend={5}
          />
          <StatsCard
            title="재풀이 필요"
            value={needsRetry}
            subtitle="확인 필요한 과제"
            icon={AlertCircle}
            color="orange"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <PerformanceChart data={performanceData} />
          <RecentActivity submissions={recentSubmissions.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}

3번 코드 

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatsCard({ title, value, subtitle, icon: Icon, trend, color = "blue" }) {
  const colorClasses = {
    blue: "from-blue-500 to-indigo-600",
    green: "from-green-500 to-emerald-600",
    purple: "from-purple-500 to-pink-600",
    orange: "from-orange-500 to-red-600"
  };

  return (
    <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-full transform translate-x-12 -translate-y-12`} />
      <CardContent className="p-6 relative">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-md`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2 text-sm">
            {trend > 0 ? (
              <>
                <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                <span className="text-green-600 font-medium">+{trend}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
                <span className="text-red-600 font-medium">{trend}%</span>
              </>
            )}
            <span className="text-gray-500 ml-1">지난주 대비</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

4번 코드 

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

const statusConfig = {
  "제출완료": { icon: CheckCircle, color: "bg-green-100 text-green-700 border-green-200", iconColor: "text-green-500" },
  "미제출": { icon: Clock, color: "bg-yellow-100 text-yellow-700 border-yellow-200", iconColor: "text-yellow-500" },
  "재풀이필요": { icon: AlertCircle, color: "bg-red-100 text-red-700 border-red-200", iconColor: "text-red-500" },
  "재제출완료": { icon: CheckCircle, color: "bg-blue-100 text-blue-700 border-blue-200", iconColor: "text-blue-500" }
};

export default function RecentActivity({ submissions }) {
  return (
    <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-xl">
          최근 제출 활동
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {submissions.slice(0, 5).map((submission, index) => {
            const config = statusConfig[submission.submission_status] || statusConfig["미제출"];
            const StatusIcon = config.icon;
            
            return (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.color}`}>
                    <StatusIcon className={`w-5 h-5 ${config.iconColor}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{submission.student_name}</p>
                    <p className="text-sm text-gray-500">{submission.assignment_title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${config.color} border`}>
                    {submission.submission_status}
                  </Badge>
                  {submission.submission_date && (
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(submission.submission_date), 'MM/dd HH:mm', { locale: ko })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

5번 코드 

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function PerformanceChart({ data }) {
  return (
    <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-xl">과목별 수행률</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="subject" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Bar dataKey="completion" name="완료율 (%)" fill="url(#colorBlue)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="accuracy" name="정답률 (%)" fill="url(#colorGreen)" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                <stop offset="100%" stopColor="#6366f1" stopOpacity={1}/>
              </linearGradient>
              <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
