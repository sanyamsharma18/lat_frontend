## Teacher Management Module

### Added

- Teacher List page for Admin users at `/admin/teachers`.
- Add Teacher flow using a modal form.
- Edit Teacher flow using the same reusable modal form.
- Delete Teacher flow using a confirmation modal instead of a browser confirmation.
- Search and pagination controls for the teacher list.
- Protected frontend API routes that proxy teacher requests to the backend with the server-side auth cookie.

### Reused Components

- `DataTable` for the teacher list.
- `Input` for search and form fields.
- `Button` for page, form, pagination, retry, and confirmation actions.
- `Modal` for add, edit, and delete dialogs.
- `Text` for typography consistency.
- `ShimmerUiContainer` for loading state.
- `Toaster` and `showToast` for success and error feedback.

### API Integration

- `GET /api/admin/teachers` proxies to `adminTeachers`.
- `POST /api/admin/teachers` creates a teacher.
- `PUT /api/admin/teachers/[teacherId]` updates a teacher.
- `DELETE /api/admin/teachers/[teacherId]` deletes a teacher.
- Backend target added as `API_ROUTES.adminTeachers`, mapped to `/admin/teachers` under the configured backend API URL.

### Architecture Decisions

- The route page remains a Server Component because it only renders the module entry point and metadata.
- The teacher management screen is a Client Component because search, pagination, modal state, form input, and mutations require browser interactivity.
- TanStack Query is used for teacher list caching and mutations because the project already has a global QueryClient.
- Mutations invalidate the shared `teachers` query key so list data refreshes through the existing cache flow.
- API calls go through local route handlers so protected backend requests can use the httpOnly auth cookie on the server.

### Testing Notes

- Verify the Admin sidebar opens `/admin/teachers`.
- Verify teacher list loading, empty, and error states.
- Verify search resets pagination to page 1.
- Verify Add Teacher requires both teacher name and school.
- Verify Edit Teacher pre-fills existing values and updates the list after save.
- Verify Delete Teacher opens a confirmation modal and refreshes the list after delete.
- Verify API failure messages appear as toast notifications.

### Future Improvements

- Add server-side initial teacher prefetching if the project adds React Query dehydration support.
- Replace free-text School with a reusable school dropdown when a school list API is available.
- Add table sorting when the project has a reusable sorting pattern.

## Teacher Management Enhancements

### Added Columns

- Grade
- Subject
- Region

### Added Filters

- Region Filter
- School Filter dependent on the selected Region
- Teacher Name Search

### API Changes

- Teachers API now supports `teacherName`, `regionId`, `schoolId`, `page`, and `limit` query parameters.
- Regions API is integrated through `/api/admin/regions`.
- Schools By Region API is integrated through `/api/admin/schools?regionId=...`.

### Query Updates

- Teacher Query now includes the full filter object in the query key.
- Region Query uses the `regions` query key.
- School Query uses the `schools` query key with `regionId` and only runs after Region selection.

### Testing Notes

- Verify the table shows Teacher Name, Grade, Subject, School Name, Region, and Actions.
- Verify Region filter refreshes the teacher list.
- Verify School filter is disabled until a Region is selected.
- Verify changing Region clears the selected School.
- Verify School options load for the selected Region.
- Verify Teacher Name search works alone and in combination with Region and School filters.

## Teacher Management UI Improvements

### Improved Layout

- Redesigned the filter area into a compact admin toolbar.
- Moved Search and Add Teacher actions into the toolbar for faster workflow.
- Reduced excess spacing so the page uses screen space more efficiently.

### Table Improvements

- Improved table density, header styling, hover state, and mobile card spacing.
- Added a friendlier empty state with an Add Teacher action.
- Kept loading state inside the table container using shimmer rows.

### Error Handling Improvements

- Teacher, Region, and School queries now fall back to development data if APIs fail.
- Add, Edit, and Delete actions use development success fallback when backend APIs are unavailable.
- A compact warning message appears when fallback teacher data is being shown.

### Modal Improvements

- Add/Edit Teacher now includes Teacher Name, Grade, Subject, Region, and School.
- School selection depends on the selected Region.
- Modal layout is responsive and uses existing inputs, dropdowns, and buttons.

### Dropdown Rendering Fix

- Fixed Region and School dropdown menus rendering as oversized empty cards.
- Removed forced dropdown menu minimum height from the shared Dropdown styles.
- Standardized Teacher Management filter controls to compact dashboard heights.

## Teacher Management Filter and Upload Update

### Feature Name

Teacher Management Compact Filters and Teacher Upload

### What Changed

- Region, School, Teacher Name, Search, Clear, Add Teacher, and Upload Teachers now sit in one compact toolbar row on desktop.
- Added a Clear button that resets Region, School, Teacher Name, and pagination.
- Removed the Teacher toolbar's ineffective nested input height override and applied compact classes directly to each reusable control.
- Added an Upload Teachers action that accepts an Excel/CSV file or a Google Sheet URL.
- Added a Download Template action in Upload Teachers so admins can download the correct teacher upload headers.
- Added a local upload API route that forwards teacher upload form data to the backend service layer.

### Why It Changed

