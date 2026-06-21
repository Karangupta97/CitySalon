import { format, differenceInDays, addDays, isSameDay, startOfWeek, endOfWeek, subDays, eachDayOfInterval } from "date-fns"

export interface ChartDataPoint {
  label: string;
  bookings: number;
  revenue: number;
}

export interface ServiceDataPoint {
  name: string;
  bookings: number;
  revenue: number;
  percentage: number;
  color: string;
}

export interface StaffPerformanceData {
  name: string;
  bookings: number;
  revenue: number;
  rating: number;
  occupancy: number; // percentage
  color: string;
}

export interface CustomerSplitData {
  name: string;
  value: number; // percentage
  count: number;
  color: string;
}

export interface PaymentMethodData {
  name: string;
  value: number; // percentage
  amount: number;
  color: string;
}

export interface CancellationReasonData {
  reason: string;
  count: number;
  percentage: number;
  color: string;
}

export interface HeatmapHourPoint {
  day: string; // "Mon", "Tue", ...
  hour: number; // 9, 10, ... 20 (9 AM to 8 PM)
  bookings: number; // traffic density
}

export interface KPICardData {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  prevValue: string;
  sparkline: number[];
  isNegativeBetter?: boolean;
}

export interface RecentBookingData {
  id: string;
  time: string;
  name: string;
  service: string;
  stylist: string;
  amount: number;
  status: "completed" | "confirmed" | "pending" | "cancelled" | "no-show";
  date: string;
}

export interface AnalyticsDataset {
  periodLabel: string;
  chartData: ChartDataPoint[];
  kpis: {
    totalRevenue: KPICardData;
    totalBookings: KPICardData;
    newCustomers: KPICardData;
    avgBookingValue: KPICardData;
    cancellationRate: KPICardData;
    repeatCustomerRate: KPICardData;
  };
  topServices: ServiceDataPoint[];
  staffPerformance: StaffPerformanceData[];
  customerSplit: CustomerSplitData[];
  paymentSplit: PaymentMethodData[];
  cancellationReasons: CancellationReasonData[];
  heatmap: HeatmapHourPoint[];
  recentBookings: RecentBookingData[];
}

// Helper: Seeded pseudo-random generator so data stays deterministic per period
function createRandom(seedString: string) {
  let h = 0;
  for (let i = 0; i < seedString.length; i++) {
    h = Math.imul(31, h) + seedString.charCodeAt(i) | 0;
  }
  return function() {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  }
}

// ─── Base Reference Datasets ───

const STYLISTS = [
  { name: "Meena", rating: 4.9, color: "#3D5A3A" },
  { name: "Priya", rating: 4.8, color: "#7A9A6D" },
  { name: "Raj", rating: 4.7, color: "#C4A76C" },
  { name: "Anita", rating: 4.6, color: "#6E6960" }
]

const SERVICES = [
  { name: "Hair Colour", avgPrice: 1800, weight: 0.25, color: "#3D5A3A" },
  { name: "Haircut", avgPrice: 600, weight: 0.30, color: "#7A9A6D" },
  { name: "Facial", avgPrice: 1500, weight: 0.18, color: "#C4A76C" },
  { name: "Bridal", avgPrice: 6500, weight: 0.08, color: "#E8E0D6" },
  { name: "Manicure", avgPrice: 800, weight: 0.12, color: "#A3906B" },
  { name: "Beard Trim", avgPrice: 350, weight: 0.07, color: "#6E6960" }
]

const CLIENTS = [
  "Priya Sharma", "Rohit Kapoor", "Ananya Mehta", "Vikram Singh", "Deepa Nair", 
  "Kavya Reddy", "Sanjay Dutt", "Aisha Gupta", "Karan Malhotra", "Riya Sen", 
  "Rahul Bose", "Neha Dhupia", "Amit Patel", "Sneha Rao", "Divya Teja"
]

