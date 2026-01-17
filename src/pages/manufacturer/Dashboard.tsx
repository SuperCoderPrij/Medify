import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Box,
  CheckCircle,
  Scan,
  TrendingUp,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ManufacturerDashboard() {
  const stats = useQuery(api.medicines.getManufacturerStats);
  const isLoading = stats === undefined;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const statCards = [
    {
      title: "Total Medicines",
      value: stats?.totalMedicines || 0,
      icon: Box,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Active Batches",
      value: stats?.activeMedicines || 0,
      icon: CheckCircle,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      title: "Total Scans",
      value: stats?.totalScans || 0,
      icon: Scan,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      title: "Recent Reports",
      value: stats?.recentReports || 0,
      icon: AlertTriangle,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back to your manufacturer portal.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 bg-slate-800/50" />
          ))
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="contents"
          >
            {statCards.map((stat, index) => (
              <motion.div key={index} variants={item}>
                <Card className={`bg-slate-900/50 backdrop-blur-xl border ${stat.border} shadow-lg`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-400">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bg}`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <p className="text-xs text-gray-500 mt-1">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-[400px] bg-slate-800/50" />
            <Skeleton className="h-[400px] bg-slate-800/50" />
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/20 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="h-5 w-5 text-cyan-400" />
                    Scan Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center text-gray-500 border-2 border-dashed border-slate-800 rounded-lg">
                    Chart Placeholder (Recharts)
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-slate-900/50 backdrop-blur-xl border border-purple-500/20 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Activity className="h-5 w-5 text-purple-400" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                        <div className="p-2 rounded-full bg-red-500/10">
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">Potential Counterfeit Detected</h4>
                          <p className="text-xs text-gray-400 mt-1">
                            Scan reported in New York, USA. ID: #8392{i}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 ml-auto">2m ago</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}