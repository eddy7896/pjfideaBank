"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { THEME_MONTHS } from "@/lib/constants";
import type { ThemeMonth } from "@/types";

interface Activity {
  id: string;
  scheduledDate: string;
  title: string;
  theme: string;
  schoolName?: string;
  description?: string;
}

interface GoogleStyleCalendarProps {
  activities?: Activity[];
  onAddActivity?: (date: number, month: number, year: number) => void;
  isAdmin?: boolean;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function GoogleStyleCalendar({
  activities = [],
  onAddActivity,
  isAdmin = false,
}: GoogleStyleCalendarProps) {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const monthTheme = THEME_MONTHS[currentMonth];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getActivitiesForDay = (day: number) => {
    return activities.filter((a) => {
      const d = new Date(a.scheduledDate);
      return d.getUTCDate() === day && d.getUTCMonth() === currentMonth && d.getUTCFullYear() === currentYear;
    });
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="space-y-4">
      {/* Header with theme */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h2>
          {monthTheme && (
            <div className="mt-1 flex items-center gap-2">
              <div
                className={`h-2 w-8 rounded-full bg-gradient-to-r ${monthTheme.gradient}`}
              />
              <p className="text-sm font-medium text-muted-foreground">
                Theme: {monthTheme.theme}
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar grid */}
      <Card className="overflow-hidden border-border/20">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-muted/30">
          {DAYS.map((day) => (
            <div
              key={day}
              className="border-b border-border/20 px-2 py-3 text-center text-xs font-semibold text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            const dayActivities = day ? getActivitiesForDay(day) : [];
            const isToday =
              day &&
              day === now.getDate() &&
              currentMonth === now.getMonth() &&
              currentYear === now.getFullYear();

            return (
              <div
                key={idx}
                className={`min-h-24 border-r border-b border-border/20 p-2 text-xs ${
                  day ? "bg-white hover:bg-muted/30" : "bg-muted/10"
                } transition-colors`}
              >
                {day && (
                  <>
                    <div
                      className={`mb-1 inline-block rounded px-1.5 py-0.5 text-xs font-semibold ${
                        isToday
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {day}
                    </div>

                    {/* Activities */}
                    <div className="space-y-1">
                      {dayActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="rounded bg-primary/10 px-1 py-0.5 text-[10px] font-medium text-primary truncate"
                          title={activity.title}
                        >
                          {activity.title}
                        </div>
                      ))}
                    </div>

                    {/* Add button for admin */}
                    {isAdmin && (
                      <button
                        onClick={() =>
                          onAddActivity?.(day, currentMonth, currentYear)
                        }
                        className="mt-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Theme description */}
      {monthTheme && (
        <Card className="border-border/20 p-4">
          <h3 className="font-semibold text-foreground">{monthTheme.theme}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {monthTheme.description}
          </p>
        </Card>
      )}
    </div>
  );
}