const FESTIVAL_PRESETS: Record<string, { label: string; start: Date; end: Date; multiplier: number }> = {
  diwali: {
    label: "Diwali Season (Oct 28 - Nov 03)",
    start: new Date(2026, 9, 28),
    end: new Date(2026, 10, 3),
    multiplier: 2.8
  },
  eid: {
    label: "Eid Festive Week (Apr 10 - Apr 15)",
    start: new Date(2026, 3, 10),
    end: new Date(2026, 3, 15),
    multiplier: 2.1
  },
  christmas: {
    label: "Christmas & New Year (Dec 24 - Jan 01)",
    start: new Date(2026, 11, 24),
    end: new Date(2027, 0, 1),
    multiplier: 2.4
  },
  wedding: {
    label: "Wedding Peak Season (Nov 15 - Nov 30)",
    start: new Date(2026, 10, 15),
    end: new Date(2026, 10, 30),
    multiplier: 2.5
  },
  holi: {
    label: "Holi Celebrations (Mar 10 - Mar 14)",
    start: new Date(2026, 2, 10),
    end: new Date(2026, 2, 14),
    multiplier: 1.8
  }
}

// ─── Hourly Traffic Curve Generator ───
// Returns multiplier of traffic for each hour of day
function getHourlyTrafficMultiplier(hour: number): number {
  if (hour < 8 || hour >= 21) return 0; // closed
  if (hour === 8 || hour === 9) return 0.2; // morning slow
  if (hour === 10 || hour === 11) return 0.6;
  if (hour === 12 || hour === 13) return 1.0; // lunch peak
  if (hour === 14 || hour === 15) return 0.5; // afternoon slow
  if (hour === 16 || hour === 17) return 0.8;
  if (hour === 18 || hour === 19) return 1.2; // evening peak
  if (hour === 20) return 0.3; // winding down
  return 0;
}

// Day of week multiplier (Saturday/Sunday are highest)
function getDayOfWeekMultiplier(dayIndex: number): number {
  if (dayIndex === 0) return 0.5; // Sunday short hours / slow
  if (dayIndex === 6) return 1.8; // Saturday peak
  if (dayIndex === 5) return 1.4; // Friday high
  return 0.9; // Mon-Thu average
}

// ─── Main Generator Logic ───

