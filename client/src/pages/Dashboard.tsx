import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Images, CheckCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";

interface FileStats {
  totalFiles: number;
  totalSize: number;
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { user, loading: authLoading } = useSupabaseAuth();
  const [stats, setStats] = useState<FileStats>({ totalFiles: 0, totalSize: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signin");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("session_id")) {
      toast.success("Zahlung erfolgreich! Willkommen bei TN Vault Premium.", {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        duration: 5000,
      });
      // URL bereinigen
      window.history.replaceState({}, '', '/dashboard');
    }

    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_files")
        .select("file_size")
        .eq("user_id", user?.id);

      if (error) throw error;

      const totalFiles = data?.length || 0;
      const totalSize = data?.reduce((sum, file) => sum + (file.file_size || 0), 0) || 0;

      setStats({ totalFiles, totalSize });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, {user.user_metadata?.full_name || user.email}!
            </h1>
            <p className="text-slate-400">Manage and organize your secure digital vault</p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-700/50 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-2">Total Files</p>
                  <p className="text-4xl font-bold text-white">
                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : stats.totalFiles}
                  </p>
                </div>
                <Images className="h-12 w-12 text-blue-400 opacity-50" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-700/50 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-2">Storage Used</p>
                  <p className="text-4xl font-bold text-white">
                    {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : formatBytes(stats.totalSize)}
                  </p>
                </div>
                <Upload className="h-12 w-12 text-purple-400 opacity-50" />
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl p-8 hover:border-blue-700/50 transition-colors">
              <div className="flex flex-col items-center text-center">
                <Upload className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Upload Files</h3>
                <p className="text-slate-400 mb-6">Add new images to your vault</p>
                <Button
                  onClick={() => navigate("/upload")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Upload Now
                </Button>
              </div>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl p-8 hover:border-purple-700/50 transition-colors">
              <div className="flex flex-col items-center text-center">
                <Images className="h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">View Gallery</h3>
                <p className="text-slate-400 mb-6">Browse all your uploaded files</p>
                <Button
                  onClick={() => navigate("/gallery")}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  View Gallery
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
