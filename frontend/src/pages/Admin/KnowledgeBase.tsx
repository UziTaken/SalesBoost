import { useState } from 'react';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Eye, 
  FileText,
  Globe,
  Users,
  Lock,
  ArrowUp,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock Data based on Image 5
const KNOWLEDGE_BASES = [
  {
    id: 1,
    name: "信用卡产品知识库",
    count: 156,
    creator: "产品经理",
    description: "包含所有信用卡产品的详细说明、权益介绍、使用...",
    permission: "全公司",
    permissionColor: "bg-green-50 text-green-700 border-green-200",
    permissionIcon: Globe,
    updated_at: "2024-12-18"
  },
  {
    id: 2,
    name: "销售标准话术库",
    count: 89,
    creator: "培训主管",
    description: "销售话术模板、标准销售流程、常见场景应对话术",
    permission: "全公司",
    permissionColor: "bg-green-50 text-green-700 border-green-200",
    permissionIcon: Globe,
    updated_at: "2024-12-17"
  },
  {
    id: 3,
    name: "合规规范手册",
    count: 45,
    creator: "合规主管",
    description: "销售合规要求、禁用话术、风险提示规范等",
    permission: "成员可见",
    permissionColor: "bg-blue-50 text-blue-700 border-blue-200",
    permissionIcon: Users,
    updated_at: "2024-12-16"
  },
  {
    id: 4,
    name: "客户异议处理案例",
    count: 67,
    creator: "培训主管",
    description: "真实客户异议处理案例集、最佳实践分享",
    permission: "全公司",
    permissionColor: "bg-green-50 text-green-700 border-green-200",
    permissionIcon: Globe,
    updated_at: "2024-12-15"
  },
  {
    id: 5,
    name: "高端客户服务指南",
    count: 34,
    creator: "客户经理",
    description: "针对高净值客户的服务标准、沟通技巧、产品推荐...",
    permission: "成员可见",
    permissionColor: "bg-blue-50 text-blue-700 border-blue-200",
    permissionIcon: Users,
    updated_at: "2024-12-14"
  }
];

const STATS = [
  {
    label: "总知识库数",
    value: "5",
    subtext: "活跃使用中",
    trend: null
  },
  {
    label: "总知识条目",
    value: "391",
    subtext: "较上月 +23",
    trend: "up",
    trendColor: "text-green-600"
  },
  {
    label: "平均查询次数",
    value: "1,234",
    subtext: "本周",
    trend: null
  },
  {
    label: "知识准确率",
    value: "96%",
    subtext: "↑ +2%",
    trend: "up",
    trendColor: "text-green-600"
  }
];

export default function AdminKnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">知识管理</h1>
        <p className="text-sm text-gray-500 mt-1">管理知识库和资料</p>
      </div>

      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="搜索知识库..." 
            className="pl-9 bg-gray-50 border-transparent focus:bg-white transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md rounded-lg">
          <Plus className="w-4 h-4 mr-2" />
          新建知识库
        </Button>
      </div>

      {/* Knowledge Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px] text-gray-500 font-medium">名称</TableHead>
              <TableHead className="text-gray-500 font-medium">创建人</TableHead>
              <TableHead className="w-[400px] text-gray-500 font-medium">简介</TableHead>
              <TableHead className="text-gray-500 font-medium">权限范围</TableHead>
              <TableHead className="text-gray-500 font-medium">最近更新</TableHead>
              <TableHead className="text-right text-gray-500 font-medium">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {KNOWLEDGE_BASES.map((kb) => (
              <TableRow key={kb.id} className="hover:bg-gray-50/50 border-gray-100">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{kb.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{kb.count} 条记录</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 py-4">{kb.creator}</TableCell>
                <TableCell className="text-gray-500 text-sm py-4 line-clamp-1">{kb.description}</TableCell>
                <TableCell className="py-4">
                  <Badge variant="outline" className={`font-normal rounded-full px-2.5 py-0.5 gap-1.5 ${kb.permissionColor}`}>
                    <kb.permissionIcon className="w-3 h-3" />
                    {kb.permission}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-500 text-sm py-4">{kb.updated_at}</TableCell>
                <TableCell className="text-right py-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs border-gray-200 text-gray-600 hover:text-gray-900">
                      重命名
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-gray-200 text-gray-600 hover:text-gray-900">
                      权限
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {STATS.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-sm">
            <CardContent className="p-6">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
              </div>
              <div className={`text-xs mt-2 font-medium flex items-center gap-1 ${stat.trendColor || 'text-gray-400'}`}>
                {stat.trend === 'up' && <ArrowUp className="w-3 h-3" />}
                {stat.subtext}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