export function getAnalyticsData(period: string, subOption?: string, customRange?: { start?: Date; end?: Date }): AnalyticsDataset {
  const rand = createRandom(period + (subOption || "") + (customRange?.start?.toISOString() || ""));

  let periodLabel = "";
  let chartData: ChartDataPoint[] = [];
  let baseMultiplier = 1.0;

  // Decide date intervals & title based on period
  if (period === "day") {
    // 24 hourly data points
    const dateStr = subOption || format(new Date(), "yyyy-MM-dd");
    const parsedDate = new Date(dateStr);
    const dayName = format(parsedDate, "EEEE, MMMM d, yyyy");
    periodLabel = `Hourly Performance: ${dayName}`;
    const dayOfWeek = parsedDate.getDay();
    baseMultiplier = getDayOfWeekMultiplier(dayOfWeek);

    for (let h = 0; h < 24; h++) {
      const mult = getHourlyTrafficMultiplier(h);
      if (mult > 0) {
        // Add pseudo-randomness
        const variation = 0.8 + rand() * 0.4;
        const bookings = Math.round(mult * 2.5 * baseMultiplier * variation);
        const revenue = Math.round(bookings * 950 * (0.9 + rand() * 0.2));
        chartData.push({
          label: `${h.toString().padStart(2, '0')}:00`,
          bookings,
          revenue
        });
      } else {
        chartData.push({ label: `${h.toString().padStart(2, '0')}:00`, bookings: 0, revenue: 0 });
      }
    }
  } 
  else if (period === "week") {
    // 7 daily data points
    // Let's find the start and end of the current week (or selectable)
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const end = endOfWeek(today, { weekStartsOn: 1 });
    periodLabel = `Weekly Range: ${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    days.forEach((day, index) => {
      const dowMult = getDayOfWeekMultiplier(index === 6 ? 0 : index + 1); // fix Sunday index mapping
      const variation = 0.9 + rand() * 0.3;
      const bookings = Math.round(15 * dowMult * variation);
      const revenue = Math.round(bookings * 850 * (0.95 + rand() * 0.15));
      chartData.push({
        label: day,
        bookings,
        revenue
      });
    });
  } 
  else if (period === "month") {
    // 30 days
    const today = new Date();
    const monthName = format(today, "MMMM yyyy");
    periodLabel = `Monthly Statement: ${monthName}`;
    
    // We create weekly groupings or daily listings. The request mentions "28–31 daily data points with weekday/weekend patterns"
    const totalDays = 30;
    for (let d = 1; d <= totalDays; d++) {
      const dummyDate = new Date(2026, 5, d); // simulate June 2026
      const dow = dummyDate.getDay();
      const dowMult = getDayOfWeekMultiplier(dow);
      const variation = 0.85 + rand() * 0.3;
      const bookings = Math.round(14 * dowMult * variation);
      const revenue = Math.round(bookings * 870 * (0.9 + rand() * 0.2));
      chartData.push({
        label: `Jun ${d.toString().padStart(2, '0')}`,
        bookings,
        revenue
      });
    }
  } 
  else if (period === "quarter") {
    // Quarter aggregates: Q1-Q4 selector. Let's return monthly aggregates.
    const quarter = subOption || "Q2";
    periodLabel = `Quarterly Performance: ${quarter} 2026`;
    
    let months: string[] = [];
    let qMultiplier = 1.0;
    if (quarter === "Q1") {
      months = ["Jan", "Feb", "Mar"];
      qMultiplier = 0.9; // Winter start
    } else if (quarter === "Q2") {
      months = ["Apr", "May", "Jun"];
      qMultiplier = 1.1; // Spring peak
    } else if (quarter === "Q3") {
      months = ["Jul", "Aug", "Sep"];
      qMultiplier = 1.0; // Monsoon moderate
    } else {
      months = ["Oct", "Nov", "Dec"];
      qMultiplier = 1.4; // Wedding/Festival winter peak
    }

    months.forEach((m) => {
      const variation = 0.95 + rand() * 0.1;
      const bookings = Math.round(380 * qMultiplier * variation);
      const revenue = Math.round(bookings * 890 * (0.95 + rand() * 0.1));
      chartData.push({
        label: m,
        bookings,
        revenue
      });
    });
  } 
  else if (period === "year") {
    // 12 months with festival spikes
    periodLabel = "Yearly Analytics Overview: 2026";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    months.forEach((m, idx) => {
      let festMult = 1.0;
      // Oct-Nov (Diwali), Dec (New Year/Wedding), Mar (Holi/Wedding)
      if (m === "Mar") festMult = 1.25;
      else if (m === "Oct") festMult = 1.4;
      else if (m === "Nov") festMult = 1.6;
      else if (m === "Dec") festMult = 1.55;
      
      const variation = 0.9 + rand() * 0.2;
      const bookings = Math.round(320 * festMult * variation);
      const revenue = Math.round(bookings * 910 * (0.92 + rand() * 0.16));
      chartData.push({
        label: m,
        bookings,
        revenue
      });
    });
  } 
  else if (period === "festival") {
    // Indian festivals preset
    const festKey = subOption || "diwali";
    const festConf = FESTIVAL_PRESETS[festKey] || FESTIVAL_PRESETS.diwali;
    periodLabel = `Festival Campaign: ${festConf.label}`;
    baseMultiplier = festConf.multiplier;

    // Generate daily points for the festival duration (e.g. 5 to 15 days)
    const daysCount = differenceInDays(festConf.end, festConf.start) + 1;
    for (let i = 0; i < daysCount; i++) {
      const currentDay = addDays(festConf.start, i);
      const dow = currentDay.getDay();
      const dowMult = getDayOfWeekMultiplier(dow);
      
      // Peak in the middle of the festival
      const middleIdx = Math.floor(daysCount / 2);
      const distFromCenter = Math.abs(i - middleIdx);
      const peakMult = 1.5 - (distFromCenter / daysCount) * 0.8;

      const variation = 0.9 + rand() * 0.25;
      const bookings = Math.round(18 * baseMultiplier * dowMult * peakMult * variation);
      const revenue = Math.round(bookings * 980 * (0.95 + rand() * 0.1));
      chartData.push({
        label: format(currentDay, "MMM dd"),
        bookings,
        revenue
      });
    }
  } 
  else if (period === "custom") {
    // Custom range date picker
    const start = customRange?.start || subDays(new Date(), 30);
    const end = customRange?.end || new Date();
    periodLabel = `Custom Interval: ${format(start, "MMM d, yyyy")} - ${format(end, "MMM d, yyyy")}`;

    const daysCount = differenceInDays(end, start) + 1;

    if (daysCount <= 1) {
      // 1 day range -> return hourly
      baseMultiplier = getDayOfWeekMultiplier(start.getDay());
      for (let h = 0; h < 24; h++) {
        const mult = getHourlyTrafficMultiplier(h);
        if (mult > 0) {
          const bookings = Math.round(mult * 2.8 * baseMultiplier * (0.85 + rand() * 0.3));
          const revenue = Math.round(bookings * 920 * (0.9 + rand() * 0.2));
          chartData.push({ label: `${h.toString().padStart(2, '0')}:00`, bookings, revenue });
        } else {
          chartData.push({ label: `${h.toString().padStart(2, '0')}:00`, bookings: 0, revenue: 0 });
        }
      }
    } 
    else if (daysCount <= 14) {
      // Daily breakdown
      const interval = eachDayOfInterval({ start, end });
      interval.forEach((date) => {
        const dow = date.getDay();
        const dowMult = getDayOfWeekMultiplier(dow);
        const variation = 0.9 + rand() * 0.2;
        const bookings = Math.round(15 * dowMult * variation);
        const revenue = Math.round(bookings * 860 * (0.9 + rand() * 0.2));
        chartData.push({
          label: format(date, "MMM dd"),
          bookings,
          revenue
        });
      });
    } 
    else if (daysCount <= 60) {
      // Group by every 2-3 days or weekly to avoid clutter
      const interval = eachDayOfInterval({ start, end });
      // To keep charts clear, group in 3-day bins if total points > 14
      let runningBookings = 0;
      let runningRevenue = 0;
      let groupStart = start;

      interval.forEach((date, idx) => {
        const dow = date.getDay();
        const dowMult = getDayOfWeekMultiplier(dow);
        const bookings = Math.round(14 * dowMult * (0.85 + rand() * 0.3));
        const revenue = Math.round(bookings * 880 * (0.9 + rand() * 0.2));

        runningBookings += bookings;
        runningRevenue += revenue;

        // Group every 3 days or on the last item
        if ((idx + 1) % 3 === 0 || idx === interval.length - 1) {
          chartData.push({
            label: `${format(groupStart, "MMM d")}-${format(date, "d")}`,
            bookings: runningBookings,
            revenue: runningRevenue
          });
          runningBookings = 0;
          runningRevenue = 0;
          groupStart = addDays(date, 1);
        }
      });
    } 
    else {
      // Group by month
      const interval = eachDayOfInterval({ start, end });
      const monthlyBuckets: Record<string, { bookings: number; revenue: number }> = {};
      
      interval.forEach((date) => {
        const mKey = format(date, "MMM yyyy");
        const dow = date.getDay();
        const dowMult = getDayOfWeekMultiplier(dow);
        const bookings = Math.round(13 * dowMult * (0.85 + rand() * 0.3));
        const revenue = Math.round(bookings * 900 * (0.9 + rand() * 0.2));

        if (!monthlyBuckets[mKey]) {
          monthlyBuckets[mKey] = { bookings: 0, revenue: 0 };
        }
        monthlyBuckets[mKey].bookings += bookings;
        monthlyBuckets[mKey].revenue += revenue;
      });

      Object.entries(monthlyBuckets).forEach(([label, vals]) => {
        chartData.push({
          label,
          bookings: vals.bookings,
          revenue: vals.revenue
        });
      });
    }
  }

  // Ensure chartData isn't completely empty
  if (chartData.length === 0) {
    chartData = [{ label: "No Data", bookings: 0, revenue: 0 }];
  }

  // Calculate aggregates for KPIs
  const totalRevenueVal = chartData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalBookingsVal = chartData.reduce((acc, curr) => acc + curr.bookings, 0);
  const avgBookingVal = totalBookingsVal > 0 ? Math.round(totalRevenueVal / totalBookingsVal) : 0;
  
  // Percent shifts based on pseudo-random seeds
  const revChangeVal = (rand() * 15 + 2).toFixed(1);
  const revTrend = rand() > 0.3 ? "up" : "down";
  const bookChangeVal = (rand() * 12 + 1).toFixed(1);
  const bookTrend = rand() > 0.2 ? "up" : "down";
  const custChangeVal = (rand() * 18 + 3).toFixed(1);
  const custTrend = rand() > 0.25 ? "up" : "down";
  const abvChangeVal = (rand() * 5).toFixed(1);
  const abvTrend = rand() > 0.55 ? "up" : "down";
  const cancelRateVal = (1.5 + rand() * 3).toFixed(1);
  const cancelChangeVal = (rand() * 1.5).toFixed(1);
  const cancelTrend = rand() > 0.5 ? "up" : "down"; // up/down in cancellation rate
  const repeatRateVal = (42.0 + rand() * 15).toFixed(1);
  const repeatChangeVal = (rand() * 4).toFixed(1);
  const repeatTrend = rand() > 0.3 ? "up" : "down";

  // Create mini sparklines (6 items matching trend)
  const generateSparkline = (baseVal: number, trendDir: string) => {
    const points: number[] = [];
    let curVal = baseVal * 0.8;
    for (let i = 0; i < 7; i++) {
      const step = baseVal * 0.05 * (trendDir === "up" ? 1 : -1) * (0.8 + rand() * 0.4);
      curVal += step;
      points.push(Math.round(Math.max(10, curVal)));
    }
    return points;
  };

  const kpis = {
    totalRevenue: {
      label: "Total Revenue",
      value: `₹${totalRevenueVal.toLocaleString("en-IN")}`,
      change: `${revTrend === "up" ? "+" : "-"}${revChangeVal}%`,
      trend: revTrend as "up" | "down",
      prevValue: `₹${Math.round(totalRevenueVal * (revTrend === "up" ? 0.89 : 1.11)).toLocaleString("en-IN")}`,
      sparkline: generateSparkline(totalRevenueVal / 7, revTrend)
    },
    totalBookings: {
      label: "Total Bookings",
      value: totalBookingsVal.toLocaleString(),
      change: `${bookTrend === "up" ? "+" : "-"}${bookChangeVal}%`,
      trend: bookTrend as "up" | "down",
      prevValue: Math.round(totalBookingsVal * (bookTrend === "up" ? 0.91 : 1.09)).toLocaleString(),
      sparkline: generateSparkline(totalBookingsVal / 7, bookTrend)
    },
    newCustomers: {
      label: "New Customers",
      value: Math.round(totalBookingsVal * 0.28).toLocaleString(),
      change: `${custTrend === "up" ? "+" : "-"}${custChangeVal}%`,
      trend: custTrend as "up" | "down",
      prevValue: Math.round(totalBookingsVal * 0.28 * (custTrend === "up" ? 0.86 : 1.14)).toLocaleString(),
      sparkline: generateSparkline(totalBookingsVal * 0.28 / 7, custTrend)
    },
    avgBookingValue: {
      label: "Avg Booking Value",
      value: `₹${avgBookingVal.toLocaleString()}`,
      change: `${abvTrend === "up" ? "+" : "-"}${abvChangeVal}%`,
      trend: abvTrend as "up" | "down",
      prevValue: `₹${Math.round(avgBookingVal * (abvTrend === "up" ? 0.97 : 1.03)).toLocaleString()}`,
      sparkline: generateSparkline(avgBookingVal, abvTrend)
    },
    cancellationRate: {
      label: "Cancellation Rate",
      value: `${cancelRateVal}%`,
      change: `${cancelTrend === "up" ? "+" : "-"}${cancelChangeVal}%`,
      trend: cancelTrend as "up" | "down",
      isNegativeBetter: true,
      prevValue: `${(parseFloat(cancelRateVal) * (cancelTrend === "up" ? 0.9 : 1.1)).toFixed(1)}%`,
      sparkline: generateSparkline(parseFloat(cancelRateVal) * 10, cancelTrend === "up" ? "down" : "up")
    },
    repeatCustomerRate: {
      label: "Repeat Customer Rate",
      value: `${repeatRateVal}%`,
      change: `${repeatTrend === "up" ? "+" : "-"}${repeatChangeVal}%`,
      trend: repeatTrend as "up" | "down",
      prevValue: `${(parseFloat(repeatRateVal) * (repeatTrend === "up" ? 0.95 : 1.05)).toFixed(1)}%`,
      sparkline: generateSparkline(parseFloat(repeatRateVal), repeatTrend)
    }
  };

  // Top services (calculated proportionally from total revenue)
  const topServices: ServiceDataPoint[] = SERVICES.map(s => {
    const rev = Math.round(totalRevenueVal * s.weight * (0.9 + rand() * 0.2));
    const bks = Math.round(rev / s.avgPrice);
    return {
      name: s.name,
      bookings: bks,
      revenue: rev,
      percentage: Math.round(s.weight * 100),
      color: s.color
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Re-adjust percentages to sum to 100
  const sumPct = topServices.reduce((acc, curr) => acc + curr.percentage, 0);
  topServices.forEach(s => {
    s.percentage = Math.round((s.percentage / sumPct) * 100);
  });

  // Staff performance rankings
  const staffPerformance: StaffPerformanceData[] = STYLISTS.map((st, index) => {
    // share revenue based on rank
    const share = [0.45, 0.25, 0.18, 0.12][index];
    const rev = Math.round(totalRevenueVal * share * (0.92 + rand() * 0.16));
    const bks = Math.round(totalBookingsVal * share * (0.92 + rand() * 0.16));
    const occ = Math.round(60 + rand() * 30 - index * 5); // occupancy rate
    return {
      name: st.name,
      bookings: bks,
      revenue: rev,
      rating: st.rating,
      occupancy: Math.min(98, Math.max(45, occ)),
      color: st.color
    };
  });

  // Client split: New vs Returning Guests
  const customerSplit: CustomerSplitData[] = [
    { name: "New Guests", value: Math.round(35 + rand() * 10), count: 0, color: "#7A9A6D" },
    { name: "Returning Guests", value: 0, count: 0, color: "#3D5A3A" }
  ];
  customerSplit[1].value = 100 - customerSplit[0].value;
  customerSplit[0].count = Math.round(totalBookingsVal * (customerSplit[0].value / 100));
  customerSplit[1].count = totalBookingsVal - customerSplit[0].count;

  // Payment splits
  const paymentSplit: PaymentMethodData[] = [
    { name: "UPI / QR Code", value: 55, amount: Math.round(totalRevenueVal * 0.55), color: "#3D5A3A" },
    { name: "Credit/Debit Card", value: 30, amount: Math.round(totalRevenueVal * 0.30), color: "#7A9A6D" },
    { name: "Cash payments", value: 12, amount: Math.round(totalRevenueVal * 0.12), color: "#C4A76C" },
    { name: "Net Banking / Wallet", value: 3, amount: Math.round(totalRevenueVal * 0.03), color: "#6E6960" }
  ];

  // Cancellation reasons
  const totalCancellations = Math.max(1, Math.round(totalBookingsVal * (parseFloat(cancelRateVal) / 100)));
  const cancellationReasons: CancellationReasonData[] = [
    { reason: "Scheduling Conflict", count: Math.round(totalCancellations * 0.45), percentage: 45, color: "#3D5A3A" },
    { reason: "Illness / Emergency", count: Math.round(totalCancellations * 0.25), percentage: 25, color: "#7A9A6D" },
    { reason: "Found alternate option", count: Math.round(totalCancellations * 0.15), percentage: 15, color: "#C4A76C" },
    { reason: "Weather / Traffic delays", count: Math.round(totalCancellations * 0.10), percentage: 10, color: "#A3906B" },
    { reason: "Forgot / Misunderstood", count: Math.max(1, totalCancellations - Math.round(totalCancellations * 0.95)), percentage: 5, color: "#6E6960" }
  ];

  const sumCancelCount = cancellationReasons.reduce((acc, curr) => acc + curr.count, 0);
  cancellationReasons.forEach(r => {
    r.percentage = Math.round((r.count / sumCancelCount) * 100);
  });

  // Heatmap hourly distribution (7 days x 12 hours from 9 AM to 8 PM)
  const heatmap: HeatmapHourPoint[] = [];
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  weekdays.forEach((day, dIdx) => {
    const dowMult = getDayOfWeekMultiplier(dIdx === 6 ? 0 : dIdx + 1);
    for (let hour = 9; hour <= 20; hour++) {
      const hourMult = getHourlyTrafficMultiplier(hour);
      const variation = 0.7 + rand() * 0.6;
      const bookings = Math.round(hourMult * 3 * dowMult * variation);
      heatmap.push({
        day,
        hour,
        bookings
      });
    }
  });

  // Recent Transactions/Bookings Table
  const recentBookings: RecentBookingData[] = [];
  const statuses: RecentBookingData["status"][] = ["completed", "confirmed", "pending", "cancelled", "no-show"];
  const transactionTimes = ["10:30 AM", "11:15 AM", "12:00 PM", "01:30 PM", "02:45 PM", "04:00 PM", "05:15 PM", "06:30 PM", "07:00 PM", "08:15 PM"];

  for (let i = 0; i < 10; i++) {
    const client = CLIENTS[Math.floor(rand() * CLIENTS.length)];
    const stylist = STYLISTS[Math.floor(rand() * STYLISTS.length)].name;
    const serviceObj = SERVICES[Math.floor(rand() * SERVICES.length)];
    const amount = serviceObj.avgPrice + Math.round((rand() * 200 - 100) / 10) * 10;
    
    // Choose status based on weighted probabilities (most completed/confirmed)
    const statusRoll = rand();
    let status: RecentBookingData["status"] = "completed";
    if (statusRoll > 0.85) status = "cancelled";
    else if (statusRoll > 0.75) status = "pending";
    else if (statusRoll > 0.50) status = "confirmed";
    else if (statusRoll > 0.95) status = "no-show";

    recentBookings.push({
      id: `CS-${(20394 - i).toString()}`,
      time: transactionTimes[i % transactionTimes.length],
      name: client,
      service: serviceObj.name,
      stylist,
      amount,
      status,
      date: format(subDays(new Date(), Math.floor(i / 2)), "yyyy-MM-dd")
    });
  }

  return {
    periodLabel,
    chartData,
    kpis,
    topServices,
    staffPerformance,
    customerSplit,
    paymentSplit,
    cancellationReasons,
    heatmap,
    recentBookings
  };
}
