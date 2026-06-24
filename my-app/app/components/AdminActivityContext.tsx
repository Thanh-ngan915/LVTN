"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

export interface ActivityLog {
    id: number;
    adminId: string;
    adminName: string;
    action: string;
    target: string;
    category: string;
    isRead: boolean;
    createdAt: string;
}

interface AdminActivityContextValue {
    logs: ActivityLog[];
    unreadCount: number;
    logActivity: (action: string, target: string, category?: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    clearAll: () => Promise<void>;
    refresh: () => Promise<void>;
}

const AdminActivityContext = createContext<AdminActivityContextValue | null>(null);

export function useAdminActivity() {
    const ctx = useContext(AdminActivityContext);
    if (!ctx) throw new Error("useAdminActivity must be used inside AdminActivityProvider");
    return ctx;
}

interface ProviderProps {
    children: React.ReactNode;
    adminUser: { userId: string; fullName: string } | null;
    authHeader: () => Record<string, string>;
}

export function AdminActivityProvider({ children, adminUser, authHeader }: ProviderProps) {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchLogs = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/activities", { headers: authHeader() });
            if (!res.ok) return;
            const data: ActivityLog[] = await res.json();
            setLogs(data);
            setUnreadCount(data.filter(l => !l.isRead).length);
        } catch {
            // silent fail
        }
    }, [authHeader]);

    const logActivity = useCallback(async (action: string, target: string, category = "general") => {
        if (!adminUser) return;
        try {
            await fetch("/api/admin/activities", {
                method: "POST",
                headers: authHeader(),
                body: JSON.stringify({
                    adminId: adminUser.userId,
                    adminName: adminUser.fullName,
                    action,
                    target,
                    category,
                }),
            });
            await fetchLogs();
        } catch {
            // silent fail
        }
    }, [adminUser, authHeader, fetchLogs]);

    const markAllAsRead = useCallback(async () => {
        try {
            await fetch("/api/admin/activities/read-all", { method: "PATCH", headers: authHeader() });
            setLogs(prev => prev.map(l => ({ ...l, isRead: true })));
            setUnreadCount(0);
        } catch {
            // silent fail
        }
    }, [authHeader]);

    const clearAll = useCallback(async () => {
        try {
            await fetch("/api/admin/activities", { method: "DELETE", headers: authHeader() });
            setLogs([]);
            setUnreadCount(0);
        } catch {
            // silent fail
        }
    }, [authHeader]);

    // Poll mỗi 30s để cập nhật thông báo từ các admin khác
    useEffect(() => {
        fetchLogs();
        pollRef.current = setInterval(fetchLogs, 30000);
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [fetchLogs]);

    return (
        <AdminActivityContext.Provider value={{ logs, unreadCount, logActivity, markAllAsRead, clearAll, refresh: fetchLogs }}>
            {children}
        </AdminActivityContext.Provider>
    );
}
