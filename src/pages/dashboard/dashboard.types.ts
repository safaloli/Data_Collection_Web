export type ActivityType = "import" | "create" | "update" | "delete" | "warning";

export interface DashboardStats {
    totalCitizens: number;
    completeRecords: number;
    incompleteRecords: number;
    importedRecords: number;
}

export interface CollectionDataPoint { date: string; count: number }
export interface WardStatistic { wardId: string; wardName: string; count: number }
export interface DataQualityStatistic { label: string; count: number; percentage: number }
export interface RecentActivity { id: string; type: ActivityType; title: string; description: string; timestamp: string }
export interface LatestImport { id: string; fileName: string; totalRecords: number; successfulRecords: number; incompleteRecords: number; failedRecords: number; status: string; createdAt: string }
export interface DashboardData {
    stats: DashboardStats;
    collectionOverview: CollectionDataPoint[];
    wardStatistics: WardStatistic[];
    dataQuality: DataQualityStatistic[];
    recentActivity: RecentActivity[];
    latestImport: LatestImport | null;
}
