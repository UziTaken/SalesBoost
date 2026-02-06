import { useEffect, useState } from 'react';
import { 
  RotateCw, 
  TrendingUp, 
  Award, 
  Clock, 
  Search, 
  Download,
  Eye,
  MoreHorizontal
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getHistory } from '@/services/mockData';
import { HistoryRecord, HistoryStats } from '@/types/business';
import { StatCard } from '@/components/dashboard/StatCard';

export default function StudentHistory() {
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getHistory();
        setStats(data.stats);
        setRecords(data.records);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">历史记录</h1>
        <p className="text-sm text-gray-500 mt-1">查看所有练习记录</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="总训练次数" 
            value={stats.totalRehearsals} 
            subtitle="累计训练记录" 
            icon={RotateCw}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-100"
          />
          <StatCard 
            title="平均分数" 
            value={stats.averageScore} 
            subtitle="保持进步" 
            icon={TrendingUp}
            iconColor="text-blue-500"
            iconBgColor="bg-blue-100"
          />
          <StatCard 
            title="最高分数" 
            value={stats.bestScore} 
            subtitle="优秀表现" 
            icon={Award}
            iconColor="text-green-500"
            iconBgColor="bg-green-100"
          />
          <StatCard 
            title="总练习时长" 
            value={stats.totalDurationMinutes} 
            subtitle="分钟" 
            icon={Clock}
            iconColor="text-orange-500"
            iconBgColor="bg-orange-100"
          />
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        <div className="relative w-full sm:w-[350px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="搜索课程名称、客户名称、类别..." 
            className="pl-9 bg-white border-gray-200 rounded-lg"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
           <Select>
            <SelectTrigger className="w-[120px] bg-white border-gray-200">
              <SelectValue placeholder="个别时间" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部时间</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[120px] bg-white border-gray-200">
              <SelectValue placeholder="个别分数" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分数</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2 border-gray-200 text-gray-600">
            <Download className="w-4 h-4" />
            导出
          </Button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[200px]">日期时间</TableHead>
              <TableHead className="w-[200px]">课程信息</TableHead>
              <TableHead className="w-[200px]">客户角色</TableHead>
              <TableHead>类别</TableHead>
              <TableHead>时长</TableHead>
              <TableHead>得分</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id} className="hover:bg-gray-50/50 border-gray-100">
                <TableCell className="py-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock className="w-4 h-4 text-gray-300" />
                    <div className="flex flex-col">
                      <span>{record.dateTime.split(' ')[0]}</span>
                      <span className="text-xs text-gray-400">{record.dateTime.split(' ')[1]}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-gray-900 py-4">{record.courseName}</TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{record.customerName}</span>
                    <span className="text-xs text-gray-500">{record.customerRole}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                   <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100 font-normal border-0">
                     {record.category}
                   </Badge>
                </TableCell>
                <TableCell className="text-gray-500 text-sm py-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-300" />
                    {record.duration}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold border
                    ${record.score >= 90 
                      ? 'bg-green-50 text-green-600 border-green-100' 
                      : record.score >= 80 
                        ? 'bg-blue-50 text-blue-600 border-blue-100'
                        : 'bg-orange-50 text-orange-600 border-orange-100'
                    }
                  `}>
                    {record.score}
                  </div>
                </TableCell>
                <TableCell className="text-right py-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900 gap-1 rounded-full px-3">
                      <Eye className="w-4 h-4" /> 查看详情
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 rounded-full">
                      <RotateCw className="w-4 h-4" />
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
