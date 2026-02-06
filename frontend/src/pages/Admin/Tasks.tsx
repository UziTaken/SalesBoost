import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Link as LinkIcon, 
  Copy, 
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock Data based on Image 3
const TASKS = [
  {
    id: 1,
    name: "第一季度新人培训计划",
    deadline: "2024-11-28",
    students: [
      { name: "赵冬生", color: "bg-purple-100 text-purple-700" },
      { name: "刘金雪", color: "bg-purple-100 text-purple-700" }
    ],
    status: "进行中",
    statusColor: "bg-blue-50 text-blue-600 border-blue-200",
    tags: [
      { name: "新人培训", color: "bg-purple-100 text-purple-700" },
      { name: "小组", color: "bg-purple-50 text-purple-600" }
    ],
    creator: "培训主管",
    start_date: "2024-12-01",
    end_date: "2024-12-31"
  },
  {
    id: 2,
    name: "广大卡售后专项训练",
    deadline: "2024-12-05",
    students: [
      { name: "宋良程", color: "bg-gray-100 text-gray-700" },
      { name: "李四", color: "bg-gray-100 text-gray-700" }
    ],
    status: "待审核",
    statusColor: "bg-purple-50 text-purple-600 border-purple-200",
    tags: [
      { name: "团队培训", color: "bg-purple-100 text-purple-700" },
      { name: "监督", color: "bg-purple-50 text-purple-600" },
      { name: "指导", color: "bg-purple-50 text-purple-600" }
    ],
    creator: "广大经理",
    start_date: "2024-12-10",
    end_date: "2024-12-25"
  },
  {
    id: 3,
    name: "六级课友任务训练",
    deadline: "2024-12-13",
    students: [
      { name: "陈风", color: "bg-gray-100 text-gray-700" },
      { name: "张伟", color: "bg-gray-100 text-gray-700" }
    ],
    status: "待分配",
    statusColor: "bg-gray-100 text-gray-600 border-gray-200",
    tags: [
      { name: "团队", color: "bg-purple-100 text-purple-700" },
      { name: "教练", color: "bg-purple-50 text-purple-600" }
    ],
    creator: "金川L尧",
    start_date: "2024-12-20",
    end_date: "2025-01-10"
  },
  {
    id: 4,
    name: "乔汉类服务客户提升",
    created_at: "2024-11-10",
    students: [
      { name: "张飞", color: "bg-purple-100 text-purple-700" }
    ],
    status: "已结束",
    statusColor: "bg-green-50 text-green-600 border-green-200",
    tags: [
      { name: "私域提升", color: "bg-green-100 text-green-700" }
    ],
    creator: "培训主管",
    start_date: "2024-11-15",
    end_date: "2024-11-30"
  }
];

export default function AdminTasks() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">任务管理</h1>
        <p className="text-sm text-gray-500 mt-1">分类和管理学员任务</p>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="按名称搜索..." 
            className="pl-9 bg-white border-gray-200 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-3">
          <Select defaultValue="student">
            <SelectTrigger className="w-[140px] bg-white border-gray-200 rounded-lg">
              <SelectValue placeholder="请选择学员" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">请选择学员</SelectItem>
              <SelectItem value="all">全部学员</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="status">
            <SelectTrigger className="w-[140px] bg-white border-gray-200 rounded-lg">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="status">全部状态</SelectItem>
              <SelectItem value="active">进行中</SelectItem>
              <SelectItem value="pending">待审核</SelectItem>
              <SelectItem value="unassigned">待分配</SelectItem>
              <SelectItem value="completed">已结束</SelectItem>
            </SelectContent>
          </Select>

          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md rounded-lg">
            <Plus className="w-4 h-4 mr-2" />
            创建任务
          </Button>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[280px] text-gray-500 font-medium">任务名称</TableHead>
              <TableHead className="text-gray-500 font-medium">学员</TableHead>
              <TableHead className="text-gray-500 font-medium">任务状态</TableHead>
              <TableHead className="text-gray-500 font-medium">任务标签</TableHead>
              <TableHead className="text-gray-500 font-medium">创建人</TableHead>
              <TableHead className="text-gray-500 font-medium">时间范围</TableHead>
              <TableHead className="text-right text-gray-500 font-medium">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TASKS.map((task) => (
              <TableRow key={task.id} className="hover:bg-gray-50/50 border-gray-100">
                <TableCell className="py-4">
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-medium text-sm">{task.name}</span>
                    <span className="text-xs text-gray-400 mt-1">
                      {task.deadline ? `预计 ${task.deadline}` : `创建于 ${task.created_at}`}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-wrap gap-1">
                    {task.students.map((student, i) => (
                      <Badge 
                        key={i} 
                        className={`rounded-full px-2 py-0.5 text-xs font-normal border-0 hover:opacity-90 ${student.color}`}
                      >
                        {student.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="outline" className={`font-normal rounded-md border px-2.5 py-0.5 ${task.statusColor}`}>
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag, i) => (
                      <Badge 
                        key={i} 
                        className={`rounded-md px-2 py-0.5 text-xs font-normal border-0 ${tag.color}`}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 text-sm py-4">{task.creator}</TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-col text-xs text-gray-500 space-y-0.5">
                    <span>开始: {task.start_date}</span>
                    <span>结束: {task.end_date}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right py-4">
                  <div className="flex justify-end items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
