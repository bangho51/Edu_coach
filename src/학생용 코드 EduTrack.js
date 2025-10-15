//학생용 코드 EduTrack_1번 코드 
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  BarChart3,
  ClipboardList,
  LogOut,
  Menu,
  HelpCircle
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
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function Layout({ children }) {
  const location = useLocation();
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const isTeacher = user?.user_type === 'teacher';

  const teacherNavigation = [
    {
      title: "대시보드",
      url: createPageUrl("TeacherDashboard"),
      icon: LayoutDashboard,
    },
    {
      title: "과제 관리",
      url: createPageUrl("Assignments"),
      icon: FileText,
    },
    {
      title: "오답 분석",
      url: createPageUrl("ErrorAnalysis"),
      icon: BookOpen,
    },
    {
      title: "리포트",
      url: createPageUrl("Reports"),
      icon: BarChart3,
    },
  ];

  const studentNavigation = [
    {
      title: "내 과제",
      url: createPageUrl("StudentDashboard"),
      icon: ClipboardList,
    },
    {
      title: "오답노트",
      url: createPageUrl("MyErrorNotes"),
      icon: BookOpen,
    },
    {
      title: "내 성적",
      url: createPageUrl("MyProgress"),
      icon: BarChart3,
    },
  ];

  const navigationItems = isTeacher ? teacherNavigation : studentNavigation;

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Sidebar className="border-r border-indigo-100 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-indigo-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">EduTrack</h2>
                <p className="text-xs text-indigo-600">
                  {isTeacher ? "선생님 모드" : "학생 모드"}
                </p>
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
                          location.pathname === item.url 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md' 
                            : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      className={`hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 rounded-xl mb-1 ${
                        location.pathname === createPageUrl("Guide")
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md' 
                          : ''
                      }`}
                    >
                      <Link to={createPageUrl("Guide")} className="flex items-center gap-3 px-4 py-3">
                        <HelpCircle className="w-5 h-5" />
                        <span className="font-medium">이용 가이드</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-indigo-100 p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {user?.full_name || '사용자'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-indigo-50 p-2 rounded-lg transition-colors">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <h1 className="text-xl font-bold text-gray-900">EduTrack</h1>
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

//2번 코드 

import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";

import PerformanceChart from "../components/dashboard/PerformanceChart";
import RecentSubmissions from "../components/dashboard/RecentSubmissions";
import WeakConceptsOverview from "../components/dashboard/WeakConceptsOverview";

export default function TeacherDashboard() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: () => base44.entities.Assignment.filter({ teacher_email: user?.email }, '-created_date'),
    enabled: !!user,
    initialData: [],
  });

  const { data: submissions, isLoading: submissionsLoading } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => base44.entities.Submission.list('-created_date', 50),
    initialData: [],
  });

  const { data: errorNotes, isLoading: errorNotesLoading } = useQuery({
    queryKey: ['errorNotes'],
    queryFn: () => base44.entities.ErrorNote.list('-created_date', 100),
    initialData: [],
  });

  // Calculate statistics
  const totalAssignments = assignments.length;
  const totalSubmissions = submissions.length;
  const completedSubmissions = submissions.filter(s => s.status === '완료').length;
  const needsReview = submissions.filter(s => s.status === '재풀이필요').length;
  const completionRate = totalSubmissions > 0 
    ? ((completedSubmissions / totalSubmissions) * 100).toFixed(1)
    : 0;

  const stats = [
    {
      title: "총 과제",
      value: totalAssignments,
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "전체 제출물",
      value: totalSubmissions,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "완료율",
      value: `${completionRate}%`,
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "재풀이 필요",
      value: needsReview,
      icon: AlertCircle,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    }
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">선생님 대시보드</h1>
          <p className="text-gray-600 mt-1">학생들의 학습 현황을 한눈에 확인하세요</p>
        </div>
        <Link to={createPageUrl("Assignments")}>
          <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg">
            <FileText className="w-4 h-4 mr-2" />
            새 과제 등록
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full transform translate-x-8 -translate-y-8`} />
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <CardTitle className="text-3xl font-bold mt-2">{stat.value}</CardTitle>
                </div>
                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PerformanceChart submissions={submissions} />
          <RecentSubmissions submissions={submissions.slice(0, 10)} />
        </div>
        
        <div className="space-y-6">
          <WeakConceptsOverview errorNotes={errorNotes} />
          
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                빠른 작업
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to={createPageUrl("Assignments")}>
                <Button variant="outline" className="w-full justify-start">
                  새 과제 등록하기
                </Button>
              </Link>
              <Link to={createPageUrl("Reports")}>
                <Button variant="outline" className="w-full justify-start">
                  리포트 생성하기
                </Button>
              </Link>
              <Link to={createPageUrl("ErrorAnalysis")}>
                <Button variant="outline" className="w-full justify-start">
                  오답 분석 보기
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

//3번 코드 

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";

export default function PerformanceChart({ submissions }) {
  // Group submissions by week
  const getWeekNumber = (date) => {
    const d = new Date(date);
    const firstDay = new Date(d.getFullYear(), 0, 1);
    const days = Math.floor((d - firstDay) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + firstDay.getDay() + 1) / 7);
  };

  const weeklyData = submissions.reduce((acc, submission) => {
    const week = `Week ${getWeekNumber(submission.created_date)}`;
    if (!acc[week]) {
      acc[week] = { week, total: 0, completed: 0, needsRetry: 0 };
    }
    acc[week].total++;
    if (submission.status === '완료') acc[week].completed++;
    if (submission.status === '재풀이필요') acc[week].needsRetry++;
    return acc;
  }, {});

  const chartData = Object.values(weeklyData).slice(-6);

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          주간 제출 현황
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="week" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Bar dataKey="completed" fill="#10b981" name="완료" radius={[8, 8, 0, 0]} />
            <Bar dataKey="needsRetry" fill="#f59e0b" name="재풀이필요" radius={[8, 8, 0, 0]} />
            <Bar dataKey="total" fill="#6366f1" name="전체" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

//4번 코드 

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, FileText } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const statusColors = {
  "미제출": "bg-gray-100 text-gray-800 border-gray-200",
  "제출완료": "bg-blue-100 text-blue-800 border-blue-200",
  "재풀이필요": "bg-orange-100 text-orange-800 border-orange-200",
  "완료": "bg-green-100 text-green-800 border-green-200"
};

export default function RecentSubmissions({ submissions }) {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          최근 제출물
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">아직 제출물이 없습니다</p>
          ) : (
            submissions.map((submission) => (
              <div 
                key={submission.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {submission.student_name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{submission.student_name}</p>
                    <p className="text-sm text-gray-500">
                      {submission.submitted_at 
                        ? format(new Date(submission.submitted_at), "PPP p", { locale: ko })
                        : '제출 대기 중'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {submission.score !== undefined && (
                    <span className="text-lg font-bold text-indigo-600">
                      {submission.score}점
                    </span>
                  )}
                  <Badge className={`${statusColors[submission.status]} border`}>
                    {submission.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

//5번 코드 

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function WeakConceptsOverview({ errorNotes }) {
  // Analyze weak concepts
  const conceptFrequency = errorNotes.reduce((acc, note) => {
    const concept = note.weak_concept || note.error_reason || '기타';
    acc[concept] = (acc[concept] || 0) + 1;
    return acc;
  }, {});

  const topWeakConcepts = Object.entries(conceptFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([concept, count]) => ({
      concept,
      count,
      percentage: (count / errorNotes.length * 100).toFixed(0)
    }));

  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-purple-500"
  ];

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          주요 취약 개념
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topWeakConcepts.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              아직 분석할 데이터가 없습니다
            </p>
          ) : (
            topWeakConcepts.map((item, index) => (
              <div key={item.concept}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {item.concept}
                  </span>
                  <span className="text-sm text-gray-500">
                    {item.count}회 ({item.percentage}%)
                  </span>
                </div>
                <Progress 
                  value={item.percentage} 
                  className="h-2"
                  indicatorClassName={colors[index]}
                />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
