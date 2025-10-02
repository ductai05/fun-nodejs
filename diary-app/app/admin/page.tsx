"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  _id: string;
  name: string;
  email: string;
  groupId: string;
  isGroupAdmin: boolean;
  isSuperAdmin: boolean;
  createdAt: string;
}

interface Group {
  _id: string;
  groupId: string;
  adminName: string;
  memberCount: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "groups">("users");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated" && !(session?.user as any)?.isSuperAdmin) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    if ((session?.user as any)?.isSuperAdmin) {
      fetchData();
    }
  }, [session, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "users") {
        const response = await fetch("/api/admin/users");
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        const response = await fetch("/api/admin/groups");
        const data = await response.json();
        setGroups(data.groups || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa user "${userName}"?`)) return;

    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        fetchData();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Đã xảy ra lỗi");
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm(`Bạn có chắc muốn xóa nhóm "${groupId}"?`)) return;

    try {
      const response = await fetch("/api/admin/groups", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        fetchData();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("Đã xảy ra lỗi");
    }
  };

  const toggleSuperAdmin = async (userId: string, currentStatus: boolean) => {
    if (!confirm(`Bạn có chắc muốn ${currentStatus ? "gỡ" : "cấp"} quyền Super Admin?`)) return;

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          updates: { isSuperAdmin: !currentStatus },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        fetchData();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Đã xảy ra lỗi");
    }
  };

  const handleChangePassword = (groupId: string) => {
    setSelectedGroupId(groupId);
    setNewPassword("");
    setShowPasswordModal(true);
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    // Xác nhận một lần nữa
    if (!confirm(`Bạn có chắc muốn đổi mật khẩu nhóm "${selectedGroupId}"?\n\n⚠️ Lưu ý: Mật khẩu mới sẽ là:\n"${newPassword}"\n\nHãy ghi nhớ mật khẩu này!`)) {
      return;
    }

    try {
      const response = await fetch(`/api/groups/${selectedGroupId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ ${data.message}\n\n📝 Mật khẩu mới của nhóm "${selectedGroupId}" là:\n"${newPassword}"\n\nHãy lưu lại mật khẩu này!`);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!(session?.user as any)?.isSuperAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
              🛡️ Super Admin Panel
            </h1>
            <span className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full font-semibold">
              ADMIN
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm px-4 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors font-medium"
            >
              ← Quay lại Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "users"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300"
            }`}
          >
            👥 Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("groups")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "groups"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300"
            }`}
          >
            🏢 Groups ({groups.length})
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Tên</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Nhóm</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Quyền</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Ngày tạo</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-md">
                          {user.groupId}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-1">
                          {user.isSuperAdmin && (
                            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md text-xs font-semibold">
                              🛡️ Super Admin
                            </span>
                          )}
                          {user.isGroupAdmin && (
                            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-md text-xs font-semibold">
                              👑 Group Admin
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => toggleSuperAdmin(user._id, user.isSuperAdmin)}
                            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                              user.isSuperAdmin
                                ? "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-100"
                                : "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100"
                            }`}
                          >
                            {user.isSuperAdmin ? "Gỡ Admin" : "Cấp Admin"}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id, user.name)}
                            className="px-3 py-1.5 text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-medium"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Groups Tab */}
        {activeTab === "groups" && (
          <div className="grid gap-4">
            {groups.map((group) => (
              <div
                key={group._id}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      🏢 {group.groupId}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p>👑 Admin: <strong>{group.adminName}</strong></p>
                      <p>👥 Thành viên: <strong>{group.memberCount}</strong></p>
                      <p>📅 Ngày tạo: <strong>{new Date(group.createdAt).toLocaleDateString("vi-VN")}</strong></p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleChangePassword(group.groupId)}
                      className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors font-medium"
                    >
                      🔑 Đổi mật khẩu
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group.groupId)}
                      className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-medium"
                    >
                      🗑️ Xóa nhóm
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🔑 Đổi mật khẩu nhóm
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Nhóm: <strong>{selectedGroupId}</strong>
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mật khẩu mới (tối thiểu 6 ký tự)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleUpdatePassword}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all font-semibold shadow-lg"
                >
                  Cập nhật
                </button>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-semibold"
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
