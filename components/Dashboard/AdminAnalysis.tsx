"use client"
import { useGetAnalysisQuery } from '@/redux/Api/commonApi'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Users,
    Package,
    FolderTree,
    ShoppingCart,
    Clock,
    CheckCircle,
    XCircle,
    Ban,
    DollarSign,
    TrendingUp,
    LucideIcon
} from 'lucide-react'

interface AnalysisData {
    totalUsers: number
    totalProducts: number
    totalCategories: number
    todayOrders: number
    todayPendingOrders: number
    totalOrders: number
    rejectedOrders: number
    cancelledOrders: number
    totalRevenue: number
    monthlyRevenue: number
}

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    trend?: 'up' | 'down'
    trendValue?: string
    loading: boolean
}

interface StatConfig {
    title: string
    value: string | number
    icon: LucideIcon
    color: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, trendValue, loading }) => {
    if (loading) {
        return (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4 rounded" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-20 mb-2" />
                    <Skeleton className="h-3 w-32" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className=" shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium " style={{ color: getColorForTitle(title) }}>
                    {title}
                </CardTitle>
                <div className="p-2 rounded-lg" style={{ backgroundColor: getColorForTitle(title) + '20' }}>
                    <Icon className="h-5 w-5" style={{ color: getColorForTitle(title) }} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                {trend && (
                    <p className="text-xs text-gray-500 mt-1">
                        <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                            {trendValue}
                        </span>
                        {' '}from last month
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

const getColorForTitle = (title: string): string => {
    const colorMap: { [key: string]: string } = {
        'Total Users': '#3B82F6',        // Blue
        'Total Products': '#8B5CF6',     // Purple
        'Total Categories': '#6366F1',   // Indigo
        'Total Orders': '#10B981',       // Green
        'Today Orders': '#F59E0B',       // Amber
        'Pending Orders': '#F97316',     // Orange
        'Rejected Orders': '#EF4444',    // Red
        'Cancelled Orders': '#6B7280',   // Gray
        'Total Revenue': '#059669',      // Emerald
        'Monthly Revenue': '#14B8A6'     // Teal
    }
    return colorMap[title] || '#6B7280'
}

const AdminAnalysis: React.FC = () => {
    const { data, isLoading } = useGetAnalysisQuery({})

    const analysisData: AnalysisData = data?.data || {
        totalUsers: 0,
        totalProducts: 0,
        totalCategories: 0,
        todayOrders: 0,
        todayPendingOrders: 0,
        totalOrders: 0,
        rejectedOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
        monthlyRevenue: 0
    }

    const statsConfig: StatConfig[] = [
        {
            title: 'Total Users',
            value: analysisData.totalUsers,
            icon: Users,
            color: 'blue'
        },
        {
            title: 'Total Products',
            value: analysisData.totalProducts,
            icon: Package,
            color: 'purple'
        },
        {
            title: 'Total Categories',
            value: analysisData.totalCategories,
            icon: FolderTree,
            color: 'indigo'
        },
        {
            title: 'Total Orders',
            value: analysisData.totalOrders,
            icon: ShoppingCart,
            color: 'green'
        },
        {
            title: 'Today Orders',
            value: analysisData.todayOrders,
            icon: Clock,
            color: 'yellow'
        },
        {
            title: 'Pending Orders',
            value: analysisData.todayPendingOrders,
            icon: Clock,
            color: 'orange'
        },
        {
            title: 'Rejected Orders',
            value: analysisData.rejectedOrders,
            icon: XCircle,
            color: 'red'
        },
        {
            title: 'Cancelled Orders',
            value: analysisData.cancelledOrders,
            icon: Ban,
            color: 'gray'
        },
        {
            title: 'Total Revenue',
            value: `$${analysisData.totalRevenue?.toFixed(2) || '0.00'}`,
            icon: DollarSign,
            color: 'green'
        },
        {
            title: 'Monthly Revenue',
            value: `$${analysisData.monthlyRevenue?.toFixed(2) || '0.00'}`,
            icon: TrendingUp,
            color: 'emerald'
        }
    ]

    return (
        <div className="">
            <div className="">

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {statsConfig.map((stat, index) => (
                        <StatCard
                            key={index}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            loading={isLoading}
                        />
                    ))}
                </div>

                {/* Summary Cards */}
                {!isLoading && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5" />
                                    Order Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Total Orders</span>
                                        <span className="font-semibold">{analysisData.totalOrders}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Today's Orders</span>
                                        <span className="font-semibold text-blue-600">{analysisData.todayOrders}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Pending</span>
                                        <span className="font-semibold text-yellow-600">{analysisData.todayPendingOrders}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Rejected</span>
                                        <span className="font-semibold text-red-600">{analysisData.rejectedOrders}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Cancelled</span>
                                        <span className="font-semibold text-gray-600">{analysisData.cancelledOrders}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Revenue Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                                        <p className="text-3xl font-bold text-green-600">
                                            ${analysisData.totalRevenue?.toFixed(2) || '0.00'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
                                        <p className="text-2xl font-semibold text-emerald-600">
                                            ${analysisData.monthlyRevenue?.toFixed(2) || '0.00'}
                                        </p>
                                    </div>
                                    <div className="pt-4 border-t">
                                        <p className="text-sm text-gray-600">Average Order Value</p>
                                        <p className="text-xl font-semibold">
                                            ${analysisData.totalOrders > 0
                                                ? (analysisData.totalRevenue / analysisData.totalOrders).toFixed(2)
                                                : '0.00'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Loading State for Summary Cards */}
                {isLoading && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-40" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="flex justify-between items-center">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-4 w-12" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-40" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-8 w-3/4" />
                                    <Skeleton className="h-6 w-1/2" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminAnalysis