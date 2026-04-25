import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Sidebar from "@/components/Sidebar";

interface FileRecord {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  created_at: string;
}

export default function Gallery() {
  const [, navigate] = useLocation();
  const { user, loading: authLoading } = useSupabaseAuth();
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signin");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("user_files")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setFiles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId: string, filePath: string) => {
    try {
      setDeleting(fileId);
      setError(null);

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("vault-images")
        .remove([filePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("user_files")
        .delete()
        .eq("id", fileId);

      if (dbError) throw dbError;

      setFiles(files.filter((f) => f.id !== fileId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete file");
    } finally {
      setDeleting(null);
    }
  };

  const getImageUrl = (filePath: string) => {
    const { data } = supabase.storage.from("vault-images").getPublicUrl(filePath);
    return data?.publicUrl;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Gallery</h1>
          <p className="text-slate-400 mb-8">View and manage your uploaded files</p>

          {error && (
            <Alert className="mb-6 bg-red-900/20 border-red-700/50">
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          ) : files.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl p-12 text-center">
              <p className="text-slate-400 mb-4">No files uploaded yet</p>
              <Button
                onClick={() => navigate("/upload")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Upload Your First File
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file) => (
                <Card
                  key={file.id}
                  className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl overflow-hidden hover:border-blue-700/50 transition-colors group"
                >
                  {/* Image Preview */}
                  <div className="relative h-48 bg-slate-800/50 overflow-hidden">
                    <img
                      src={getImageUrl(file.file_path)}
                      alt={file.file_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* File Info */}
                  <div className="p-4">
                    <h3 className="text-white font-semibold truncate mb-1">{file.file_name}</h3>
                    <p className="text-xs text-slate-400 mb-3">
                      {formatBytes(file.file_size)} • {formatDate(file.created_at)}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <a
                        href={getImageUrl(file.file_path)}
                        download={file.file_name}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-700/50 rounded-lg transition-colors text-sm"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                      <button
                        onClick={() => handleDelete(file.id, file.file_path)}
                        disabled={deleting === file.id}
                        className="flex items-center justify-center px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-700/50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deleting === file.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <Button
              onClick={() => navigate("/upload")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Upload More Files
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
