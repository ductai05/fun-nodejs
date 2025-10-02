"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check localStorage or system preference
    const theme = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = theme === "dark" || (!theme && systemDark);
    
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}

interface DiaryEntry {
  _id: string;
  title: string;
  content: string;
  authorName: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDiary, setEditingDiary] = useState<DiaryEntry | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchDiaries();
    }
  }, [session]);

  const fetchDiaries = async () => {
    try {
      const response = await fetch("/api/diaries");
      const data = await response.json();
      setDiaries(data.diaries || []);
    } catch (error) {
      console.error("Error fetching diaries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingDiary) {
        const response = await fetch(`/api/diaries/${editingDiary._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          fetchDiaries();
          closeModal();
        }
      } else {
        const response = await fetch("/api/diaries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          fetchDiaries();
          closeModal();
        }
      }
    } catch (error) {
      console.error("Error saving diary:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa nhật ký này?")) return;

    try {
      const response = await fetch(`/api/diaries/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchDiaries();
      }
    } catch (error) {
      console.error("Error deleting diary:", error);
    }
  };

  const openModal = (diary?: DiaryEntry) => {
    if (diary) {
      setEditingDiary(diary);
      setFormData({ title: diary.title, content: diary.content });
    } else {
      setEditingDiary(null);
      setFormData({ title: "", content: "" });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDiary(null);
    setFormData({ title: "", content: "" });
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    const groupId = (session?.user as any)?.groupId;
    if (!groupId) {
      alert("Không tìm thấy thông tin nhóm");
      return;
    }

    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setShowPasswordModal(false);
        setNewPassword("");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Đã xảy ra lỗi");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            📔 Nhật Ký Nhóm
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {(session?.user as any)?.isSuperAdmin && (
              <Link
                href="/admin"
                className="text-sm px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-medium flex items-center gap-2"
              >
                🛡️ Admin Panel
              </Link>
            )}
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Xin chào, <strong className="text-indigo-600 dark:text-indigo-400">{session?.user?.name}</strong>
              {(session?.user as any)?.isGroupAdmin && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full font-semibold">
                  👑 Admin
                </span>
              )}
              {(session?.user as any)?.isSuperAdmin && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full font-semibold">
                  🛡️ Super
                </span>
              )}
            </span>
            {((session?.user as any)?.isGroupAdmin || (session?.user as any)?.isSuperAdmin) && (
              <button
                onClick={() => setShowPasswordModal(true)}
                className="text-sm px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors font-medium flex items-center gap-2"
              >
                🔑 Đổi mật khẩu nhóm
              </button>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="text-sm px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-medium"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Nhật ký của nhóm
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mã nhóm: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{(session?.user as any)?.groupId}</span>
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <span className="text-xl">✏️</span>
            Viết nhật ký mới
          </button>
        </div>

        {/* Diary List */}
        <div className="grid gap-4">
          {diaries.length === 0 ? (
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Chưa có nhật ký nào. Hãy viết nhật ký đầu tiên!
              </p>
            </div>
          ) : (
            diaries.map((diary) => (
              <div 
                key={diary._id} 
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700 group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {diary.title}
                  </h3>
                  {/* Hiển thị nút Sửa/Xóa nếu là tác giả hoặc admin */}
                  {((session?.user as any)?.id === diary.authorId || (session?.user as any)?.isGroupAdmin) && (
                    <div className="flex gap-2">
                      {(session?.user as any)?.id === diary.authorId && (
                        <button
                          onClick={() => openModal(diary)}
                          className="px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors font-medium"
                        >
                          ✏️ Sửa
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(diary._id)}
                        className="px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-medium"
                        title={(session?.user as any)?.isGroupAdmin && (session?.user as any)?.id !== diary.authorId ? "Admin có thể xóa nhật ký này" : "Xóa nhật ký"}
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4 leading-relaxed">
                  {diary.content}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="text-lg">✍️</span>
                    {diary.authorName}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🕐</span>
                    {format(new Date(diary.createdAt), "dd MMMM yyyy, HH:mm", {
                      locale: vi,
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-gray-200 dark:border-gray-700 animate-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {editingDiary ? "✏️ Chỉnh sửa nhật ký" : "📝 Viết nhật ký mới"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                  placeholder="Tiêu đề nhật ký của bạn..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nội dung
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={8}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all resize-none"
                  placeholder="Viết những suy nghĩ, cảm xúc của bạn..."
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  {editingDiary ? "💾 Cập nhật" : "✨ Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700 animate-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🔑 Đổi mật khẩu nhóm
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Nhóm: <strong className="text-indigo-600 dark:text-indigo-400">{(session?.user as any)?.groupId}</strong>
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Mật khẩu mới (tối thiểu 6 ký tự)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleChangePassword}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all font-semibold shadow-lg"
                >
                  Cập nhật
                </button>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setNewPassword("");
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