- The dropdowns were visually too tall because height was being controlled inconsistently: the shared dropdown had forced sizing and the Teacher page tried to override an internal Input class that is hidden by CSS modules.
- Admin users need a bulk upload path so they can add teachers from existing spreadsheets.

### Files Modified

- `src/components/ui/Dropdown/styles.module.scss`
- `src/features/teacherManagement/components/TeacherManagementPage/index.tsx`
- `src/features/teacherManagement/components/TeacherManagementPage/styles.module.scss`
- `src/features/teacherManagement/components/TeacherManagementPage/constant.ts`
- `src/features/teacherManagement/components/TeacherManagementPage/utils.ts`
- `src/features/teacherManagement/hooks/useTeacherManagement.ts`
- `src/types/teacher.ts`
- `src/config/apiRoutes.ts`
- `src/constants/serverSideRoutes.ts`
- `src/services/teacher/teacher.service.ts`
- `src/app/api/admin/teachers/upload/route.ts`

### Files Created

- `src/features/teacherManagement/components/TeacherManagementPage/components/UploadTeacherModal/index.tsx`
- `src/features/teacherManagement/components/TeacherManagementPage/components/UploadTeacherModal/styles.module.scss`

### Components Affected

- Teacher Management page toolbar
- Region and School filter dropdowns
- Teacher Name filter input
- Teacher upload modal

### APIs Affected

- Added `POST /api/admin/teachers/upload`.
- Added `GET /api/admin/teachers/template`.
- Backend target added as `API_ROUTES.uploadTeachers`.

### Breaking Changes

- None.

### Testing Considerations

- Verify Region, School, Teacher Name, Search, Clear, Add Teacher, and Upload Teachers align in one row on desktop.
- Verify Clear resets Region, School, Teacher Name, and returns the list to page 1.
- Verify School remains disabled until Region is selected.
- Verify Upload Teachers opens a modal.
- Verify Download Template downloads `teacher-upload-template.csv` with the teacher upload headers.
- Verify upload requires either a spreadsheet file or a Google Sheet URL.
- Verify upload sends multipart form data and refreshes the teacher list after success.

### Future Improvements

- Add a downloadable teacher upload template when the backend format is finalized.
- Show row-level upload validation results if the backend returns them.

## Dashboard Module

### Added

- Reports & Analytics Dashboard at `/admin/dashboard`.
- Total Teachers Card.
- Total Students Card.
- Total Questions Generated Card.
- Questions Attempted Last Year Card.
- Dashboard sidebar navigation item for Admin users.
- Loading shimmer state for dashboard summary cards.
- Graceful temporary-data alert when backend dashboard data is unavailable.

### APIs

- Added `GET /api/admin/dashboard`.
- Dashboard service targets `API_ROUTES.dashboardSummary`.

### Query Keys

- `dashboard-summary`

### Mock Data

- Added temporary mock dashboard response:
    - Total Teachers: 125
    - Total Students: 4,250
    - Total Questions Generated: 25,840
    - Questions Attempted Last Year: 18,520

### Reused Components

- `DashboardStatCard` for metric cards.
- `ShimmerUiContainer` for loading state.
- `Text` for typography consistency.
- Existing `AdminShell` and Admin route layout.

### Architecture Notes

- Dashboard route follows the existing Admin page pattern: Server Component route renders a Client Component module.
- TanStack Query is used through a dedicated dashboard hook.
- Dashboard data goes through a local API route and service layer so the UI does not need to change when real APIs are available.

### Future Enhancements

- Charts.
- Trends.
- Performance Analytics.
- School-wise Reports.

## Teacher Portal

### Dashboard

- Added Teacher Dashboard at `/teacher/dashboard`.
- Added Total Students summary card.
- Added Active Students summary card.
- Added Inactive Students summary card.
- Added Questions Attempted summary card.

### Student Management

- Added Student Management at `/teacher/students`.
- Added student list table with Student Name, Grade, Section, Father Name, Mother Name, Gender, DOB, Status, and Actions.
- Added Add Student modal.
- Added Edit Student modal using the same reusable form.
- Added Delete Student confirmation modal.
- Added CSV and Excel upload action.
- Added student upload template download action.
- Added upload preview with file name, total records, validation errors, and success count.
- Added Student Name, Grade, Section, and Status filters.
- Added Clear Filters action.
- Added Active/Inactive status toggle.

### APIs

- Added `GET /api/teacher/dashboard`.
- Added `GET /api/teacher/students`.
- Added `POST /api/teacher/students`.
- Added `PUT /api/teacher/students/[studentId]`.
- Added `DELETE /api/teacher/students/[studentId]`.
- Added `PATCH /api/teacher/students/[studentId]/status`.
- Added `POST /api/teacher/students/upload`.
- Added `GET /api/teacher/students/template`.

### Query Keys

- `teacher-dashboard`
- `students`
- `student`

### Mock Data

- Added temporary mock Teacher Dashboard response.
- Added temporary mock Student list and mutation responses.

### Future Backend Integration Notes

- Replace mock route responses with backend service delegation when Teacher APIs are ready.
- Keep UI unchanged by updating only service and API normalization logic.
- Add server-side query prefetching if the project adopts React Query hydration.
