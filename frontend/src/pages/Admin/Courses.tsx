import { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Clock, 
  User, 
  Camera,
  ChevronRight,
  Eye,
  Edit2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock Data based on Image 1
const CATALOG_CATEGORIES = [
  "全部课程",
  "运维联名高尔夫白金卡",
  "新客户开卡场景训练",
  "异议处理训练",
  "权益推荐场景",
  "合规话术训练",
  "白金卡销售话术",
  "Visa全币种卡",
  "腾讯视频联名卡"
];

const COURSES = [
  {
    id: 1,
    title: "新客户开卡场景训练",
    description: "针对新客户推荐口金卡的开卡场景，帮助学员掌握核心话术和销售技巧",
    author: "张明",
    time: "今天 17:29",
    category: "新客户开卡场景训练"
  },
  {
    id: 2,
    title: "异议处理训练",
    description: "客户对年费、权益等提出异议时的应对训练，提升学员解决客户疑虑的能力",
    author: "李华",
    time: "今天 15:20",
    category: "异议处理训练"
  },
  {
    id: 3,
    title: "权益推荐场景",
    description: "针对客户需求，精准推荐卡片权益的场景训练",
    author: "王芳",
    time: "昨天 23:16",
    category: "权益推荐场景"
  },
  {
    id: 4,
    title: "合规话术训练",
    description: "确保销售话术符合监管要求，避免承诺性表述",
    author: "赵强",
    time: "昨天 18:09",
    category: "合规话术训练"
  },
  {
    id: 5,
    title: "白金卡销售话术",
    description: "销冠总结的白金卡销售黄金话术库，适用于各种...",
    author: "钱伟",
    time: "昨天 14:30",
    category: "白金卡销售话术"
  },
  {
    id: 6,
    title: "新客户开卡场景训练",
    description: "百夫长卡开卡场景训练，针对高端客户的销售...",
    author: "孙丽",
    time: "前天 09:15",
    category: "新客户开卡场景训练"
  }
];

// Mock Data based on Image 2
const ROLES = [
  {
    id: 1,
    name: "刘先生",
    description: "27岁，互联网行业程序员，商旅流求高",
    author: "张明",
    time: "今天 17:29"
  },
  {
    id: 2,
    name: "王女士",
    description: "35岁，金融行业，有家庭，关注子女教育",
    author: "李华",
    time: "今天 15:20"
  },
  {
    id: 3,
    name: "李总",
    description: "42岁，企业高管，追求高端服务和品质",
    author: "王芳",
    time: "昨天 23:16"
  },
  {
    id: 4,
    name: "张小姐",
    description: "29岁，设计师，注重生活品质和消费体验",
    author: "赵强",
    time: "昨天 18:09"
  }
];

export default function AdminCourses() {
  const [activeTab, setActiveTab] = useState("custom");
  const [selectedCategory, setSelectedCategory] = useState("全部课程");

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">课程管理</h1>
            <p className="text-sm text-gray-500 mt-1">管理培训课程和内容</p>
          </div>
        </div>

        {/* Tabs & Actions */}
        <div className="flex items-center justify-between border-b border-gray-200">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between w-full mb-px">
              <TabsList className="bg-transparent p-0 h-auto space-x-6">
                <TabsTrigger 
                  value="catalog"
                  className="bg-transparent border-b-2 border-transparent px-2 py-3 rounded-none text-gray-500 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none font-medium"
                >
                  目录
                </TabsTrigger>
                <TabsTrigger 
                  value="custom"
                  className="bg-transparent border-b-2 border-transparent px-2 py-3 rounded-none text-gray-500 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none font-medium"
                >
                  定制课程
                </TabsTrigger>
                <TabsTrigger 
                  value="roles"
                  className="bg-transparent border-b-2 border-transparent px-2 py-3 rounded-none text-gray-500 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none font-medium"
                >
                  定制角色
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left Sidebar (Only for Course Tabs) */}
        {activeTab !== 'roles' && (
          <div className="w-64 flex-shrink-0 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <span className="font-medium text-gray-700">目录</span>
              <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer" />
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {CATALOG_CATEGORIES.map((cat, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-3 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-600' 
                      : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  <span className="truncate">{cat}</span>
                  {selectedCategory === cat && <ChevronRight className="w-4 h-4" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right Grid Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Filters Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Select defaultValue="creator">
                <SelectTrigger className="w-[140px] bg-white border-gray-200">
                  <SelectValue placeholder="请选择创建人" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="creator">请选择创建人</SelectItem>
                  <SelectItem value="admin">管理员</SelectItem>
                </SelectContent>
              </Select>
              
              {activeTab === 'roles' && (
                <Select defaultValue="type">
                  <SelectTrigger className="w-[140px] bg-white border-gray-200">
                    <SelectValue placeholder="课程类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="type">课程类型</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              {activeTab === 'roles' ? '定制角色' : '新建课程'}
            </Button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            {activeTab === 'roles' ? (
              // Role Cards
              ROLES.map((role) => (
                <Card key={role.id} className="overflow-hidden border-gray-200 hover:shadow-lg transition-shadow duration-200 group">
                  <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-purple-600">
                      <Camera className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{role.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 h-10 mb-4">{role.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{role.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{role.time}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 border-gray-200 text-gray-600 hover:text-purple-600 hover:border-purple-200">
                        <Edit2 className="w-4 h-4 mr-2" />
                        编辑
                      </Button>
                      <Button variant="outline" className="flex-1 border-gray-200 text-gray-600 hover:text-purple-600 hover:border-purple-200">
                        <Eye className="w-4 h-4 mr-2" />
                        详情
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Course Cards
              COURSES.map((course) => (
                <Card key={course.id} className="overflow-hidden border-gray-200 hover:shadow-lg transition-shadow duration-200 group">
                  <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-purple-600">
                      <Camera className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 h-10 mb-4">{course.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{course.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{course.time}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Button className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs px-0 col-span-1">
                        去试用
                      </Button>
                      <Button variant="outline" className="border-gray-200 text-gray-600 text-xs px-0 col-span-1">
                        编辑
                      </Button>
                      <Button variant="outline" className="border-gray-200 text-gray-600 text-xs px-0 col-span-1">
                        预览
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
