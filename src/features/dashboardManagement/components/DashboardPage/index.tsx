'use client';

/* eslint-disable no-console, jsx-a11y/label-has-associated-control, max-len */

import React, { useState, useEffect, useMemo, memo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    RadialLinearScale,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Bar, Doughnut, Radar } from 'react-chartjs-2';

// Import local styling
import styles from './styles.module.scss';

// Import constants
import {
    DASHBOARD_TEXT,
    FILTER_OPTIONS,
    MOCK_DATABASE_STATE,
    QUICK_ACTIONS,
    SYSTEM_HEALTH_STATS,
    CompetencyData,
    RegionData,
    SchoolData,
    SubjectData,
    GradeStats,
    TimelineEvent
} from './constant';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    RadialLinearScale,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const DashboardPage = () => {
    // ----------------------------------------------------
    // State Management & Global Filters (Section 14)
    // ----------------------------------------------------
    const [selectedRegion, setSelectedRegion] = useState('all');
    const [selectedSchool, setSelectedSchool] = useState('all');
    const [selectedGrade, setSelectedGrade] = useState('all');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedAssessment, setSelectedAssessment] = useState('all');
    const [selectedCompetency, setSelectedCompetency] = useState('all');
    const [dateFrom, setDateFrom] = useState('2026-01-01');
    const [dateTo, setDateTo] = useState('2026-06-30');
    const [selectedAcademicYear, setSelectedAcademicYear] = useState('2025-2026');
    const [selectedCycle, setSelectedCycle] = useState('cycle-1');

    // Chart Fullscreen State (Section 15)
    const [fullscreenChart, setFullscreenChart] = useState<string | null>(null);

    // Live Assessment Monitor State (Section 9)
    const [liveTime, setLiveTime] = useState(0);
    const [liveOnlineCount, setLiveOnlineCount] = useState(128);
    const [liveTakingCount, setLiveTakingCount] = useState(84);
    const [liveCompletedCount, setLiveCompletedCount] = useState(1530);

    // Table sorting/pagination state (Section 6)
    const [schoolSearch, setSchoolSearch] = useState('');
    const [schoolSortField, setSchoolSortField] = useState<'name' | 'avgScore' | 'completionPct'>('avgScore');
    const [schoolSortOrder, setSchoolSortOrder] = useState<'asc' | 'desc'>('desc');
    const [schoolPage, setSchoolPage] = useState(1);
    const schoolsPerPage = 5;

    // Reset filters
    const handleResetFilters = () => {
        setSelectedRegion('all');
        setSelectedSchool('all');
        setSelectedGrade('all');
        setSelectedSubject('all');
        setSelectedAssessment('all');
        setSelectedCompetency('all');
        setDateFrom('2026-01-01');
        setDateTo('2026-06-30');
        setSelectedAcademicYear('2025-2026');
        setSelectedCycle('cycle-1');
    };

    // ----------------------------------------------------
    // Auto-refresh logic (Section 9)
    // ----------------------------------------------------
    useEffect(() => {
        const interval = setInterval(() => {
            setLiveTime((prev) => prev + 30);
            setLiveOnlineCount((prev) => Math.max(80, prev + Math.floor(Math.random() * 15) - 7));
            setLiveTakingCount((prev) => Math.max(50, prev + Math.floor(Math.random() * 11) - 5));
            setLiveCompletedCount((prev) => prev + Math.floor(Math.random() * 3));
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    // ----------------------------------------------------
    // Dynamic Analytics Calculations (Section 17 - Performance & Memo)
    // ----------------------------------------------------
    const db = MOCK_DATABASE_STATE.base;

    const filteredData = useMemo(() => {
        let multiplier = 1.0;
        let scoreOffset = 0;

        if (selectedRegion !== 'all') {
            multiplier *= 0.85;
            if (selectedRegion === 'reg-north') scoreOffset += 4.8;
            if (selectedRegion === 'reg-south') scoreOffset += 7.6;
            if (selectedRegion === 'reg-east') scoreOffset -= 4.7;
        }
        if (selectedSchool !== 'all') {
            multiplier *= 0.15;
            if (selectedSchool === 'sch-01') scoreOffset += 9.5;
            if (selectedSchool === 'sch-02') scoreOffset += 8.2;
            if (selectedSchool === 'sch-08') scoreOffset -= 12.0;
        }
        if (selectedGrade !== 'all') multiplier *= 0.35;
        if (selectedSubject !== 'all') multiplier *= 0.25;

        const regionsCount = selectedRegion !== 'all' ? 1 : db.regionsCount;
        const schoolsCount = selectedSchool !== 'all' ? 1 : Math.max(
            1,
            Math.round(db.schoolsCount * (selectedRegion !== 'all' ? 0.25 : 1))
        );
        const teachersCount = Math.max(5, Math.round(db.teachersCount * multiplier));
        const studentsCount = Math.max(50, Math.round(db.studentsCount * multiplier));
        const questionsCount = Math.max(100, Math.round(db.questionsCount * (selectedSubject !== 'all' ? 0.25 : 1)));
        const assessmentsCount = Math.max(2, Math.round(db.assessmentsCount * (selectedGrade !== 'all' ? 0.33 : 1)));
        const activeAssessmentsCount = Math.max(1, Math.round(db.activeAssessmentsCount * multiplier));

        const baseScore = Math.max(45, Math.min(98, 75.6 + scoreOffset));
        const completionPct = Math.max(50, Math.min(100, db.completionPct + (scoreOffset * 0.5)));

        const activeUsersToday = Math.max(10, Math.round(db.activeUsersToday * multiplier));
        const questionsGeneratedToday = Math.max(
            5,
            Math.round(db.questionsGeneratedToday * (selectedSubject !== 'all' ? 0.3 : 1))
        );
        const studentsAttemptedToday = Math.max(20, Math.round(db.studentsAttemptedToday * multiplier));
        const reportsGeneratedToday = Math.max(5, Math.round(db.reportsGeneratedToday * multiplier));

        const qTotal = questionsCount;
        const qApproved = Math.round(qTotal * 0.82);
        const qPending = Math.round(qTotal * 0.15);
        const qRejected = qTotal - qApproved - qPending;

        const compList: Record<string, CompetencyData> = {};
        Object.entries(db.competencies).forEach(([key, val]) => {
            let offset = 0;
            if (selectedSubject === 'math' && key === 'critical_thinking') offset -= 5;
            if (selectedSubject === 'english' && key === 'communication') offset += 6;
            const avgPerf = Math.max(40, Math.min(98, val.avgPerformance + scoreOffset + offset));
            compList[key] = {
                ...val,
                avgPerformance: parseFloat(avgPerf.toFixed(1)),
                questionCount: Math.max(10, Math.round(val.questionCount * (selectedSubject !== 'all' ? 0.3 : 1))),
                attemptCount: Math.max(50, Math.round(val.attemptCount * multiplier)),
                correctPct: parseFloat(avgPerf.toFixed(1)),
                incorrectPct: parseFloat((100 - avgPerf).toFixed(1)),
            };
        });

        const regionsList: RegionData[] = db.regions.map((reg) => {
            const matchRegion = selectedRegion === 'all' || selectedRegion === reg.id;
            const factor = matchRegion ? 1 : 0.4;
            return {
                ...reg,
                avgScore: Math.max(40, Math.min(99, reg.avgScore + (selectedSubject !== 'all' ? 2.5 : 0))),
                participationPct: Math.max(50, Math.min(100, reg.participationPct * factor)),
                completionPct: Math.max(50, Math.min(100, reg.completionPct * factor)),
                totalStudents: Math.round(reg.totalStudents * factor),
                totalSchools: Math.round(reg.totalSchools * factor),
            };
        });

        const schoolsList: SchoolData[] = db.schools
            .filter((sch) => {
                if (selectedRegion !== 'all' && sch.regionId !== selectedRegion) return false;
                if (selectedSchool !== 'all' && sch.id !== selectedSchool) return false;
                return true;
            })
            .map((sch) => ({
                ...sch,
                avgScore: Math.max(40, Math.min(100, sch.avgScore + scoreOffset)),
                completionPct: Math.max(50, Math.min(100, sch.completionPct + (scoreOffset * 0.2))),
                totalStudents: Math.round(sch.totalStudents * (selectedGrade !== 'all' ? 0.35 : 1)),
            }));

        const subjectsList: Record<string, SubjectData> = {};
        Object.entries(db.subjects).forEach(([key, val]) => {
            subjectsList[key] = {
                ...val,
                avgScore: Math.max(40, Math.min(100, val.avgScore + scoreOffset)),
                participation: Math.max(
                    50,
                    Math.min(100, val.participation * (selectedRegion !== 'all' ? 0.95 : 1))
                ),
                questionAccuracy: Math.max(40, Math.min(100, val.questionAccuracy + scoreOffset)),
            };
        });

        const gradesList: Record<string, GradeStats> = {};
        Object.entries(db.grades).forEach(([key, val]) => {
            gradesList[key] = {
                ...val,
                students: Math.round(val.students * (selectedRegion !== 'all' ? 0.2 : 1)),
                completed: Math.round(val.completed * (selectedRegion !== 'all' ? 0.2 : 1)),
                pending: Math.round(val.pending * (selectedRegion !== 'all' ? 0.2 : 1)),
                avgScore: Math.max(40, Math.min(100, val.avgScore + scoreOffset)),
                avgAccuracy: Math.max(40, Math.min(100, val.avgAccuracy + scoreOffset)),
            };
        });

        const timelineList: TimelineEvent[] = db.timeline.filter((evt) => {
            if (selectedSubject !== 'all' && evt.type === 'question' &&
                !evt.description.toLowerCase().includes(selectedSubject)) {
                return false;
            }
            return true;
        });

        return {
            regionsCount,
            schoolsCount,
            teachersCount,
            studentsCount,
            questionsCount,
            assessmentsCount,
            activeAssessmentsCount,
            completionPct: parseFloat(completionPct.toFixed(1)),
            activeUsersToday,
            questionsGeneratedToday,
            studentsAttemptedToday,
            reportsGeneratedToday,
            qTotal,
            qApproved,
            qPending,
            qRejected,
            competencies: compList,
            regions: regionsList,
            schools: schoolsList,
            subjects: subjectsList,
            grades: gradesList,
            timeline: timelineList,
            baseScore: parseFloat(baseScore.toFixed(1)),
        };
    }, [selectedRegion, selectedSchool, selectedGrade, selectedSubject, db]);

    // ----------------------------------------------------
    // Section 11: Gemini AI Insights Generator
    // ----------------------------------------------------
    const geminiInsights = useMemo(() => {
        const topComp = Object.values(filteredData.competencies).reduce(
            (max, c) => c.avgPerformance > max.avgPerformance ? c : max,
            Object.values(filteredData.competencies)[0]
        );
        const lowComp = Object.values(filteredData.competencies).reduce(
            (min, c) => c.avgPerformance < min.avgPerformance ? min : c,
            Object.values(filteredData.competencies)[0]
        );
        const weakSchool = filteredData.schools[filteredData.schools.length - 1]?.name || 'N/A';
        const strongSchool = filteredData.schools[0]?.name || 'N/A';

        const outlineText = `Overall LAT performance is currently stable at an average score of ` +
            `${filteredData.baseScore}%. The assessment completion rate is at ${filteredData.completionPct}%, ` +
            `which demonstrates strong system participation across all diagnostic evaluations.`;

        const strengthText = `Students are demonstrating top-tier performance in "${topComp.name}" ` +
            `with an average competency score of ${topComp.avgPerformance}%. Questions testing basic comprehension ` +
            `and structural communications show high success ratios.`;

        const weaknessText = `A critical performance gap persists in "${lowComp.name}" ` +
            `with a low average competency score of ${lowComp.avgPerformance}%. Additional teacher guidelines ` +
            `and targeted assessments are recommended.`;

        const riskText = `Students at "${weakSchool}" are scoring significantly below the national average. ` +
            `Similarly, Grade 9 Mathematics remains a risk area due to an average completion time exceeding ` +
            `48 minutes per test.`;

        const recText = `1. Deploy immediate remedial worksheets targeting "${lowComp.name}" to Grade 9 educators.\n` +
            `2. Scale training at "${weakSchool}" using successful lesson strategies observed in "${strongSchool}".\n` +
            `3. Leverage Gemini AI to auto-generate 100+ low-difficulty scaffolding questions in Mathematics.`;

        return {
            overall: outlineText,
            strengths: strengthText,
            weaknesses: weaknessText,
            risks: riskText,
            recommendations: recText
        };
    }, [filteredData]);

    // ----------------------------------------------------
    // Section 16: Export Controls (Excel/CSV & PDF)
    // ----------------------------------------------------
    const handleExportExcel = () => {
        const headers = 'Metric,Value,Status\n';
        const rows = [
            `Total Regions,${filteredData.regionsCount},Synced`,
            `Total Schools,${filteredData.schoolsCount},Synced`,
            `Total Teachers,${filteredData.teachersCount},Synced`,
            `Total Students,${filteredData.studentsCount},Synced`,
            `Total Questions,${filteredData.questionsCount},Synced`,
            `Total Assessments,${filteredData.assessmentsCount},Synced`,
            `Average System Score,${filteredData.baseScore}%,Synced`,
            `Completion Rate,${filteredData.completionPct}%,Synced`,
        ].join('\n');

        const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `LAT_Dashboard_Analytics_${new Date().toISOString().split('T')[0]}.csv`);
        link.click();
    };

    const handleExportPDF = () => {
        window.print();
    };

    // ----------------------------------------------------
    // Section 15: Charts Data Structure
    // ----------------------------------------------------
    const doughnutData = {
        labels: ['Completed', 'Running', 'Scheduled', 'Draft', 'Expired', 'Cancelled'],
        datasets: [
            {
                data: [
                    db.assessmentStatuses.completed,
                    filteredData.activeAssessmentsCount,
                    db.assessmentStatuses.scheduled,
                    db.assessmentStatuses.draft,
                    db.assessmentStatuses.expired,
                    db.assessmentStatuses.cancelled,
                ],
                backgroundColor: [
                    '#009966',
                    '#155dfc',
                    '#fbbf24',
                    '#717182',
                    '#ca3500',
                    '#f04438',
                ],
                borderWidth: 1,
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    boxWidth: 12,
                    font: { size: 11 },
                },
            },
        },
    };

    const competencyLabels = Object.values(filteredData.competencies).map((c) => c.name);
    const competencyScores = Object.values(filteredData.competencies).map((c) => c.avgPerformance);
    const competencyCounts = Object.values(filteredData.competencies).map((c) => c.questionCount);

    const radarData = {
        labels: competencyLabels,
        datasets: [
            {
                label: 'Average Performance %',
                data: competencyScores,
                backgroundColor: 'rgba(21, 93, 252, 0.2)',
                borderColor: '#155dfc',
                borderWidth: 2,
                pointBackgroundColor: '#155dfc',
            },
        ],
    };

    const radarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                angleLines: { display: true },
                suggestedMin: 30,
                suggestedMax: 100,
            },
        },
    };

    const barData = {
        labels: competencyLabels,
        datasets: [
            {
                label: 'Question Count',
                data: competencyCounts,
                backgroundColor: 'rgba(130, 0, 219, 0.7)',
                borderColor: '#8200db',
                borderWidth: 1,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true },
        },
    };

    const regionLabels = filteredData.regions.map((r) => r.name);
    const regionScores = filteredData.regions.map((r) => r.avgScore);

    const regionBarData = {
        labels: regionLabels,
        datasets: [
            {
                label: 'Average Score %',
                data: regionScores,
                backgroundColor: '#0092b8',
                borderRadius: 4,
            },
        ],
    };

    // ----------------------------------------------------
    // Section 6: School Leaderboard Search, Sort, Paginate
    // ----------------------------------------------------
    const sortedSchools = useMemo(() => [...filteredData.schools]
            .filter((sch) => sch.name.toLowerCase().includes(schoolSearch.toLowerCase()))
            .sort((a, b) => {
                const aVal = a[schoolSortField];
                const bVal = b[schoolSortField];

                if (typeof aVal === 'string') {
                    return schoolSortOrder === 'asc'
                        ? aVal.localeCompare(String(bVal))
                        : String(bVal).localeCompare(aVal);
                }
                return schoolSortOrder === 'asc'
                    ? (aVal as number) - (bVal as number)
                    : (bVal as number) - (aVal as number);
            }), [filteredData.schools, schoolSearch, schoolSortField, schoolSortOrder]);

    const paginatedSchools = useMemo(() => {
        const startIndex = (schoolPage - 1) * schoolsPerPage;
        return sortedSchools.slice(startIndex, startIndex + schoolsPerPage);
    }, [sortedSchools, schoolPage]);

    const totalSchoolPages = Math.ceil(sortedSchools.length / schoolsPerPage);

    const handleSchoolSort = (field: 'name' | 'avgScore' | 'completionPct') => {
        if (schoolSortField === field) {
            setSchoolSortOrder(schoolSortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSchoolSortField(field);
            setSchoolSortOrder('desc');
        }
        setSchoolPage(1);
    };

    const handleActionClick = (actionId: string) => {
        if (actionId === 'act-excel') {
            handleExportExcel();
        } else if (actionId === 'act-pdf') {
            handleExportPDF();
        } else {
            console.log(`Action triggered: ${actionId}`);
        }
    };

    const handleChartDownload = (chartName: string) => {
        console.log(`Download image request: ${chartName}`);
    };

    return (
        <main className={styles.page}>
            {/* Warning offline replica badge */}
            <div className={styles.warningAlert} role='status'>
                <span style={{ fontSize: '18px' }}>!</span>
                <div>
                    <strong>{DASHBOARD_TEXT.mockAlert}</strong>
                    <div style={{ fontSize: '11px', marginTop: '2px', opacity: 0.9 }}>
                        Global filters will dynamically simulate real-time query recalculations.
                    </div>
                </div>
            </div>

            {/* Header Section */}
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e4d6b' }}>
                        {DASHBOARD_TEXT.title}
                    </h1>
                    <p style={{ fontSize: '13px', color: '#717182' }}>
                        {DASHBOARD_TEXT.subtitle}
                    </p>
                </div>
                <div className={styles.actionsHeader}>
                    <button type='button' className={styles.exportBtn} onClick={handleExportExcel}>
                        ðŸ“¥ Download Excel
                    </button>
                    <button type='button' className={`${styles.exportBtn} ${styles.primary}`} onClick={handleExportPDF}>
                        ðŸ“• Export Dashboard PDF
                    </button>
                </div>
            </header>

            {/* SECTION 14: Global Dashboard Filters */}
            <section className={styles.filtersPanel} aria-label='Dashboard Global Filters'>
                <div className={styles.filterHeader}>
                    <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#000' }}>
                        Global Dashboard Filters
                    </h2>
                    <button type='button' className={styles.resetBtn} onClick={handleResetFilters}>
                        Reset All Filters
                    </button>
                </div>

                <div className={styles.filterGrid}>
                    <div className={styles.filterField}>
                        <label htmlFor='academic-year-select'>Academic Year</label>
                        <select
                            id='academic-year-select'
                            value={selectedAcademicYear}
                            onChange={(e) => setSelectedAcademicYear(e.target.value)}
                        >
                            {FILTER_OPTIONS.academicYears.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterField}>
                        <label htmlFor='assessment-cycle-select'>Assessment Cycle</label>
                        <select
                            id='assessment-cycle-select'
                            value={selectedCycle}
                            onChange={(e) => setSelectedCycle(e.target.value)}
                        >
                            {FILTER_OPTIONS.assessmentCycles.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterField}>
                        <label htmlFor='region-select'>Region</label>
                        <select
                            id='region-select'
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                        >
                            {FILTER_OPTIONS.regions.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterField}>
                        <label htmlFor='school-select'>School</label>
                        <select
                            id='school-select'
                            value={selectedSchool}
                            onChange={(e) => setSelectedSchool(e.target.value)}
                        >
                            {FILTER_OPTIONS.schools.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterField}>
                        <label htmlFor='grade-select'>Grade Level</label>
                        <select
                            id='grade-select'
                            value={selectedGrade}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                        >
                            {FILTER_OPTIONS.grades.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterField}>
                        <label htmlFor='subject-select'>Subject</label>
                        <select
                            id='subject-select'
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                            {FILTER_OPTIONS.subjects.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterField}>
                        <label htmlFor='assessment-select'>Assessment</label>
                        <select
                            id='assessment-select'
                            value={selectedAssessment}
                            onChange={(e) => setSelectedAssessment(e.target.value)}
                        >
                            {FILTER_OPTIONS.assessments.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterField}>
                        <label htmlFor='competency-select'>Competency</label>
                        <select
                            id='competency-select'
                            value={selectedCompetency}
                            onChange={(e) => setSelectedCompetency(e.target.value)}
                        >
                            {FILTER_OPTIONS.competencies.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterField}>
                        <label htmlFor='date-from-input'>From Date</label>
                        <input
                            id='date-from-input'
                            type='date'
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterField}>
                        <label htmlFor='date-to-input'>To Date</label>
                        <input
                            id='date-to-input'
                            type='date'
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* SECTION 1: Executive KPI Cards */}
            <section className={styles.kpiGrid} aria-label='Executive Metrics Summary'>
                {/* Total Regions */}
                <article className={`${styles.kpiCard} ${styles.blue}`}>
                    <div className={styles.kpiHeader}>
                        <span className={styles.kpiTitle}>Total Regions</span>
                        <span className={`${styles.kpiIconWrapper} ${styles.blue}`}>ðŸ—ºï¸</span>
                    </div>
                    <div className={styles.kpiContent}>
                        <span className={styles.kpiValue}>{filteredData.regionsCount}</span>
                        <span className={`${styles.kpiTrendIndicator} ${styles.up}`}>+100%</span>
                    </div>
                    <div className={styles.kpiFooter}>
                        <span>Source: RegionRegistry</span>
                        <span style={{ fontSize: '9px', fontStyle: 'italic' }}>Live synced</span>
                    </div>
                </article>

                {/* Total Schools */}
                <article className={`${styles.kpiCard} ${styles.green}`}>
                    <div className={styles.kpiHeader}>
                        <span className={styles.kpiTitle}>Total Schools</span>
                        <span className={`${styles.kpiIconWrapper} ${styles.green}`}>ðŸ«</span>
                    </div>
                    <div className={styles.kpiContent}>
                        <span className={styles.kpiValue}>{filteredData.schoolsCount}</span>
                        <span className={`${styles.kpiTrendIndicator} ${styles.up}`}>+3.4%</span>
                    </div>
                    <div className={styles.kpiFooter}>
                        <span>Source: SchoolDb</span>
                        <span style={{ fontSize: '9px', fontStyle: 'italic' }}>Live synced</span>
                    </div>
                </article>

                {/* Total Teachers */}
                <article className={`${styles.kpiCard} ${styles.orange}`}>
                    <div className={styles.kpiHeader}>
                        <span className={styles.kpiTitle}>Total Teachers</span>
                        <span className={`${styles.kpiIconWrapper} ${styles.orange}`}>ðŸ‘¨â€ðŸ«</span>
                    </div>
                    <div className={styles.kpiContent}>
                        <span className={styles.kpiValue}>{filteredData.teachersCount}</span>
                        <span className={`${styles.kpiTrendIndicator} ${styles.up}`}>+8.1%</span>
                    </div>
                    <div className={styles.kpiFooter}>
                        <span>Source: UserDirectory</span>
                        <span style={{ fontSize: '9px', fontStyle: 'italic' }}>Live synced</span>
                    </div>
                </article>

                {/* Total Students */}
                <article className={`${styles.kpiCard} ${styles.purple}`}>
                    <div className={styles.kpiHeader}>
                        <span className={styles.kpiTitle}>Total Students</span>
                        <span className={`${styles.kpiIconWrapper} ${styles.purple}`}>ðŸŽ’</span>
                    </div>
                    <div className={styles.kpiContent}>
                        <span className={styles.kpiValue}>{filteredData.studentsCount}</span>
                        <span className={`${styles.kpiTrendIndicator} ${styles.up}`}>+12.4%</span>
                    </div>
                    <div className={styles.kpiFooter}>
                        <span>Source: EnrolmentsDb</span>
                        <span style={{ fontSize: '9px', fontStyle: 'italic' }}>Live synced</span>
                    </div>
                </article>

                {/* Total Questions */}
                <article className={`${styles.kpiCard} ${styles.cyan}`}>
                    <div className={styles.kpiHeader}>
                        <span className={styles.kpiTitle}>Total Questions</span>
                        <span className={`${styles.kpiIconWrapper} ${styles.cyan}`}>â“</span>
                    </div>
                    <div className={styles.kpiContent}>
                        <span className={styles.kpiValue}>{filteredData.questionsCount}</span>
                        <span className={`${styles.kpiTrendIndicator} ${styles.up}`}>+28%</span>
                    </div>
                    <div className={styles.kpiFooter}>
                        <span>Source: QuestionBank</span>
                        <span style={{ fontSize: '9px', fontStyle: 'italic' }}>Live synced</span>
                    </div>
                </article>

                {/* Total Assessments */}
                <article className={`${styles.kpiCard} ${styles.amber}`}>
                    <div className={styles.kpiHeader}>
                        <span className={styles.kpiTitle}>Total Assessments</span>
                        <span className={`${styles.kpiIconWrapper} ${styles.amber}`}>ðŸ“</span>
                    </div>
                    <div className={styles.kpiContent}>
                        <span className={styles.kpiValue}>{filteredData.assessmentsCount}</span>
                        <span className={`${styles.kpiTrendIndicator} ${styles.up}`}>+5.2%</span>
                    </div>
                    <div className={styles.kpiFooter}>
                        <span>Source: AssessmentDb</span>
                        <span style={{ fontSize: '9px', fontStyle: 'italic' }}>Live synced</span>
                    </div>
                </article>

                {/* Total Active Assessments */}
                <article className={`${styles.kpiCard} ${styles.blue}`}>
                    <div className={styles.kpiHeader}>
                        <span className={styles.kpiTitle}>Active Assessments</span>
                        <span className={`${styles.kpiIconWrapper} ${styles.blue}`}>â³</span>
                    </div>
                    <div className={styles.kpiContent}>
                        <span className={styles.kpiValue}>{filteredData.activeAssessmentsCount}</span>
                        <span className={`${styles.kpiTrendIndicator} ${styles.up}`}>Stable</span>
                    </div>
                    <div className={styles.kpiFooter}>
                        <span>Source: LiveEngine</span>
                        <span style={{ fontSize: '9px', fontStyle: 'italic' }}>Live synced</span>
                    </div>
                </article>

                {/* Assessment Completion % */}
                <article className={`${styles.kpiCard} ${styles.green}`}>
                    <div className={styles.kpiHeader}>
                        <span className={styles.kpiTitle}>Completion Rate</span>
                        <span className={`${styles.kpiIconWrapper} ${styles.green}`}>ðŸ“Š</span>
                    </div>
                    <div className={styles.kpiContent}>
                        <span className={styles.kpiValue}>{filteredData.completionPct}%</span>
                        <span className={`${styles.kpiTrendIndicator} ${styles.up}`}>+1.2%</span>
                    </div>
                    <div className={styles.kpiFooter}>
                        <span>Source: ProgressTracker</span>
                        <span style={{ fontSize: '9px', fontStyle: 'italic' }}>Live synced</span>
                    </div>
                </article>

                {/* Today's Active Users */}
                <article className={`${styles.kpiCard} ${styles.orange}`}>
                    <div className={styles.kpiHeader}>
                        <span className={styles.kpiTitle}>Today&apos;s Active Users</span>
                        <span className={`${styles.kpiIconWrapper} ${styles.orange}`}>ðŸ‘¥</span>
                    </div>
                    <div className={styles.kpiContent}>
                        <span className={styles.kpiValue}>{filteredData.activeUsersToday}</span>
                        <span className={`${styles.kpiTrendIndicator} ${styles.up}`}>+4.6%</span>
                    </div>
                    <div className={styles.kpiFooter}>
                        <span>Source: LogService</span>
                        <span style={{ fontSize: '9px', fontStyle: 'italic' }}>Live synced</span>
                    </div>
                </article>

                {/* Questions Generated Today */}
                <article className={`${styles.kpiCard} ${styles.purple}`}>
                    <div className={styles.kpiHeader}>
                        <span className={styles.kpiTitle}>Generated Today</span>
                        <span className={`${styles.kpiIconWrapper} ${styles.purple}`}>ðŸ¤–</span>
                    </div>
                    <div className={styles.kpiContent}>
                        <span className={styles.kpiValue}>{filteredData.questionsGeneratedToday}</span>
                        <span className={`${styles.kpiTrendIndicator} ${styles.up}`}>+14.8%</span>
                    </div>
                    <div className={styles.kpiFooter}>
                        <span>Source: GeminiPipeline</span>
                        <span style={{ fontSize: '9px', fontStyle: 'italic' }}>Live synced</span>
                    </div>
                </article>

                {/* Students Attempted Today */}
                <article className={`${styles.kpiCard} ${styles.cyan}`}>
                    <div className={styles.kpiHeader}>
                        <span className={styles.kpiTitle}>Students Attempted Today</span>
                        <span className={`${styles.kpiIconWrapper} ${styles.cyan}`}>âœï¸</span>
                    </div>
                    <div className={styles.kpiContent}>
                        <span className={styles.kpiValue}>{filteredData.studentsAttemptedToday}</span>
                        <span className={`${styles.kpiTrendIndicator} ${styles.up}`}>+22.5%</span>
                    </div>
                    <div className={styles.kpiFooter}>
                        <span>Source: SubmissionQueue</span>
                        <span style={{ fontSize: '9px', fontStyle: 'italic' }}>Live synced</span>
                    </div>
                </article>

                {/* Reports Generated Today */}
                <article className={`${styles.kpiCard} ${styles.amber}`}>
                    <div className={styles.kpiHeader}>
                        <span className={styles.kpiTitle}>Reports Today</span>
                        <span className={`${styles.kpiIconWrapper} ${styles.amber}`}>ðŸ“ˆ</span>
                    </div>
                    <div className={styles.kpiContent}>
                        <span className={styles.kpiValue}>{filteredData.reportsGeneratedToday}</span>
                        <span className={`${styles.kpiTrendIndicator} ${styles.up}`}>+19.2%</span>
                    </div>
                    <div className={styles.kpiFooter}>
                        <span>Source: ReportBroker</span>
                        <span style={{ fontSize: '9px', fontStyle: 'italic' }}>Live synced</span>
                    </div>
                </article>
            </section>

            {/* Dashboard Visual Grid Row: Status & Question Bank */}
            <div className={styles.dashboardRow}>
                {/* SECTION 2: Assessment Status */}
                <div
                    className={`${styles.col6} ${styles.card} ${
                        fullscreenChart === 'status' ? styles.fullscreen : ''
                    }`}
                >
                    <div className={styles.cardHeader}>
                        <div className={styles.cardTitleWrapper}>
                            <h3 className={styles.cardTitle}>Assessment Status Distribution</h3>
                            <span className={styles.cardSubtitle}>Total breakdowns from active academic schedule</span>
                        </div>
                        <div className={styles.cardControls}>
                            <button
                                type='button'
                                className={styles.controlBtn}
                                onClick={() => handleChartDownload('Assessment Status')}
                            >
                                ðŸ’¾
                            </button>
                            <button
                                type='button'
                                className={styles.controlBtn}
                                onClick={() => setFullscreenChart(fullscreenChart === 'status' ? null : 'status')}
                            >
                                {fullscreenChart === 'status' ? 'ðŸ——' : 'ðŸ—–'}
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'center' }}>
                        <div className={styles.chartContainer}>
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                        </div>
                        <div className={styles.assessmentStatusGrid}>
                            <div className={styles.statusMiniCard}>
                                <div className={styles.statusVal} style={{ color: '#009966' }}>
                                    {db.assessmentStatuses.completed}
                                </div>
                                <div className={styles.statusLbl}>Completed</div>
                            </div>
                            <div className={styles.statusMiniCard}>
                                <div className={styles.statusVal} style={{ color: '#155dfc' }}>
                                    {filteredData.activeAssessmentsCount}
                                </div>
                                <div className={styles.statusLbl}>Running</div>
                            </div>
                            <div className={styles.statusMiniCard}>
                                <div className={styles.statusVal} style={{ color: '#fbbf24' }}>
                                    {db.assessmentStatuses.scheduled}
                                </div>
                                <div className={styles.statusLbl}>Scheduled</div>
                            </div>
                            <div className={styles.statusMiniCard}>
                                <div className={styles.statusVal} style={{ color: '#717182' }}>
                                    {db.assessmentStatuses.draft}
                                </div>
                                <div className={styles.statusLbl}>Draft</div>
                            </div>
                            <div className={styles.statusMiniCard}>
                                <div className={styles.statusVal} style={{ color: '#ca3500' }}>
                                    {db.assessmentStatuses.expired}
                                </div>
                                <div className={styles.statusLbl}>Expired</div>
                            </div>
                            <div className={styles.statusMiniCard}>
                                <div className={styles.statusVal} style={{ color: '#f04438' }}>
                                    {db.assessmentStatuses.cancelled}
                                </div>
                                <div className={styles.statusLbl}>Cancelled</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 3: Question Bank Analytics */}
                <div className={`${styles.col6} ${styles.card}`}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardTitleWrapper}>
                            <h3 className={styles.cardTitle}>Question Bank Analytics</h3>
                            <span className={styles.cardSubtitle}>Approved, pending review, and grade levels</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className={styles.questionsListGrid}>
                            <div className={`${styles.questionMiniCard} ${styles.approved}`}>
                                <div className={styles.qValue}>{filteredData.qApproved}</div>
                                <div className={styles.qLabel}>Approved Items</div>
                            </div>
                            <div className={`${styles.questionMiniCard} ${styles.pending}`}>
                                <div className={styles.qValue}>{filteredData.qPending}</div>
                                <div className={styles.qLabel}>Pending Review</div>
                            </div>
                            <div className={`${styles.questionMiniCard} ${styles.rejected}`}>
                                <div className={styles.qValue}>{filteredData.qRejected}</div>
                                <div className={styles.qLabel}>Rejected Items</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '12px' }}>
                            <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
                                <strong style={{ display: 'block', marginBottom: '8px', color: '#1e4d6b' }}>
                                    Grade Breakdowns
                                </strong>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span>Grade 3:</span> <strong>{db.questionBank.grade3}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span>Grade 5:</span> <strong>{db.questionBank.grade5}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Grade 9:</span> <strong>{db.questionBank.grade9}</strong>
                                </div>
                            </div>

                            <div style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px' }}>
                                <strong style={{ display: 'block', marginBottom: '8px', color: '#1e4d6b' }}>
                                    Metadata Details
                                </strong>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span>With Images:</span> <strong>{db.questionBank.withImages}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span>Gemini Generated:</span> <strong>{db.questionBank.geminiGenerated}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8200db' }}>
                                    <span>Gemini Ratio:</span>
                                    <strong>
                                        {((db.questionBank.geminiGenerated / filteredData.questionsCount) * 100)
                                            .toFixed(1)}%
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 4: Competency Analytics */}
            <section className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardTitleWrapper}>
                        <h3 className={styles.cardTitle}>Competency Analytics</h3>
                        <span className={styles.cardSubtitle}>
                            Multi-dimensional evaluations of the 7 core competencies
                        </span>
                    </div>
                    <div className={styles.cardControls}>
                        <button
                            type='button'
                            className={styles.controlBtn}
                            onClick={() => handleChartDownload('Competencies')}
                        >
                            ðŸ’¾
                        </button>
                    </div>
                </div>

                <div className={styles.dashboardRow}>
                    <div className={styles.col4} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1e4d6b' }}>Performance Radar</h4>
                        <div className={styles.chartContainer} style={{ minHeight: '220px' }}>
                            <Radar data={radarData} options={radarOptions} />
                        </div>
                    </div>

                    <div className={styles.col4} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1e4d6b' }}>
                            Question Counts by Competency
                        </h4>
                        <div className={styles.chartContainer} style={{ minHeight: '220px' }}>
                            <Bar data={barData} options={barOptions} />
                        </div>
                    </div>

                    <div className={styles.col4} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1e4d6b' }}>
                            National Performance Leaderboard
                        </h4>
                        <table className={styles.leaderboardTable}>
                            <thead>
                                <tr>
                                    <th>Competency</th>
                                    <th>Avg Score</th>
                                    <th>Correct %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(filteredData.competencies).map((comp) => (
                                    <tr key={comp.name}>
                                        <td>{comp.name}</td>
                                        <td style={{ fontWeight: '700' }}>{comp.avgPerformance}%</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div
                                                    style={{
                                                        flexGrow: 1,
                                                        background: '#e5e7eb',
                                                        height: '6px',
                                                        borderRadius: '3px',
                                                        width: '50px',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            background: '#009966',
                                                            height: '100%',
                                                            width: `${comp.correctPct}%`
                                                        }}
                                                    />
                                                </div>
                                                <span>{comp.correctPct}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Heatmap Row */}
                <div style={{ borderTop: '1px solid #ececf0', paddingTop: '16px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1e4d6b', marginBottom: '12px' }}>
                        Competency Performance Matrix (Heatmap)
                    </h4>
                    <div className={styles.heatMapGrid}>
                        {Object.values(filteredData.competencies).map((comp) => {
                            let cellClass = styles['level-high'];
                            if (comp.avgPerformance < 65) cellClass = styles['level-low'];
                            else if (comp.avgPerformance < 75) cellClass = styles['level-med'];
                            else if (comp.avgPerformance >= 80) cellClass = styles['level-elite'];

                            return (
                                <div key={`heat-${comp.name}`} className={`${styles.heatMapCell} ${cellClass}`}>
                                    <span>{comp.name}</span>
                                    <strong style={{ fontSize: '16px' }}>{comp.avgPerformance}%</strong>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* SECTION 5 & 6: Region and School performance */}
            <div className={styles.dashboardRow}>
                {/* Region Analytics */}
                <div className={`${styles.col6} ${styles.card}`}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardTitleWrapper}>
                            <h3 className={styles.cardTitle}>Region Analytics Summary</h3>
                            <span className={styles.cardSubtitle}>Regional scores vs national diagnostic averages</span>
                        </div>
                    </div>

                    <div className={styles.chartContainer} style={{ minHeight: '180px' }}>
                        <Bar data={regionBarData} options={{ ...barOptions, plugins: { legend: { display: false } } }} />
                    </div>

                    <table className={styles.leaderboardTable} style={{ fontSize: '12px' }}>
                        <thead>
                            <tr>
                                <th>Region</th>
                                <th>Avg Score</th>
                                <th>Participation</th>
                                <th>Schools</th>
                                <th>vs Nat. Avg</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.regions.map((reg) => (
                                <tr key={reg.id}>
                                    <td style={{ fontWeight: '600' }}>{reg.name}</td>
                                    <td>{reg.avgScore}%</td>
                                    <td>{reg.participationPct}%</td>
                                    <td>{reg.totalSchools}</td>
                                    <td
                                        style={{
                                            color: reg.vsNationalAvg >= 0 ? '#009966' : '#f04438',
                                            fontWeight: '700'
                                        }}
                                    >
                                        {reg.vsNationalAvg >= 0 ? `+${reg.vsNationalAvg}` : reg.vsNationalAvg}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* School Performance Leaderboard with search, sort, pagination */}
                <div className={`${styles.col6} ${styles.card}`}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardTitleWrapper}>
                            <h3 className={styles.cardTitle}>School Performance Leaderboard</h3>
                            <span className={styles.cardSubtitle}>Sort, search, and page through national registries</span>
                        </div>
                    </div>

                    <div className={styles.tableToolbar}>
                        <input
                            type='text'
                            className={styles.searchInput}
                            placeholder='ðŸ” Search school by name...'
                            value={schoolSearch}
                            onChange={(e) => {
                                setSchoolSearch(e.target.value);
                                setSchoolPage(1);
                            }}
                        />

                        <div className={styles.pagination}>
                            <button
                                type='button'
                                onClick={() => setSchoolPage((p) => Math.max(1, p - 1))}
                                disabled={schoolPage === 1}
                            >
                                Prev
                            </button>
                            <span style={{ fontSize: '12px', color: '#717182' }}>
                                Page {schoolPage} of {Math.max(1, totalSchoolPages)}
                            </span>
                            <button
                                type='button'
                                onClick={() => setSchoolPage((p) => Math.min(totalSchoolPages, p + 1))}
                                disabled={schoolPage === totalSchoolPages || totalSchoolPages === 0}
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    <table className={styles.leaderboardTable} style={{ fontSize: '12px' }}>
                        <thead>
                            <tr>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSchoolSort('name')}>
                                    School Name {schoolSortField === 'name' ? (
                                        schoolSortOrder === 'asc' ? 'â–²' : 'â–¼'
                                    ) : ''}
                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSchoolSort('avgScore')}>
                                    Avg Score {schoolSortField === 'avgScore' ? (
                                        schoolSortOrder === 'asc' ? 'â–²' : 'â–¼'
                                    ) : ''}
                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSchoolSort('completionPct')}>
                                    Completion {schoolSortField === 'completionPct' ? (
                                        schoolSortOrder === 'asc' ? 'â–²' : 'â–¼'
                                    ) : ''}
                                </th>
                                <th>Region</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedSchools.length > 0 ? (
                                paginatedSchools.map((sch, index) => (
                                    <tr key={sch.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span
                                                    className={`${styles.rankBadge} ${
                                                        index + (schoolPage - 1) * schoolsPerPage === 0
                                                            ? styles.top1
                                                            : index + (schoolPage - 1) * schoolsPerPage === 1
                                                            ? styles.top2
                                                            : index + (schoolPage - 1) * schoolsPerPage === 2
                                                            ? styles.top3
                                                            : styles.other
                                                    }`}
                                                >
                                                    {index + 1 + (schoolPage - 1) * schoolsPerPage}
                                                </span>
                                                <span>{sch.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: '700' }}>{sch.avgScore}%</td>
                                        <td>{sch.completionPct}%</td>
                                        <td>
                                            {sch.regionId === 'reg-north'
                                                ? 'Northern'
                                                : sch.regionId === 'reg-south'
                                                ? 'Southern'
                                                : sch.regionId === 'reg-east'
                                                ? 'Eastern'
                                                : sch.regionId === 'reg-west'
                                                ? 'Western'
                                                : 'Central'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#717182' }}>
                                        No schools matching the criteria were found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SECTION 7: Grade Analytics */}
            <section className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardTitleWrapper}>
                        <h3 className={styles.cardTitle}>Grade Analytics Breakdowns</h3>
                        <span className={styles.cardSubtitle}>Granular performance reviews for key benchmarks</span>
                    </div>
                </div>

                <div className={styles.dashboardRow}>
                    {Object.entries(filteredData.grades).map(([gradeNum, stats]) => (
                        <div
                            key={`grade-${gradeNum}`}
                            className={`${styles.col4}`}
                            style={{
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                padding: '16px'
                            }}
                        >
                            <div
                                style={{
                                    borderBottom: '1px solid #e2e8f0',
                                    paddingBottom: '8px',
                                    marginBottom: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#1e4d6b' }}>
                                    Grade {gradeNum}
                                </h4>
                                <span
                                    style={{
                                        background: '#eff6ff',
                                        color: '#155dfc',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                        fontWeight: '600'
                                    }}
                                >
                                    {stats.students.toLocaleString()} Students
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Average Score:</span>
                                    <strong style={{ fontSize: '14px', color: '#155dfc' }}>{stats.avgScore}%</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Accuracy Rate:</span>
                                    <strong>{stats.avgAccuracy}%</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Avg Completion Time:</span>
                                    <strong>{stats.avgTimeTaken}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#b42318' }}>
                                    <span>Weakest Competency:</span>
                                    <strong style={{ fontWeight: '700' }}>{stats.weakestCompetency}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#009966' }}>
                                    <span>Strongest Competency:</span>
                                    <strong style={{ fontWeight: '700' }}>{stats.strongestCompetency}</strong>
                                </div>

                                {/* Difficulty breakdown */}
                                <div style={{ marginTop: '10px' }}>
                                    <span style={{ fontSize: '11px', color: '#717182', display: 'block', marginBottom: '4px' }}>
                                        Difficulty Curve
                                    </span>
                                    <div style={{ display: 'flex', height: '16px', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div
                                            style={{
                                                width: `${stats.difficultyAnalysis.easyPct}%`,
                                                background: '#009966',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#fff',
                                                fontSize: '9px'
                                            }}
                                            title='Easy'
                                        >
                                            E:{stats.difficultyAnalysis.easyPct}%
                                        </div>
                                        <div
                                            style={{
                                                width: `${stats.difficultyAnalysis.mediumPct}%`,
                                                background: '#fbbf24',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#333',
                                                fontSize: '9px'
                                            }}
                                            title='Medium'
                                        >
                                            M:{stats.difficultyAnalysis.mediumPct}%
                                        </div>
                                        <div
                                            style={{
                                                width: `${stats.difficultyAnalysis.hardPct}%`,
                                                background: '#f04438',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#fff',
                                                fontSize: '9px'
                                            }}
                                            title='Hard'
                                        >
                                            H:{stats.difficultyAnalysis.hardPct}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 8: Subject Analytics */}
            <section className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardTitleWrapper}>
                        <h3 className={styles.cardTitle}>Subject Analytics Metrics</h3>
                        <span className={styles.cardSubtitle}>
                            Syllabus accuracy, difficult syllabus nodes, and participation rates
                        </span>
                    </div>
                </div>

                <div className={styles.subjectCardsGrid}>
                    {Object.entries(filteredData.subjects).map(([subjKey, subjData]) => (
                        <article key={subjKey} className={styles.subjectMetricCard}>
                            <h4 className={styles.subjectTitle}>{subjData.name}</h4>
                            <div className={styles.subjectGrid}>
                                <div className={styles.gridItem}>
                                    <span>Average Score</span>
                                    <span style={{ fontSize: '14px', color: '#0092b8' }}>{subjData.avgScore}%</span>
                                </div>
                                <div className={styles.gridItem}>
                                    <span>Participation Rate</span>
                                    <span>{subjData.participation}%</span>
                                </div>
                                <div className={styles.gridItem}>
                                    <span>Avg Completion Time</span>
                                    <span>{subjData.avgCompletionTime}</span>
                                </div>
                                <div className={styles.gridItem}>
                                    <span>Question Accuracy</span>
                                    <span>{subjData.questionAccuracy}%</span>
                                </div>
                                <div className={styles.gridItem} style={{ gridColumn: 'span 2' }}>
                                    <span style={{ color: '#b42318' }}>Most Difficult Concept (Lowest Score)</span>
                                    <span style={{ color: '#b42318' }}>{subjData.mostDifficultConcept}</span>
                                </div>
                                <div className={styles.gridItem} style={{ gridColumn: 'span 2' }}>
                                    <span style={{ color: '#009966' }}>Most Successful Concept (Highest Score)</span>
                                    <span style={{ color: '#009966' }}>{subjData.mostSuccessfulConcept}</span>
                                </div>
                                <div className={styles.gridItem}>
                                    <span>Strong Competency</span>
                                    <span style={{ color: '#009966' }}>{subjData.strongCompetency}</span>
                                </div>
                                <div className={styles.gridItem}>
                                    <span>Weak Competency</span>
                                    <span style={{ color: '#b42318' }}>{subjData.weakCompetency}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Live assessment monitor & Recent Activities */}
            <div className={styles.dashboardRow}>
                {/* SECTION 9: Live Assessment Monitor */}
                <div className={`${styles.col8} ${styles.card}`}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardTitleWrapper}>
                            <h3 className={styles.cardTitle}>ðŸ”´ Live Assessment Monitor</h3>
                            <span className={styles.cardSubtitle}>
                                Real-time system telemetry. Auto-refreshing every 30 seconds.
                            </span>
                        </div>
                        <div
                            style={{
                                fontSize: '11px',
                                color: '#009966',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <span style={{ width: '6px', height: '6px', background: '#009966', borderRadius: '50%' }} />
                            <span>Last Updated: {liveTime}s ago</span>
                        </div>
                    </div>

                    <div className={styles.liveMonitorGrid}>
                        <div className={styles.liveCard}>
                            <div className={styles.statusVal}>{filteredData.activeAssessmentsCount}</div>
                            <div className={styles.statusLbl}>Active Test Nodes</div>
                        </div>
                        <div className={styles.liveCard}>
                            <div className={styles.statusVal}>{liveOnlineCount}</div>
                            <div className={styles.statusLbl}>Students Online</div>
                        </div>
                        <div className={styles.liveCard}>
                            <div className={styles.statusVal}>{liveTakingCount}</div>
                            <div className={styles.statusLbl}>Actively Testing</div>
                        </div>
                        <div className={styles.liveCard}>
                            <div className={styles.statusVal}>{liveCompletedCount}</div>
                            <div className={styles.statusLbl}>Tests Completed Today</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '10px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1e4d6b', marginBottom: '8px' }}>
                            Recent Submissions Pipeline
                        </h4>
                        <table className={styles.leaderboardTable} style={{ fontSize: '12px' }}>
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Grade</th>
                                    <th>Subject</th>
                                    <th>Location IP</th>
                                    <th>Duration</th>
                                    <th>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>STUD-2850</td>
                                    <td>Grade 9</td>
                                    <td>Science</td>
                                    <td>10.14.22.81</td>
                                    <td>32 mins</td>
                                    <td style={{ color: '#009966', fontWeight: '700' }}>Passed (84%)</td>
                                </tr>
                                <tr>
                                    <td>STUD-4920</td>
                                    <td>Grade 5</td>
                                    <td>Mathematics</td>
                                    <td>10.12.18.25</td>
                                    <td>41 mins</td>
                                    <td style={{ color: '#fbbf24', fontWeight: '700' }}>Remedial (61%)</td>
                                </tr>
                                <tr>
                                    <td>STUD-8119</td>
                                    <td>Grade 3</td>
                                    <td>English</td>
                                    <td>10.14.99.14</td>
                                    <td>18 mins</td>
                                    <td style={{ color: '#009966', fontWeight: '700' }}>Passed (95%)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SECTION 10: Recent Activities Timeline */}
                <div className={`${styles.col4} ${styles.card}`}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardTitleWrapper}>
                            <h3 className={styles.cardTitle}>Recent System Activities</h3>
                            <span className={styles.cardSubtitle}>Audit trail of system events</span>
                        </div>
                    </div>

                    <div className={styles.timeline}>
                        {filteredData.timeline.map((evt) => (
                            <div key={evt.id} className={styles.timelineItem}>
                                <div className={`${styles.timelineDot} ${styles[evt.type]}`}>
                                    {evt.type === 'question' ? 'ðŸ¤–' :
                                     evt.type === 'assessment' ? 'ðŸ“' :
                                     evt.type === 'student' ? 'ðŸŽ’' :
                                     evt.type === 'teacher' ? 'ðŸ‘¤' :
                                     evt.type === 'report' ? 'ðŸ“Š' : 'ðŸ”‘'}
                                </div>
                                <div className={styles.timelineContent}>
                                    <span className={styles.timeText}>{evt.timestamp}</span>
                                    <span className={styles.descText}>{evt.description}</span>
                                    <span className={styles.userText}>Triggered by: {evt.user}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SECTION 11: Gemini AI Insights Panel */}
            <section className={styles.aiInsightsPanel}>
                <div className={styles.aiHeader}>
                    <span className={styles.aiSparkIcon}>âœ¨</span>
                    <span>Gemini AI Insights & Analysis</span>
                </div>

                <div className={styles.dashboardRow}>
                    <div className={`${styles.col6} ${styles.insightCard}`}>
                        <h4>System Performance Summary</h4>
                        <p>{geminiInsights.overall}</p>
                    </div>

                    <div className={`${styles.col6} ${styles.insightCard}`}>
                        <h4>National Strengths</h4>
                        <p>{geminiInsights.strengths}</p>
                    </div>

                    <div className={`${styles.col6} ${styles.insightCard}`} style={{ borderColor: '#ca3500' }}>
                        <h4>Identified Weaknesses</h4>
                        <p>{geminiInsights.weaknesses}</p>
                    </div>

                    <div className={`${styles.col6} ${styles.insightCard}`} style={{ borderColor: '#b42318' }}>
                        <h4>Risk Factors & Escalations</h4>
                        <p>{geminiInsights.risks}</p>
                    </div>

                    <div
                        className={`${styles.col12} ${styles.insightCard}`}
                        style={{ borderColor: '#155dfc', background: '#fff' }}
                    >
                        <h4 style={{ color: '#155dfc' }}>Recommended Interventions & Dynamic Suggestions</h4>
                        <p style={{ whiteSpace: 'pre-line' }}>{geminiInsights.recommendations}</p>
                    </div>
                </div>
            </section>

            {/* SECTION 12: Quick Actions */}
            <section className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardTitleWrapper}>
                        <h3 className={styles.cardTitle}>Quick System Actions Shortcuts</h3>
                        <span className={styles.cardSubtitle}>Instant operations panel</span>
                    </div>
                </div>

                <div className={styles.quickActionGrid}>
                    {QUICK_ACTIONS.map((action) => (
                        <button
                            key={action.id}
                            className={styles.quickActionCard}
                            onClick={() => handleActionClick(action.id)}
                            type='button'
                        >
                            <span className={styles.actionIcon}>{action.icon}</span>
                            <span className={styles.actionLabel}>{action.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* SECTION 13: System Health Monitor */}
            <section className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardTitleWrapper}>
                        <h3 className={styles.cardTitle}>Enterprise System Health</h3>
                        <span className={styles.cardSubtitle}>
                            Latency monitoring, cluster health, backups, and response rates
                        </span>
                    </div>
                </div>

                <div className={styles.healthGrid}>
                    <div className={styles.healthItem}>
                        <span className={styles.healthVal} style={{ color: '#009966' }}>
                            {SYSTEM_HEALTH_STATS.backend}
                        </span>
                        <span className={styles.healthLabel}>Backend Status</span>
                    </div>
                    <div className={styles.healthItem}>
                        <span className={styles.healthVal}>{SYSTEM_HEALTH_STATS.database}</span>
                        <span className={styles.healthLabel}>Database Replication</span>
                    </div>
                    <div className={styles.healthItem}>
                        <span className={styles.healthVal} style={{ color: '#8200db' }}>
                            {SYSTEM_HEALTH_STATS.gemini}
                        </span>
                        <span className={styles.healthLabel}>Gemini AI Service</span>
                    </div>
                    <div className={styles.healthItem}>
                        <span className={styles.healthVal}>{SYSTEM_HEALTH_STATS.responseTime}</span>
                        <span className={styles.healthLabel}>API Avg Response Time</span>
                    </div>
                    <div className={styles.healthItem}>
                        <span className={styles.healthVal}>{SYSTEM_HEALTH_STATS.storage}</span>
                        <span className={styles.healthLabel}>Disk Storage Usage</span>
                    </div>
                    <div className={styles.healthItem}>
                        <span className={styles.healthVal}>{SYSTEM_HEALTH_STATS.todayRequests}</span>
                        <span className={styles.healthLabel}>Requests Handled Today</span>
                    </div>
                    <div className={styles.healthItem}>
                        <span className={styles.healthVal} style={{ color: '#f04438' }}>
                            {SYSTEM_HEALTH_STATS.todayErrors}
                        </span>
                        <span className={styles.healthLabel}>Uncaught Errors</span>
                    </div>
                    <div className={styles.healthItem}>
                        <span className={styles.healthVal}>{SYSTEM_HEALTH_STATS.lastBackup}</span>
                        <span className={styles.healthLabel}>Last Backup Timestamp</span>
                    </div>
                    <div className={styles.healthItem}>
                        <span className={styles.healthVal}>{SYSTEM_HEALTH_STATS.uptime}</span>
                        <span className={styles.healthLabel}>Cluster Uptime</span>
                    </div>
                </div>
            </section>

        </main>
    );
};

export default memo(DashboardPage);
