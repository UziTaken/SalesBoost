import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, Users, Trophy, Activity, ChevronRight } from "lucide-react";

// Mock Data based on Image 4
const KPI_DATA = [
  {
    title: "参与团队",
    value: "6",
    subtext: "个销售团队",
    icon: Users,
    iconColor: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    title: "总参与人数",
    value: "103",
    subtext: "名学员",
    icon: Users,
    iconColor: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    title: "平均得分",
    value: "84.5",
    subtext: "整体水平良好",
    icon: Trophy,
    iconColor: "text-green-600",
    bg: "bg-green-50"
  },
  {
    title: "总训练次数",
    value: "1839",
    subtext: "累计训练",
    icon: Activity,
    iconColor: "text-orange-600",
    bg: "bg-orange-50"
  }
];

const TEAM_RANKINGS = [
  {
    rank: 1,
    name: "百售一队",
    manager: "张经理",
    members: 15,
    trainings: 245,
    growth: 8.5,
    score: 92.5,
    scoreColor: "text-green-600 bg-green-50 border-green-100",
    advantages: ["话术准确度", "对应流畅度"],
    weakness: "关键问题识别",
    recommendation: "加强产品知识",
    badgeColor: "bg-yellow-400 text-white"
  },
  {
    rank: 2,
    name: "百售二队",
    manager: "李经理",
    members: 18,
    trainings: 312,
    growth: 6.2,
    score: 88.3,
    scoreColor: "text-blue-600 bg-blue-50 border-blue-100",
    advantages: ["流程执行", "语言表达"],
    weakness: "异议处理",
    recommendation: "增加实战演练",
    badgeColor: "bg-gray-400 text-white"
  },
  {
    rank: 3,
    name: "直销三队",
    manager: "王经理",
    members: 12,
    trainings: 198,
    growth: 5.8,
    score: 85.7,
    scoreColor: "text-indigo-600 bg-indigo-50 border-indigo-100",
    advantages: ["客户需求挖掘"],
    weakness: "产品匹配",
    recommendation: "促成转化",
    badgeColor: "bg-orange-400 text-white"
  }
];

export default function AdminAnalysis() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">能力分析</h1>
        <p className="text-sm text-gray-500 mt-1">查看学员能力分析数据</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {KPI_DATA.map((kpi, idx) => (
          <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{kpi.title}</p>
                <div className="text-3xl font-bold text-gray-900 mb-1">{kpi.value}</div>
                <p className="text-xs text-gray-400">{kpi.subtext}</p>
              </div>
              <div className={`p-3 rounded-xl ${kpi.bg}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.iconColor}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Ranking Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="mb-6">
          <div className="inline-block bg-gradient-to-r from-purple-50 to-indigo-50 px-3 py-1 rounded-md">
            <span className="text-purple-700 font-semibold text-sm">团队能力排行</span>
          </div>
          <p className="text-xs text-gray-400 mt-2 ml-1">按平均分数排名</p>
        </div>

        <div className="space-y-4">
          {TEAM_RANKINGS.map((team) => (
            <div key={team.rank} className="group relative bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-purple-100">
              <div className="flex items-center">
                {/* Rank Badge */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shadow-sm ${team.badgeColor} mr-6`}>
                  {team.rank}
                </div>

                {/* Team Info */}
                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Basic Info */}
                  <div className="md:col-span-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{team.name}</h3>
                      <span className="text-xs text-gray-400">负责人: {team.manager}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{team.members} 人</span>
                      <span>{team.trainings} 次训练</span>
                      <span className="text-green-600 font-medium flex items-center">
                        <ArrowUp className="w-3 h-3 mr-1" />
                        提升 {team.growth}%
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="md:col-span-3 flex justify-center md:justify-start">
                    <div className={`flex flex-col items-center justify-center w-24 h-24 rounded-2xl border ${team.scoreColor}`}>
                      <span className="text-3xl font-bold">{team.score}</span>
                      <span className="text-xs opacity-80">平均分</span>
                    </div>
                  </div>

                  {/* Analysis Tags */}
                  <div className="md:col-span-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400 w-12">优势:</span>
                      <div className="flex flex-wrap gap-2">
                        {team.advantages.map((adv, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                            {adv}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400 w-12">弱势:</span>
                      <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-700 text-xs font-medium border border-orange-100">
                        {team.weakness}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400 w-12">待提升:</span>
                      <span className="px-2 py-0.5 rounded bg-gray-50 text-gray-600 text-xs border border-gray-200">
                        {team.recommendation}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Arrow Action */}
                <div className="ml-4">
                  <Button variant="ghost" size="icon" className="text-gray-300 hover:text-purple-600 hover:bg-purple-50 rounded-full">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
