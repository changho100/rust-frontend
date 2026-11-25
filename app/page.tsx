"use client";

import { useEffect, useState } from "react";

interface Friend {
  id: number;
  name: string;
  phone: string;
  group_name: string;
  memo: string;
}

const API_URL = "http://localhost:8000/api/friends";

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", group_name: "지인", memo: "" });

  const fetchFriends = async () => {
    const res = await fetch(API_URL);
    if (res.ok) setFriends(await res.json());
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ name: "", phone: "", group_name: "지인", memo: "" });
      fetchFriends();
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchFriends();
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">친구 관리</h1>

      {/* 친구 추가 폼 */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded-lg bg-gray-50">
        <input
          type="text"
          placeholder="이름 *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-2 border rounded bg-white"
          required
        />
        <input
          type="text"
          placeholder="연락처 (010-0000-0000) *"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="p-2 border rounded bg-white"
          required
        />
        <select
          value={form.group_name}
          onChange={(e) => setForm({ ...form, group_name: e.target.value })}
          className="p-2 border rounded bg-white"
        >
          <option value="지인">지인</option>
          <option value="대학동기">대학동기</option>
          <option value="회사">회사</option>
          <option value="운동">운동</option>
        </select>
        <input
          type="text"
          placeholder="메모"
          value={form.memo}
          onChange={(e) => setForm({ ...form, memo: e.target.value })}
          className="p-2 border rounded bg-white"
        />
        <button
          type="submit"
          className="md:col-span-2 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
        >
          친구 등록
        </button>
      </form>

      {/* 친구 목록 */}
      <div className="space-y-3">
        {friends.map((friend) => (
          <div key={friend.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">{friend.name}</span>
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                  {friend.group_name}
                </span>
              </div>
              <p className="text-sm text-gray-600">{friend.phone}</p>
              {friend.memo && <p className="text-sm text-gray-500 mt-1">{friend.memo}</p>}
            </div>
            <button
              onClick={() => handleDelete(friend.id)}
              className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
