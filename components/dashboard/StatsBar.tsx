"use client";

import React, { useEffect, useState } from "react";
import { getAllStories } from "@/lib/storage/stories";
import { isWithinInterval, subDays, parseISO } from "date-fns";
import { FileText, Clock, Heart } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StatItemProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon, accent }) => (
  <div className={cn("flex items-center gap-4 p-4 rounded-card bg-surface border border-border", accent && "border-accent/30")}>
    <div className={cn("p-2.5 rounded-standard bg-surface-2", accent && "bg-accent/10 text-accent")}>
      {icon}
    </div>
    <div>
      <div className="text-2xl font-bold text-text-primary">{value}</div>
      <div className="text-xs text-text-secondary">{label}</div>
    </div>
  </div>
);

export const StatsBar: React.FC = () => {
  const [stats, setStats] = useState({ total: 0, thisWeek: 0, favorites: 0 });

  useEffect(() => {
    async function load() {
      const stories = await getAllStories();
      const now = new Date();
      const weekAgo = subDays(now, 7);
      const thisWeek = stories.filter((s) => {
        try {
          return isWithinInterval(parseISO(s.createdAt), { start: weekAgo, end: now });
        } catch {
          return false;
        }
      }).length;
      setStats({
        total: stories.length,
        thisWeek,
        favorites: stories.filter((s) => s.isFavorite).length,
      });
    }
    load();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <StatItem label="Total Stories" value={stats.total} icon={<FileText size={20} />} />
      <StatItem label="This Week" value={stats.thisWeek} icon={<Clock size={20} />} accent />
      <StatItem label="Favorites" value={stats.favorites} icon={<Heart size={20} />} />
    </div>
  );
};
