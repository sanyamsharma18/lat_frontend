/* eslint-disable no-console, jsx-a11y/label-has-associated-control, max-len */
'use client';

import React, { useState, useMemo, memo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Import local styling
import styles from './styles.module.scss';

// Import constants/filters from Dashboard to maintain alignment
import {
    FILTER_OPTIONS,
    MOCK_DATABASE_STATE
} from '../../../dashboardManagement/components/DashboardPage/constant';
import { useReportQuery } from './utils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type ReportType = 'competency' | 'school' | 'region' | 'subject' | 'grade';

const ReportPage = () => {
    // Report UI state
    const [activeReport, setActiveReport] = useState<ReportType>('competency');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<string>('score');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;

    // Filters state
    const [regionFilter, setRegionFilter] = useState('all');
    const [gradeFilter, setGradeFilter] = useState('all');
    const [subjectFilter, setSubjectFilter] = useState('all');

    const db = MOCK_DATABASE_STATE.base;

    // Helper: Reset page when filters change
    const resetTableState = () => {
        setCurrentPage(1);
        setSearchQuery('');
    };

    const handleReportChange = (type: ReportType) => {
        setActiveReport(type);
        resetTableState();
        if (type === 'competency' || type === 'region') setSortField('score');
        if (type === 'school') setSortField('avgScore');
        if (type === 'subject') setSortField('avgScore');
        if (type === 'grade') setSortField('avgScore');
    };

    // Calculate/Process Data based on selected report type and filters
    const { data: rawReportData = [], isLoading } = useReportQuery(activeReport, {
        regionId: regionFilter === 'all' ? undefined : regionFilter,
        gradeId: gradeFilter === 'all' ? undefined : gradeFilter,
        subjectId: subjectFilter === 'all' ? undefined : subjectFilter,
    });

    const reportData = useMemo(() => {
        return rawReportData.map((item: any) => {
            if (activeReport === 'competency') {
                return {
                    id: String(item.id),
                    name: item.competency || item.name,
                    score: parseFloat(Number(item.avgScore).toFixed(1)),
                    questions: Number(item.questionCount),
                    attempts: Number(item.attemptCount),
                    accuracy: parseFloat(Number(item.accuracy).toFixed(1)),
                    status: item.status,
                };
            }
            if (activeReport === 'school') {
                return {
                    id: String(item.id),
                    name: item.name,
                    region: item.region,
                    avgScore: parseFloat(Number(item.avgScore).toFixed(1)),
                    completionPct: parseFloat(Number(item.completion).toFixed(1)),
                    students: Number(item.totalStudents),
                    status: item.status,
                };
            }
            if (activeReport === 'region') {
                return {
                    id: String(item.id),
                    name: item.region || item.name,
                    score: parseFloat(Number(item.avgScore).toFixed(1)),
                    participation: parseFloat(Number(item.participation).toFixed(1)),
                    completion: parseFloat(Number(item.completion).toFixed(1)),
                    students: Number(item.studentsAttempted),
                    schools: Number(item.activeSchools),
                    status: Number(item.avgScore) >= 75 ? 'Target Met' : 'Development Priority',
                };
            }
            if (activeReport === 'subject') {
                return {
                    id: String(item.id),
                    name: item.subject || item.name,
                    avgScore: parseFloat(Number(item.avgScore).toFixed(1)),
                    participation: parseFloat(Number(item.participation).toFixed(1)),
                    accuracy: parseFloat(Number(item.accuracy).toFixed(1)),
                    time: item.timeTaken,
                    difficultNode: item.mostDifficult,
                    successfulNode: item.mostSuccessful,
                };
            }
            if (activeReport === 'grade') {
                return {
                    id: String(item.id),
                    name: item.grade || item.name,
                    avgScore: parseFloat(Number(item.avgScore).toFixed(1)),
                    students: Number(item.studentsEvaluated),
                    completed: Number(item.completed),
                    pending: Number(item.pending),
                    accuracy: parseFloat(Number(item.accuracy).toFixed(1)),
                    weakest: item.weakestCompetency,
                    strongest: item.strongestCompetency,
                };
            }
            return item;
        });
    }, [rawReportData, activeReport]);

    // Sorting & Searching Filtering
    const processedReportData = useMemo(() => reportData
            .filter((item: any) => {
                const searchLower = searchQuery.toLowerCase();
                return (
                    item.name?.toLowerCase().includes(searchLower) ||
                    item.id?.toLowerCase().includes(searchLower) ||
                    item.status?.toLowerCase().includes(searchLower)
                );
            })
            .sort((a: any, b: any) => {
                const aVal = a[sortField];
                const bVal = b[sortField];

                if (typeof aVal === 'string') {
                    return sortOrder === 'asc'
                        ? aVal.localeCompare(String(bVal))
                        : String(bVal).localeCompare(aVal);
                }
                return sortOrder === 'asc'
                    ? (aVal as number) - (bVal as number)
                    : (bVal as number) - (aVal as number);
            }), [reportData, searchQuery, sortField, sortOrder]);

    // Paginated rows
    const paginatedRows = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        return processedReportData.slice(startIndex, startIndex + rowsPerPage);
    }, [processedReportData, currentPage]);

    const totalPages = Math.ceil(processedReportData.length / rowsPerPage);

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
        setCurrentPage(1);
    };

    // Client Side Exports
    const handleCSVExport = () => {
        if (processedReportData.length === 0) return;
        const keys = Object.keys(processedReportData[0]);
        const headers = `${keys.join(',')  }\n`;
        const rows = processedReportData
            .map((row: any) => keys.map((key) => `"${String(row[key]).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `LAT_${activeReport}_Report_${new Date().toISOString().split('T')[0]}.csv`);
        link.click();
    };

    // Visual Chart Setup
    const chartData = {
        labels: processedReportData.map((item: any) => item.name),
        datasets: [
            {
                label: 'Performance Average %',
                data: processedReportData.map((item: any) => {
                    if (activeReport === 'school') return item.avgScore;
                    if (activeReport === 'subject') return item.avgScore;
                    if (activeReport === 'grade') return item.avgScore;
                    return item.score || 0;
                }),
                backgroundColor: 'rgba(21, 93, 252, 0.7)',
                borderColor: '#155dfc',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
            },
        },
    };

    return (
        <main className={styles.reportPage}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e4d6b' }}>
                        Enterprise Reports Portal
                    </h1>
                    <p style={{ fontSize: '13px', color: '#717182' }}>
                        Create, query, and download complete educational reports and matrices.
                    </p>
                </div>
                <div className={styles.actionsHeader}>
                    <button type='button' className={styles.exportBtn} onClick={handleCSVExport}>
                        📥 Download Sheet (CSV)
                    </button>
                    <button
                        type='button'
                        className={`${styles.exportBtn} ${styles.primary}`}
                        onClick={() => window.print()}
                    >
                        🖨️ Print Report PDF
                    </button>
                </div>
            </header>

            {/* Selection tabs */}
            <nav className={styles.tabNav} aria-label='Report Types Selector'>
                <button
                    type='button'
                    className={`${styles.tabBtn} ${activeReport === 'competency' ? styles.active : ''}`}
                    onClick={() => handleReportChange('competency')}
                >
                    📊 Competency Report
                </button>
                <button
                    type='button'
                    className={`${styles.tabBtn} ${activeReport === 'school' ? styles.active : ''}`}
                    onClick={() => handleReportChange('school')}
                >
                    🏫 School Reports
                </button>
                <button
                    type='button'
                    className={`${styles.tabBtn} ${activeReport === 'region' ? styles.active : ''}`}
                    onClick={() => handleReportChange('region')}
                >
                    🗺️ Region Reports
                </button>
                <button
                    type='button'
                    className={`${styles.tabBtn} ${activeReport === 'subject' ? styles.active : ''}`}
                    onClick={() => handleReportChange('subject')}
                >
                    📚 Subject Analytics
                </button>
                <button
                    type='button'
                    className={`${styles.tabBtn} ${activeReport === 'grade' ? styles.active : ''}`}
                    onClick={() => handleReportChange('grade')}
                >
                    🎓 Grade Reports
                </button>
            </nav>

            {/* Query Filters */}
            <section className={styles.filtersPanel}>
                <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#000', marginBottom: '12px' }}>
                    Report Query Controls
                </h3>
                <div className={styles.filterGrid}>
                    <div className={styles.filterField}>
                        <label htmlFor='region-filter-select'>Filter Region</label>
                        <select
                            id='region-filter-select'
                            value={regionFilter}
                            onChange={(e) => {
                                setRegionFilter(e.target.value);
                                resetTableState();
                            }}
                        >
                            {FILTER_OPTIONS.regions.map((opt) => (
                                <option key={`freg-${opt.value}`} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterField}>
                        <label htmlFor='grade-filter-select'>Filter Grade</label>
                        <select
                            id='grade-filter-select'
                            value={gradeFilter}
                            onChange={(e) => {
                                setGradeFilter(e.target.value);
                                resetTableState();
                            }}
                        >
                            {FILTER_OPTIONS.grades.map((opt) => (
                                <option key={`fgrd-${opt.value}`} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterField}>
                        <label htmlFor='subject-filter-select'>Filter Subject</label>
                        <select
                            id='subject-filter-select'
                            value={subjectFilter}
                            onChange={(e) => {
                                setSubjectFilter(e.target.value);
                                resetTableState();
                            }}
                        >
                            {FILTER_OPTIONS.subjects.map((opt) => (
                                <option key={`fsubj-${opt.value}`} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Performance Visualization */}
            {processedReportData.length > 0 && (
                <section className={styles.card}>
                    <h3 className={styles.cardTitle}>Report Data Trend</h3>
                    <div className={styles.chartContainer}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </section>
            )}

            {/* Data Grid Section */}
            <section className={styles.card}>
                <div className={styles.tableToolbar}>
                    <input
                        type='text'
                        className={styles.searchInput}
                        placeholder='🔍 Filter rows...'
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />

                    <div className={styles.pagination}>
                        <button
                            type='button'
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        <span>
                            Page {currentPage} of {Math.max(1, totalPages)}
                        </span>
                        <button
                            type='button'
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                            Next
                        </button>
                    </div>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.reportTable}>
                        <thead>
                            {activeReport === 'competency' && (
                                <tr>
                                    <th onClick={() => handleSort('name')}>Competency Node</th>
                                    <th onClick={() => handleSort('score')}>Average Performance</th>
                                    <th onClick={() => handleSort('questions')}>Question Count</th>
                                    <th onClick={() => handleSort('attempts')}>Attempt Count</th>
                                    <th onClick={() => handleSort('accuracy')}>Accuracy %</th>
                                    <th onClick={() => handleSort('status')}>Audit Recommendation</th>
                                </tr>
                            )}
                            {activeReport === 'school' && (
                                <tr>
                                    <th onClick={() => handleSort('name')}>School Name</th>
                                    <th onClick={() => handleSort('region')}>Region</th>
                                    <th onClick={() => handleSort('avgScore')}>Average Score</th>
                                    <th onClick={() => handleSort('completionPct')}>Completion %</th>
                                    <th onClick={() => handleSort('students')}>Students Registered</th>
                                    <th onClick={() => handleSort('status')}>Audit Rating</th>
                                </tr>
                            )}
                            {activeReport === 'region' && (
                                <tr>
                                    <th onClick={() => handleSort('name')}>Region Name</th>
                                    <th onClick={() => handleSort('score')}>Avg Score %</th>
                                    <th onClick={() => handleSort('participation')}>Participation %</th>
                                    <th onClick={() => handleSort('completion')}>Completion %</th>
                                    <th onClick={() => handleSort('students')}>Students Attempted</th>
                                    <th onClick={() => handleSort('schools')}>Active School Count</th>
                                    <th onClick={() => handleSort('status')}>Strategic Priority</th>
                                </tr>
                            )}
                            {activeReport === 'subject' && (
                                <tr>
                                    <th onClick={() => handleSort('name')}>Subject</th>
                                    <th onClick={() => handleSort('avgScore')}>Avg Score</th>
                                    <th onClick={() => handleSort('participation')}>Participation %</th>
                                    <th onClick={() => handleSort('accuracy')}>Syllabus Accuracy %</th>
                                    <th>Avg Duration</th>
                                    <th>Lowest Competency Node</th>
                                    <th>Highest Competency Node</th>
                                </tr>
                            )}
                            {activeReport === 'grade' && (
                                <tr>
                                    <th onClick={() => handleSort('name')}>Grade Level</th>
                                    <th onClick={() => handleSort('avgScore')}>Average Score</th>
                                    <th onClick={() => handleSort('students')}>Evaluated Student Count</th>
                                    <th onClick={() => handleSort('completed')}>Assessments Completed</th>
                                    <th onClick={() => handleSort('pending')}>Assessments Pending</th>
                                    <th onClick={() => handleSort('accuracy')}>Accuracy %</th>
                                    <th>Weakest Competency</th>
                                    <th>Strongest Competency</th>
                                </tr>
                            )}
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: '#717182' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                                            <div className={styles.spinner} style={{ width: '32px', height: '32px', border: '3px solid rgba(21, 93, 252, 0.2)', borderTopColor: '#155dfc', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                            <span>Fetching report data from database...</span>
                                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginatedRows.length > 0 ? (
                                paginatedRows.map((row: any) => {
                                    if (activeReport === 'competency') {
                                        return (
                                            <tr key={row.id}>
                                                <td style={{ fontWeight: '700' }}>{row.name}</td>
                                                <td style={{ color: '#155dfc', fontWeight: '700' }}>{row.score}%</td>
                                                <td>{row.questions}</td>
                                                <td>{row.attempts.toLocaleString()}</td>
                                                <td>{row.accuracy}%</td>
                                                <td>
                                                    <span
                                                        className={`${styles.statusBadge} ${
                                                            row.score >= 70
                                                                ? styles.green
                                                                : row.score >= 55
                                                                ? styles.orange
                                                                : styles.red
                                                        }`}
                                                    >
                                                        {row.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    }
                                    if (activeReport === 'school') {
                                        return (
                                            <tr key={row.id}>
                                                <td style={{ fontWeight: '700' }}>{row.name}</td>
                                                <td>{row.region}</td>
                                                <td style={{ color: '#0092b8', fontWeight: '700' }}>
                                                    {row.avgScore}%
                                                </td>
                                                <td>{row.completionPct}%</td>
                                                <td>{row.students}</td>
                                                <td>
                                                    <span
                                                        className={`${styles.statusBadge} ${
                                                            row.avgScore >= 75
                                                                ? styles.green
                                                                : row.avgScore >= 60
                                                                ? styles.orange
                                                                : styles.red
                                                        }`}
                                                    >
                                                        {row.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    }
                                    if (activeReport === 'region') {
                                        return (
                                            <tr key={row.id}>
                                                <td style={{ fontWeight: '700' }}>{row.name}</td>
                                                <td style={{ color: '#8200db', fontWeight: '700' }}>{row.score}%</td>
                                                <td>{row.participation}%</td>
                                                <td>{row.completion}%</td>
                                                <td>{row.students.toLocaleString()}</td>
                                                <td>{row.schools}</td>
                                                <td>
                                                    <span
                                                        className={`${styles.statusBadge} ${
                                                            row.score >= 75 ? styles.green : styles.orange
                                                        }`}
                                                    >
                                                        {row.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    }
                                    if (activeReport === 'subject') {
                                        return (
                                            <tr key={row.id}>
                                                <td style={{ fontWeight: '700' }}>{row.name}</td>
                                                <td style={{ color: '#009966', fontWeight: '700' }}>
                                                    {row.avgScore}%
                                                </td>
                                                <td>{row.participation}%</td>
                                                <td>{row.accuracy}%</td>
                                                <td>{row.time}</td>
                                                <td style={{ color: '#f04438' }}>{row.difficultNode}</td>
                                                <td style={{ color: '#009966' }}>{row.successfulNode}</td>
                                            </tr>
                                        );
                                    }
                                    if (activeReport === 'grade') {
                                        return (
                                            <tr key={row.id}>
                                                <td style={{ fontWeight: '700' }}>{row.name}</td>
                                                <td style={{ color: '#ca3500', fontWeight: '700' }}>
                                                    {row.avgScore}%
                                                </td>
                                                <td>{row.students.toLocaleString()}</td>
                                                <td style={{ color: '#009966' }}>{row.completed.toLocaleString()}</td>
                                                <td style={{ color: '#ca3500' }}>{row.pending.toLocaleString()}</td>
                                                <td>{row.accuracy}%</td>
                                                <td style={{ color: '#f04438' }}>{row.weakest}</td>
                                                <td style={{ color: '#009966' }}>{row.strongest}</td>
                                            </tr>
                                        );
                                    }
                                    return null;
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#717182' }}>
                                        No rows match the specified query filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
};

export default memo(ReportPage);
