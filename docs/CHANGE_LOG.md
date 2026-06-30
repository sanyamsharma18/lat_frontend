# Change Log

## Admin Dashboard Conflict Resolution

### Feature Name

Enterprise Dashboard Restore

### What Was Changed

* Resolved merge conflict markers in the Admin Dashboard page.
* Resolved merge conflict markers in Admin Dashboard constants.
* Resolved merge conflict markers in Admin Dashboard styles.
* Kept the pulled enterprise analytics dashboard implementation with report datasets, filters, quick actions, system health, and analytics sections.
* Removed stale chart code from the previous dashboard version that was left after the merge.
* Fixed file encoding and irregular whitespace issues caused by the conflicted files.

### Why It Was Changed

* The admin dashboard was broken after pulling a teammate's code because both versions were mixed together.
* The Reports and Analytics dashboard needed to compile with the teammate's full report-oriented implementation.

### Files Modified

* `src/features/dashboardManagement/components/DashboardPage/index.tsx`
* `src/features/dashboardManagement/components/DashboardPage/constant.tsx`
* `src/features/dashboardManagement/components/DashboardPage/styles.module.scss`
* `docs/CHANGE_LOG.md`

### Components Affected

* Admin Dashboard.
* Admin Reports navigation and report data constants used by the dashboard/reporting flow.

### APIs Affected

* No API changes.

### Any Breaking Changes

* The Admin Dashboard now uses the pulled enterprise analytics implementation instead of the previous compact card/chart dashboard.

### Testing Considerations

* Open `/admin/dashboard`.
* Confirm all enterprise analytics sections render.
* Confirm filters, charts, quick actions, and system health sections render without crashes.
* Confirm `/admin/reports` remains accessible from the sidebar.

### Future Improvements

* Gradually replace offline mock dashboard analytics with backend-driven report endpoints.

## Reports Section Type Fix

### Feature Name

Reports Build Error Fix

### What Was Changed

* Fixed the Reports page dependency on removed dashboard constants.
* Added local report filter options for region, grade, and subject filters.
* Removed an unused mock database reference from the Reports page.
* Fixed login validation rule typing so username fields without regex validation do not break TypeScript.
* Cleaned Reports page lint formatting around the report data memoization.

### Why It Was Changed

* The Reports section was failing TypeScript because it imported constants that no longer existed.
* The project build was also blocked by a login validation typing error.

### Files Modified

* `src/features/reportManagement/components/ReportPage/index.tsx`
* `src/features/auth/components/LoginPage/components/loginForm/utils.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Reports page.
* Login form validation utility.

### APIs Affected

* No API changes.

### Any Breaking Changes

* No breaking changes expected.

### Testing Considerations

* Open the Reports section and confirm filter dropdowns render.
* Confirm the Reports page can load report data using the existing API hook.
* Confirm login form validation behavior remains unchanged.

### Future Improvements

* Replace static report filter options with backend-driven filter metadata when available.

## Admin Dashboard Hover Polish

### Feature Name

Reports & Analytics Hover States

### What Was Changed

* Added light hover shade effects to the Admin Dashboard metric cards.
* Added light hover shade effects to chart panels.
* Added subtle lift and shadow on hover for a more polished visual preview.

### Why It Was Changed

* Dashboard cards and charts should feel more interactive and visually attractive when users hover over them.

### Files Modified

* `src/features/dashboardManagement/components/DashboardPage/styles.module.scss`
* `docs/CHANGE_LOG.md`

### Components Affected

* Admin Reports & Analytics dashboard.

### APIs Affected

* No API changes.

### Any Breaking Changes

* No breaking changes expected.

### Testing Considerations

* Open `/admin/dashboard`.
* Hover metric cards and chart panels.
* Confirm hover states are smooth and do not shift layout unexpectedly.

### Future Improvements

* Add click-through dashboard drilldowns if detailed reports become available.

## Admin Dashboard Analytics Charts

### Feature Name

Reports & Analytics Charts

### What Was Changed

* Added a bar chart to the Admin Reports & Analytics dashboard.
* Added a doughnut chart for question activity.
* Charts are generated from the existing dashboard summary data.
* Added responsive chart panels below the existing metric cards.

### Why It Was Changed

* The dashboard needed stronger visual reporting for quick admin understanding.
* Existing summary numbers are easier to compare when shown as charts.

### Files Modified

* `src/features/dashboardManagement/components/DashboardPage/index.tsx`
* `src/features/dashboardManagement/components/DashboardPage/constant.tsx`
* `src/features/dashboardManagement/components/DashboardPage/styles.module.scss`
* `docs/CHANGE_LOG.md`

### Components Affected

* Admin Dashboard Reports & Analytics page.
* Existing dashboard summary cards remain unchanged.

### APIs Affected

* No API changes.
* Charts use the existing admin dashboard summary response.

### Any Breaking Changes

* No breaking changes expected.

### Testing Considerations

* Open `/admin/dashboard`.
* Confirm summary cards still render.
* Confirm the Platform Volume bar chart renders.
* Confirm the Question Activity doughnut chart renders.
* Confirm the charts resize correctly on desktop and mobile widths.

### Future Improvements

* Replace derived chart data with backend-provided monthly trends when available.

## Reviewer Question Management

### Feature Name

Reviewer Question Management

### What Was Changed

* Added a new reviewer Question Management page at `/reviewer/questions`.
* Added reviewer sidebar navigation for Question Management.
* Added a mock question list API with search and filter support.
* Added a mock review action API for approving and rejecting questions.
* Added a search/filter panel matching the shared reference layout.
* Added a question list table with question ID, grade, subject, competency, question text, status, image, and actions.
* Added a preview modal with question details, three options, remark input, Approve button, and Reject button.

### Why It Was Changed

* Reviewers need a dedicated workflow to inspect generated questions and approve or reject them.
* The page is API-driven with mock data now so it can be connected to backend review APIs later without redesigning the UI.

### Files Modified

* `src/app/reviewer/questions/page.tsx`
* `src/app/api/reviewer/questions/route.ts`
* `src/app/api/reviewer/questions/[questionId]/review/route.ts`
* `src/components/shared/Sidebar/constant.tsx`
* `src/constants/serverSideRoutes.ts`
* `src/features/reviewerPortal/index.ts`
* `src/features/reviewerPortal/hooks/useReviewerQuestionManagement.ts`
* `src/features/reviewerPortal/components/ReviewerQuestionManagementPage/index.tsx`
* `src/features/reviewerPortal/components/ReviewerQuestionManagementPage/constant.ts`
* `src/features/reviewerPortal/components/ReviewerQuestionManagementPage/styles.module.scss`
* `src/features/reviewerPortal/components/ReviewerQuestionManagementPage/utils.ts`
* `src/features/reviewerPortal/components/ReviewerQuestionManagementPage/components/QuestionReviewModal/index.tsx`
* `src/features/reviewerPortal/components/ReviewerQuestionManagementPage/components/QuestionReviewModal/styles.module.scss`
* `src/types/reviewerQuestion.ts`
* `src/utils/queryKeys.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Reviewer sidebar.
* Reviewer Question Management page.
* Question review preview modal.
* Shared DataTable, Input, Dropdown, Button, Modal, Toaster, and loading shimmer components are reused.

### APIs Affected

* Browser route: `GET /api/reviewer/questions`
* Browser route: `PATCH /api/reviewer/questions/:questionId/review`
* Current implementation returns mock data and mock review success.

### Any Breaking Changes

* No breaking changes expected.

### Testing Considerations

* Open `/reviewer/questions` as a reviewer user.
* Confirm search and filters update the question list.
* Click View and confirm the preview modal shows question details and three options.
* Add a remark and click Approve or Reject.
* Confirm success toast appears and the modal closes.

### Future Improvements

* Connect the list and review action routes to real backend reviewer question APIs.
* Add image preview support when backend image URLs are available.

## Reviewer Dashboard

### Feature Name

Reviewer Dashboard

### What Was Changed

* Added a new Reviewer Dashboard page at `/reviewer/dashboard`.
* Added a reviewer protected role segment so reviewer users can access reviewer pages only.
* Added reviewer login redirection to `/reviewer/dashboard`.
* Added a reviewer sidebar menu with Dashboard navigation.
* Added a mock dashboard API route for reviewer summary metrics.
* Added dashboard cards for total questions, approved questions, rejected questions, and pending questions.

### Why It Was Changed

* Reviewer users need their own dashboard after login.
* The dashboard should be API-driven, even while backend metrics are not ready.
* Reviewer pages should follow the same protected route and dashboard architecture as admin and teacher pages.

### Files Modified

* `src/app/reviewer/layout.tsx`
* `src/app/reviewer/dashboard/page.tsx`
* `src/app/api/reviewer/dashboard/route.ts`
* `src/components/shared/Sidebar/constant.tsx`
* `src/constants/authSession.ts`
* `src/constants/serverSideRoutes.ts`
* `src/features/auth/hooks/useLoginForm.ts`
* `src/features/reviewerPortal/index.ts`
* `src/features/reviewerPortal/hooks/useReviewerDashboard.ts`
* `src/features/reviewerPortal/components/ReviewerDashboardPage/index.tsx`
* `src/features/reviewerPortal/components/ReviewerDashboardPage/constant.tsx`
* `src/features/reviewerPortal/components/ReviewerDashboardPage/styles.module.scss`
* `src/features/reviewerPortal/components/ReviewerDashboardPage/utils.ts`
* `src/proxy.ts`
* `src/types/reviewerDashboard.ts`
* `src/utils/queryKeys.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Login redirect flow.
* Protected route proxy.
* Shared admin shell and sidebar.
* Reviewer Dashboard page.
* Shared dashboard statistic cards.

### APIs Affected

* Browser route: `GET /api/reviewer/dashboard`
* Current implementation returns mock data for dashboard metrics.

### Any Breaking Changes

* No breaking changes expected.

### Testing Considerations

* Login with a user whose role is `Reviewer` and confirm redirect to `/reviewer/dashboard`.
* Confirm reviewer cannot access admin, teacher, or student protected pages.
* Confirm dashboard cards show total, approved, rejected, and pending question counts.
* Confirm loading and error states render correctly when the dashboard query changes state.

### Future Improvements

* Replace the mock dashboard route with the real reviewer dashboard backend endpoint when available.
* Add reviewer task lists or links to question review workflows.

## Reviewer API Integration Update

### Feature Name

Reviewer List, Edit, and Status Integration

### What Was Changed

* Updated Reviewer Management to use the real reviewer backend contract.
* Reviewer create and update now send only `firstName`, `lastName`, `email`, and `mobileNo`.
* Added edit reviewer support through `PATCH /api/v1/reviewers/:id`.
* Added active/inactive reviewer status updates through `PATCH /api/v1/reviewers/:id/status`.
* Removed duplicate Add Reviewer buttons so only one primary Add Reviewer button appears.
* Removed placeholder reviewer fields that are not part of the supplied backend payload.

### Why It Was Changed

* The reviewer screen needed to match the confirmed backend APIs exactly.
* Duplicate Add Reviewer buttons created confusing UI.
* Reviewer status should be controlled through the backend instead of static frontend display.

### Files Modified

* `src/types/reviewer.ts`
* `src/services/reviewer/reviewer.service.ts`
* `src/app/api/admin/reviewers/[reviewerId]/route.ts`
* `src/app/api/admin/reviewers/[reviewerId]/status/route.ts`
* `src/features/reviewerManagement/hooks/useReviewerManagement.ts`
* `src/features/reviewerManagement/components/ReviewerManagementPage/index.tsx`
* `src/features/reviewerManagement/components/ReviewerManagementPage/constant.ts`
* `src/features/reviewerManagement/components/ReviewerManagementPage/styles.module.scss`
* `src/features/reviewerManagement/components/ReviewerManagementPage/utils.ts`
* `src/features/reviewerManagement/components/ReviewerManagementPage/components/ReviewerFormModal/index.tsx`
* `docs/CHANGE_LOG.md`

### Components Affected

* Admin Reviewer Management page.
* Reviewer add/edit modal.
* Reviewer table actions and status badge.

### APIs Affected

* Browser route: `GET /api/admin/reviewers`
* Browser route: `POST /api/admin/reviewers`
* Browser route: `PATCH /api/admin/reviewers/:reviewerId`
* Browser route: `PATCH /api/admin/reviewers/:reviewerId/status`
* Backend route: `GET /api/v1/reviewers`
* Backend route: `POST /api/v1/reviewers`
* Backend route: `PATCH /api/v1/reviewers/:reviewerId`
* Backend route: `PATCH /api/v1/reviewers/:reviewerId/status`

### Any Breaking Changes

* Reviewer create/edit no longer sends placeholder fields such as employee code, gender, or address.

### Testing Considerations

* Open `/admin/reviewers` and confirm reviewers load from the backend.
* Add a reviewer and confirm the list refreshes.
* Edit a reviewer and confirm the updated values are saved.
* Toggle reviewer status and confirm Active/Inactive updates after the API succeeds.

### Future Improvements

* Add delete reviewer support if the backend exposes a delete endpoint.

## Admin Reviewer Management

### Feature Name

Reviewer Management

### What Was Changed

* Added a new Admin Reviewer Management page.
* Added reviewer list fetching with search and pagination.
* Added an Add Reviewer modal with required field validation.
* Added an internal Next.js API route for reviewer list and create requests.
* Added Reviewer Management to the admin sidebar.

### Why It Was Changed

* Admin users need a dedicated place to add reviewers and view existing reviewers.
* Reviewer APIs should follow the same authenticated server forwarding pattern as the rest of the admin portal.

### Files Modified

* `src/app/admin/reviewers/page.tsx`
* `src/app/api/admin/reviewers/route.ts`
* `src/components/shared/Sidebar/constant.tsx`
* `src/config/apiRoutes.ts`
* `src/constants/serverSideRoutes.ts`
* `src/features/reviewerManagement/index.ts`
* `src/features/reviewerManagement/components/ReviewerManagementPage/index.tsx`
* `src/features/reviewerManagement/components/ReviewerManagementPage/constant.ts`
* `src/features/reviewerManagement/components/ReviewerManagementPage/styles.module.scss`
* `src/features/reviewerManagement/components/ReviewerManagementPage/utils.ts`
* `src/features/reviewerManagement/components/ReviewerManagementPage/components/ReviewerFormModal/index.tsx`
* `src/features/reviewerManagement/components/ReviewerManagementPage/components/ReviewerFormModal/styles.module.scss`
* `src/features/reviewerManagement/hooks/useReviewerManagement.ts`
* `src/services/reviewer/reviewer.service.ts`
* `src/types/reviewer.ts`
* `src/utils/queryKeys.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Admin sidebar navigation.
* Admin Reviewer Management page.
* Reviewer add modal.
* Shared DataTable, Input, Button, Dropdown, Modal, Toaster, and loading shimmer components are reused.

### APIs Affected

* Browser route: `GET /api/admin/reviewers`
* Browser route: `POST /api/admin/reviewers`
* Backend route assumed: `GET /api/v1/reviewers`
* Backend route assumed: `POST /api/v1/reviewers`

### Any Breaking Changes

* No breaking changes expected.

### Testing Considerations

* Open `/admin/reviewers` from the admin sidebar.
* Confirm the reviewer list loads through the internal API route.
* Confirm search and pagination update the request query params.
* Confirm Add Reviewer stays disabled until required fields are valid.
* Confirm creating a reviewer refreshes the reviewer list.

### Future Improvements

* Add edit/delete reviewers when backend contracts are available.
* Replace the assumed reviewer backend path if the backend exposes a different endpoint.

## Dynamic Student Upload Flow

### Feature Name

Backend-Driven Student Upload

### What Was Changed

* Removed hardcoded frontend CSV header validation from the Student Upload modal.
* The upload button now enables when a file is selected and lets the backend validate file content.
* Student upload no longer falls back to mock success when the API fails.
* Backend upload failures are surfaced to the teacher instead of being hidden.
* Upload success messages now use backend response details when available.

### Why It Was Changed

* Student upload should be dynamic and controlled by the backend upload API.
* Frontend-only validation could block valid backend templates or hide real backend errors.

### Files Modified

* `src/types/student.ts`
* `src/features/teacherPortal/components/StudentManagementPage/components/UploadStudentsModal/index.tsx`
* `src/features/teacherPortal/components/StudentManagementPage/utils.ts`
* `src/features/teacherPortal/hooks/useStudentManagement.ts`
* `src/features/teacherPortal/components/StudentManagementPage/constant.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Teacher Student Management upload modal.
* Teacher Student Management upload mutation.

### APIs Affected

* Browser route: `POST /api/teacher/students/upload`.
* Backend route: `POST /api/v1/students/bulk`.

### Any Breaking Changes

* Upload errors now show as real errors instead of mock success.

### Testing Considerations

* Select a CSV file and confirm Import Students enables.
* Upload a valid backend template and confirm backend success message appears.
* Upload an invalid file and confirm backend error appears.
* Confirm the student list refreshes after upload settles.

### Future Improvements

* Display backend row-level validation errors inside the modal if the backend returns structured row errors.

## Teacher Bulk Student Upload Integration

### Feature Name

Bulk Student Upload API

### What Was Changed

* Added backend route configuration for `POST /api/v1/students/bulk`.
* Replaced the mock `/api/teacher/students/upload` response with a real multipart forwarding route.
* The upload route now validates that a file is present before calling the backend.
* The selected file is forwarded as `file` in `FormData`, matching the backend curl contract.
* Upload continues to use the existing internal frontend route and server-side auth forwarding.

### Why It Was Changed

* Teacher Student Management bulk upload must call the real backend API instead of returning mock success.

### Files Modified

* `src/config/apiRoutes.ts`
* `src/services/student/student.service.ts`
* `src/app/api/teacher/students/upload/route.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Teacher Student Management upload modal.
* Teacher student upload API route.

### APIs Affected

* Browser route: `POST /api/teacher/students/upload`.
* Backend route: `POST /api/v1/students/bulk`.
* Multipart field: `file`.

### Any Breaking Changes

* None.

### Testing Considerations

* Open Teacher Student Management and upload a CSV file.
* Confirm the browser calls `/api/teacher/students/upload`.
* Confirm the backend receives `multipart/form-data` with `file`.
* Confirm upload success refreshes the student list.

### Future Improvements

* Align frontend CSV preview validation with the final backend upload template.

## Student Form Required Section Indicator

### Feature Name

Required Section Field

### What Was Changed

* Added required-field marker support for Student form dropdown labels.
* Section now displays as a required field in the Add/Edit Student modal.
* Existing section validation remains active, so the submit button stays disabled until section is selected.

### Why It Was Changed

* Teachers need to clearly see that Section is mandatory before adding a student.

### Files Modified

* `src/features/teacherPortal/components/StudentManagementPage/components/StudentFormModal/index.tsx`
* `docs/CHANGE_LOG.md`

### Components Affected

* Teacher Student Management Add/Edit Student modal.

### APIs Affected

* None.

### Any Breaking Changes

* None.

### Testing Considerations

* Open Add Student modal.
* Confirm Section label shows a required marker.
* Confirm Add Student remains disabled until Section is selected.

### Future Improvements

* Add a shared required-label pattern to the reusable Dropdown component.

## Teacher Add Student Backend Payload

### Feature Name

Backend Add Student Integration

### What Was Changed

* Added a typed backend create-student payload matching `POST /api/v1/students`.
* Updated the internal Teacher Student create route to map form values into backend fields.
* The create payload now sends `firstName`, `lastName`, `parentMobile`, `email`, `rollNo`, `gradeId`, `section`, `udisecode`, `fatherName`, `motherName`, `gender`, `dob`, and `address`.
* Removed `status` from the create-student backend payload because the provided backend contract does not include it.
* Fixed Add Student button validation so optional fields do not keep the button disabled.

### Why It Was Changed

* The Add Student form must submit the exact backend API contract.
* Optional fields should not prevent teachers from creating a student.

### Files Modified

* `src/types/student.ts`
* `src/app/api/teacher/students/route.ts`
* `src/services/student/student.service.ts`
* `src/features/teacherPortal/components/StudentManagementPage/components/StudentFormModal/index.tsx`
* `docs/CHANGE_LOG.md`

### Components Affected

* Teacher Student Management add/edit modal.
* Teacher Student Management create API route.

### APIs Affected

* Browser route: `POST /api/teacher/students`.
* Backend route: `POST /api/v1/students`.

### Any Breaking Changes

* None.

### Testing Considerations

* Open Teacher Student Management and click Add Student.
* Fill only mandatory fields and confirm the Add Student button enables.
* Submit and confirm the backend receives the expected payload.
* Confirm optional fields can be blank.

### Future Improvements

* Replace the single `studentName` input with separate first and last name fields if the backend makes both mandatory.

## Typecheck Stabilization For Student List Work

### Feature Name

Build Verification Stabilization

### What Was Changed

* Added the missing optional `termId` field to `QuestionListFilters`.
* Aligned teacher upload response handling with the typed API response shape.

### Why It Was Changed

* Full TypeScript verification and production build were blocked by existing type mismatches outside the student list integration.

### Files Modified

* `src/types/questionGenerator.ts`
* `src/features/teacherManagement/components/TeacherManagementPage/utils.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Admin Question Generator filters.
* Admin Teacher upload handling.

### APIs Affected

* None.

### Any Breaking Changes

* None.

### Testing Considerations

* Re-run TypeScript and production build verification.

### Future Improvements

* Replace broad upload response types with shared backend response DTOs.

## Teacher Student List Backend Integration

### Feature Name

Dynamic Teacher Student List

### What Was Changed

* Updated the Teacher Student Management list backend target to `/api/v1/students`.
* Kept the browser-facing route as `/api/teacher/students` so the existing UI architecture remains unchanged.
* Normalized student list filters to match the backend query contract: `page`, `limit`, `gradeId`, `section`, and `status`.
* Converted section filter values such as `Section A` into backend values such as `a`.
* Expanded student list response normalization to support common backend pagination shapes.
* Mapped backend student fields into the existing table model used by the Teacher Student Management page.

### Why It Was Changed

* Teacher Student Management should load real students from the backend API instead of relying only on mock/fallback data.
* The frontend route and table should stay consistent with the current project structure.

### Files Modified

* `src/config/apiRoutes.ts`
* `src/features/teacherPortal/components/StudentManagementPage/utils.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Teacher Student Management page.
* Student list table.
* Student list filters and pagination.

### APIs Affected

* Browser route: `GET /api/teacher/students`.
* Backend route: `GET /api/v1/students`.
* Query params: `page`, `limit`, `gradeId`, `section`, `status`, and optional `search`.

### Any Breaking Changes

* None. The UI still calls the same internal frontend route.

### Testing Considerations

* Login as a teacher and open `/teacher/students`.
* Confirm the browser calls `/api/teacher/students`.
* Confirm the backend receives `/api/v1/students?page=1&limit=10&gradeId=...&section=...&status=...`.
* Confirm the table shows backend student rows.
* Confirm filters and pagination update the query.

### Future Improvements

* Remove the fallback mock list after backend availability is stable for all teacher student workflows.
* Replace default fallback field mapping with exact backend DTO types when the final response contract is frozen.

## Student Exam Broken Image Fallback

### Feature Name

Question Image Fallback State

### What Was Changed

* Added failed-image tracking for question and option images on the Student Examination page.
* Added visible fallback text when a backend image URL is present but the file cannot be loaded.
* Added stable question image area height so a broken image no longer collapses into a thin line.

### Why It Was Changed

* Backend can return an `image_url` whose file is unavailable.
* The UI should not silently hide question media when a backend image request fails.

### Files Modified

* `src/features/studentPortal/components/StudentExaminationPage/index.tsx`
* `src/features/studentPortal/components/StudentExaminationPage/styles.module.scss`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student Examination question image area.
* Student Examination option image thumbnails.

### APIs Affected

* None.

### Any Breaking Changes

* None.

### Testing Considerations

* Load a valid question image URL and confirm it displays.
* Load a missing question image URL and confirm a visible fallback message appears.
* Confirm option image thumbnails still render when their backend files exist.

### Future Improvements

* Ask the backend to guarantee that `image_url` only points to existing files or return a separate image availability field.

## Student Exam Backend Image Loading Fix

### Feature Name

Question Image Display Fix

### What Was Changed

* Updated question, option, and preview images to load backend URLs with direct browser image tags.
* Trimmed question image URLs before rendering so valid backend `image_url` values display reliably.
* Accepted both `image_url` and `imageUrl` when normalizing backend question and option image data.

### Why It Was Changed

* Backend image URLs come from the private backend host and should be displayed directly in the browser.
* Question-level images should display whenever the backend sends `image_url`.

### Files Modified

* `src/types/studentPortal.ts`
* `src/features/studentPortal/components/StudentExaminationPage/utils.ts`
* `src/features/studentPortal/components/StudentExaminationPage/index.tsx`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student Examination question image.
* Student Examination option image thumbnails.
* Student Examination image preview modal.

### APIs Affected

* None.

### Any Breaking Changes

* None.

### Testing Considerations

* Load a backend question with `image_url`.
* Confirm the question image appears below the question text.
* Click the question image and confirm preview opens.

### Future Improvements

* Proxy backend images through a controlled frontend image endpoint if the backend host should not be exposed to clients.

## Student Exam Question And Option Image Preview

### Feature Name

Exam Image Rendering and Preview

### What Was Changed

* Preserved option-level `image_url` values from the backend exam questions response.
* Displayed question images when the backend sends a question `image_url`.
* Displayed option image thumbnails when an option sends `image_url`.
* Added an image preview modal for question and option images.
* Kept option row selection behavior stable while allowing image clicks to preview instead of selecting accidentally.
* Added responsive image sizing so option rows do not crash or stretch on mobile and desktop.

### Why It Was Changed

* Backend questions can now include images at both question and option level.
* Students need to inspect images clearly before choosing an answer.

### Files Modified

* `src/types/studentPortal.ts`
* `src/features/studentPortal/components/StudentExaminationPage/utils.ts`
* `src/features/studentPortal/components/StudentExaminationPage/index.tsx`
* `src/features/studentPortal/components/StudentExaminationPage/styles.module.scss`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student Examination page.
* Question and option rendering.
* Image preview modal.

### APIs Affected

* Uses backend `image_url` fields already returned by `POST /api/v1/students/exam/questions`.

### Any Breaking Changes

* None.

### Testing Considerations

* Load a question with a question-level image and confirm it renders.
* Load options with image URLs and confirm thumbnails render inside option rows.
* Click question and option images and confirm the preview modal opens.
* Click normal option row space and confirm the answer is still selected.
* Check mobile width to confirm image thumbnails do not overflow the option card.

### Future Improvements

* Add a zoom control inside the preview modal if students need to inspect detailed diagrams.

## Space Mission Balloon Answer Gameplay

### Feature Name

Galaxy Balloon Answer Game

### What Was Changed

* Reworked the Space Mission question interaction into a balloon-burst game.
* Answers now appear directly on colorful floating balloons inside a galaxy playfield.
* Clicking or keyboard-activating a balloon immediately bursts it and checks the answer.
* Added selected, floating, hover, focus, and burst animation states.
* Improved the mission question area with brighter game-style colors and stronger readable typography.
* Kept the existing missions, timer, pause menu, rewards, progress tracking, and dashboard navigation.

### Why It Was Changed

* The previous mission screen felt like a regular quiz.
* The student experience should feel like a real gamified activity while still answering questions.

### Files Modified

* `src/features/studentPortal/components/SpaceMissionGamePage/index.tsx`
* `src/features/studentPortal/components/SpaceMissionGamePage/styles.module.scss`
* `src/features/studentPortal/hooks/useSpaceMissionGame.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Space Mission game mission screen.

### APIs Affected

* None.

### Any Breaking Changes

* None.

### Testing Considerations

* Open `/student/space-mission`.
* Start a mission and confirm answers appear on floating balloons.
* Click a balloon and confirm it bursts before showing correct or incorrect feedback.
* Use keyboard focus and Enter/Space on a balloon to confirm accessibility still works.
* Confirm Continue, rewards, timer, pause, restart, and dashboard actions still work.

### Future Improvements

* Add sound effects for balloon burst and correct/incorrect answers when audio assets are approved.
* Add backend-provided game questions when available.

## Student Examination Dynamic Header Name

### Feature Name

Dynamic Examination Student Name

### What Was Changed

* Removed the static `John Doe` label from the Student Examination header.
* The header now reads the logged-in student's details from the existing client user cookie.
* The display name uses `fullName`, then `firstName lastName`, then `username`, and finally `Student` as a fallback.

### Why It Was Changed

* The examination header should show the actual logged-in student instead of mock text.

### Files Modified

* `src/features/studentPortal/components/StudentExaminationPage/constant.ts`
* `src/features/studentPortal/components/StudentExaminationPage/index.tsx`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student Examination page header.

### APIs Affected

* None.

### Any Breaking Changes

* None.

### Testing Considerations

* Login as a student and open `/student/examination`.
* Confirm the header shows the logged-in student's name from cookies.
* Confirm the header falls back to `Student` if no name details are available.

### Future Improvements

* Use backend exam session metadata for the student display name if the exam API returns it later.

## Student Exam Questions Backend Integration

### Feature Name

Backend Student Exam Questions

### What Was Changed

* Updated the student exam questions route to POST to the backend question API.
* Added the backend `/students/exam/questions` route configuration to the student portal service flow.
* The examination page now sends `{ studentId, termId: 1 }`, with `studentId` read from the logged-in student details.
* Mapped backend question records into the existing examination page question model.
* Added support for backend HTML in instruction, stimulus, question text, and option text.
* Sanitized backend HTML before rendering it on the examination page.
* Added support for backend question images using the existing Next.js image configuration.
* Kept the existing timer, answer state, question palette, navigation, and submit behavior unchanged.

### Why It Was Changed

* Student examination questions now come from the real backend API instead of the old mock response.
* The UI must display backend-provided rich question content correctly.

### Files Modified

* `src/app/api/student/exam/questions/route.ts`
* `src/services/studentPortal/studentPortal.service.ts`
* `src/features/studentPortal/components/StudentExaminationPage/utils.ts`
* `src/features/studentPortal/components/StudentExaminationPage/index.tsx`
* `src/features/studentPortal/components/StudentExaminationPage/styles.module.scss`
* `src/types/studentPortal.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student Examination page.
* Student examination API route.
* Student portal service layer.

### APIs Affected

* Browser route: `POST /api/student/exam/questions`.
* Backend route: `POST /api/v1/students/exam/questions`.
* Backend request body: `{ studentId, termId }`.

### Any Breaking Changes

* The student examination page now expects backend question records when the route receives a payload.
* The local route method changed from GET to POST for real question loading.

### Testing Considerations

* Login as a student and start the examination.
* Confirm `/api/student/exam/questions` is called with `{ studentId, termId: 1 }`.
* Confirm the backend receives the logged-in user's bearer token through the internal route.
* Confirm instruction, stimulus, question text, option HTML, and question image render correctly.
* Confirm selecting options, palette states, timer, refresh restore, and submit still work.

### Future Improvements

* Replace default `termId: 1` with the assigned term from the backend when that data is available.
* Add backend-provided exam title, duration, and total question metadata when the API returns it.

## Space Mission Student Game

### Feature Name

Space Mission Educational Game

### What Was Changed

* Added a new Student Portal game route at `/student/space-mission`.
* Added a Space Mission game page with intro, briefing, galaxy map, missions, rewards, pause menu, and competency report.
* Added reusable game constants, types, utilities, and hook logic.
* Added local progress persistence for completed planets, XP, coins, stars, crystals, badges, accuracy, and competency scores.
* Updated the Student Dashboard so Start Examination shows only when the exam is enabled.
* Added Play Space Mission when Start Examination is disabled.
* Added dashboard return behavior for Exit and mission completion actions.

### Why It Was Changed

* Students need an educational activity when the exam cannot be started.
* Space Mission gives students a competency-based activity for reasoning, memory, sequencing, mathematics, and decision-making.

### Files Modified

* `src/app/student/space-mission/page.tsx`
* `src/features/studentPortal/index.ts`
* `src/features/studentPortal/components/SpaceMissionGamePage/index.tsx`
* `src/features/studentPortal/components/SpaceMissionGamePage/styles.module.scss`
* `src/features/studentPortal/components/SpaceMissionGamePage/constants.ts`
* `src/features/studentPortal/components/SpaceMissionGamePage/types.ts`
* `src/features/studentPortal/components/SpaceMissionGamePage/utils.ts`
* `src/features/studentPortal/hooks/useSpaceMissionGame.ts`
* `src/features/studentPortal/hooks/useStudentDashboard.ts`
* `src/features/studentPortal/components/StudentDashboardPage/index.tsx`
* `src/features/studentPortal/components/StudentDashboardPage/constant.ts`
* `src/features/studentPortal/components/StudentDashboardPage/styles.module.scss`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student Dashboard.
* Student Portal game experience.

### APIs Affected

* None.

### Any Breaking Changes

* None.

### Testing Considerations

* Confirm Start Examination appears when the exam is enabled.
* Confirm Play Space Mission appears when Start Examination is disabled.
* Open `/student/space-mission`, complete missions, exit, and verify navigation returns to `/student/dashboard`.
* Verify progress persists after returning to the game.

### Future Improvements

* Add real audio assets and richer canvas-based mini games when approved assets are available.
* Replace static mission content with backend-provided competency missions if needed.

## Student Exam Check Code Optimization

### Feature Name

Student Dashboard Exam Check Cleanup

### What Was Changed

* Removed unused duplicate student exam-check helper and hook files.
* Added `subjectId: 1` to the shared exam-check payload context.
* Removed unused returned values from the Student Dashboard hook.
* Reused a normalized backend status value inside the hook instead of recalculating it.

### Why It Was Changed

* The working exam-check flow had duplicate unused code and a payload constant that did not fully reflect the backend contract.
* The cleanup keeps the current behavior while making the dashboard code easier to maintain.

### Files Modified

* `src/features/studentPortal/components/StudentDashboardPage/utils.ts`
* `src/features/studentPortal/hooks/useStudentDashboard.ts`
* `src/features/studentPortal/components/StudentDashboardPage/studentExam.ts`
* `src/features/studentPortal/hooks/useCheckExam.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student Dashboard.

### APIs Affected

* Student exam-check payload now consistently includes `studentId`, `termId`, and `subjectId`.

### Any Breaking Changes

* None.

### Testing Considerations

* Login as a student and confirm the Start Examination button still follows the backend status.
* Confirm the exam-check request includes `subjectId: 1`.

### Future Improvements

* Replace hardcoded term and subject IDs with assigned exam values when available.

## Client Token Access For Student Exam Check

### Feature Name

Client-Side Exam Check Token Access

### What Was Changed

* Updated auth token cookie storage so `x_tok` can be read by client-side code.
* Added a guard before the Student Dashboard exam check API call so it does not send `Bearer undefined`.
* Restored the root `proxy.ts` entry and defined its `config` locally for Next.js static analysis.
* Removed stale server-side dashboard exam-check prefetch so the dashboard uses the current client-side flow.

### Why It Was Changed

* The Student Dashboard exam check is currently implemented as a client-side backend call and needs access to the JWT token.
* The token was previously stored as an HttpOnly cookie, which cannot be read by `js-cookie`.

### Files Modified

* `src/app/api/store-auth-token/route.ts`
* `src/app/cookies/store-auth-token/route.ts`
* `src/features/studentPortal/components/StudentDashboardPage/utils.ts`
* `src/app/student/dashboard/page.tsx`
* `proxy.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student Dashboard exam availability check.
* Login token storage.
* Global route proxy entry.

### APIs Affected

* `POST /api/store-auth-token`
* `POST /cookies/store-auth-token`

### Any Breaking Changes

* The `x_tok` cookie is now readable by client-side JavaScript.

### Testing Considerations

* Login again so the token cookie is rewritten with the new settings.
* Confirm `Cookies.get('x_tok')` returns a token on the Student Dashboard.
* Confirm the exam check request sends `Authorization: Bearer <token>`.

### Future Improvements

* Prefer a server-side proxy route for authenticated backend calls if HttpOnly token protection is required again.

## Student Start Exam Backend Check

### Feature Name

Backend Start Exam Availability

### What Was Changed

* Added the internal Student Exam Check API route at `/api/student/exam/check`.
* Added backend route configuration for `/api/v1/students/exam/check`.
* Added a student exam check service method that forwards through `serverApi()` so the logged-in JWT is sent as a bearer token.
* Added Student Dashboard React Query integration for the exam check API.
* Aligned the local student exam helper with the internal Next.js route instead of `/api/v1`.
* The dashboard sends `{ studentId, termId: 1, subjectId: 1 }`, using the logged-in profile `id`.
* The Start Examination button is enabled only when the backend status normalizes to `NOT_STARTED`.
* All other backend statuses disable the button.

### Why It Was Changed

* Start Examination availability must be controlled by the backend response.
* The backend call must not be made directly from the browser because the JWT is stored in an HttpOnly cookie.

### Files Modified

* `src/app/api/student/exam/check/route.ts`
* `src/config/apiRoutes.ts`
* `src/constants/serverSideRoutes.ts`
* `src/services/studentPortal/studentPortal.service.ts`
* `src/types/studentPortal.ts`
* `src/utils/queryKeys.ts`
* `src/features/studentPortal/components/StudentDashboardPage/utils.ts`
* `src/features/studentPortal/components/StudentDashboardPage/studentExam.ts`
* `src/features/studentPortal/hooks/useStudentDashboard.ts`
* `src/features/studentPortal/components/StudentDashboardPage/index.tsx`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student Dashboard.
* Start Examination button.
* Exam status card.

### APIs Affected

* Browser route: `POST /api/student/exam/check`.
* Backend route: `POST /api/v1/students/exam/check`.

### Any Breaking Changes

* The Start Examination button is now disabled unless the backend returns a startable status.

### Testing Considerations

* Login as a student and open `/student/dashboard`.
* Confirm the browser calls `/api/student/exam/check`.
* Confirm the request payload contains `studentId`, `termId`, and `subjectId`.
* Confirm backend `Not_Started` enables the button.
* Confirm other statuses disable the button.

### Future Improvements

* Replace default term and subject IDs with dynamic assigned exam data when that backend response is available.

## Student Roll Number Cookie Mapping Fix

### Feature Name

Roll Number Fallback Correction

### What Was Changed

* Removed `username` as a fallback source for Student Dashboard roll number.
* Roll number now comes only from `rollNumber` or `rollNo`.
* If no roll number field exists in `x_det`, the dashboard shows `_`.

### Why It Was Changed

* Username should not be displayed as roll number.

### Files Modified

* `src/services/studentPortal/studentPortal.service.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student Dashboard profile card.

### APIs Affected

* `GET /api/student/profile` roll number mapping.

### Any Breaking Changes

* None.

### Testing Considerations

* Login as a student whose cookie has no `rollNumber` or `rollNo`.
* Confirm the Roll Number field displays `_`, not username.

### Future Improvements

* Use the backend-provided roll number field when available in the authenticated user payload.

## Student Exam Check Integration Removal

### Feature Name

Remove Backend Exam Check Integration

### What Was Changed

* Removed the internal Student Exam Check API route.
* Removed the backend exam check route config, service method, query key, and TypeScript payload/response types.
* Removed the Student Dashboard exam status React Query call.
* Restored the dashboard to static "Ready For Examination" status.
* Restored Start Examination navigation without backend exam-check gating.

### Why It Was Changed

* The backend exam-check functionality needed to be removed before the next instruction.

### Files Modified

* `src/app/api/student/exam/check/route.ts`
* `src/config/apiRoutes.ts`
* `src/constants/serverSideRoutes.ts`
* `src/services/studentPortal/studentPortal.service.ts`
* `src/types/studentPortal.ts`
* `src/utils/queryKeys.ts`
* `src/features/studentPortal/components/StudentDashboardPage/utils.ts`
* `src/features/studentPortal/hooks/useStudentDashboard.ts`
* `src/features/studentPortal/components/StudentDashboardPage/index.tsx`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student Dashboard.
* Start Examination button.
* Exam status card.

### APIs Affected

* Removed frontend route: `POST /api/student/exam/check`.
* Removed frontend service entry for backend route: `POST /api/v1/students/exam/check`.

### Any Breaking Changes

* The Student Dashboard no longer checks backend exam availability.

### Testing Considerations

* Open `/student/dashboard` and confirm no `/api/student/exam/check` request is made.
* Accept exam rules and confirm Start Examination navigates to `/student/examination`.

### Future Improvements

* Reintroduce exam availability only when the final backend flow is requested again.

## Student Exam Check Backend Integration

### Feature Name

Backend Controlled Start Examination Button

### What Was Changed

* Added the internal Student Exam Check API route: `POST /api/student/exam/check`.
* Added the backend route config for `POST /api/v1/students/exam/check`.
* Added a student exam check service method using the existing `serverApi()` helper so the JWT bearer token is forwarded from the HttpOnly cookie.
* Added a React Query exam status query on the Student Dashboard.
* The dashboard sends `{ studentId, termId: 1, subjectId: 1 }`, where `studentId` comes from the logged-in profile.
* The Start Examination button is enabled only when the backend status normalizes to `NOT_STARTED`.
* Any other backend status disables the Start Examination button.

### Why It Was Changed

* Exam availability must come from the backend API instead of static frontend state.
* Direct browser calls to the backend IP cannot attach the HttpOnly JWT, so the internal Next.js route keeps authentication consistent with the rest of the app.

### Files Modified

* `src/app/api/student/exam/check/route.ts`
* `src/config/apiRoutes.ts`
* `src/constants/serverSideRoutes.ts`
* `src/services/studentPortal/studentPortal.service.ts`
* `src/types/studentPortal.ts`
* `src/utils/queryKeys.ts`
* `src/features/studentPortal/components/StudentDashboardPage/utils.ts`
* `src/features/studentPortal/hooks/useStudentDashboard.ts`
* `src/features/studentPortal/components/StudentDashboardPage/index.tsx`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student Dashboard.
* Start Examination button.
* Exam status card.

### APIs Affected

* Browser calls internal route: `POST /api/student/exam/check`.
* Internal route forwards to backend: `POST /api/v1/students/exam/check`.

### Any Breaking Changes

* The Start Examination button now depends on the backend status response.
* Students cannot start the exam unless the backend returns `Not_Started` or an equivalent `NOT_STARTED` value.

### Testing Considerations

* Login as a student and open `/student/dashboard`.
* Confirm the browser calls `/api/student/exam/check`, not the backend IP directly.
* Confirm the request body includes `studentId`, `termId`, and `subjectId`.
* Confirm `Not_Started` enables the button.
* Confirm any other status disables the button.

### Future Improvements

* Replace default term and subject IDs with backend-provided assigned exam values when available.

## Dynamic Student Profile From Cookie

### Feature Name

Cookie-Based Student Profile

### What Was Changed

* Updated the student profile service to read logged-in student details from the `x_det` cookie.
* Mapped cookie values into the existing Student Dashboard profile shape.
* Added `_` fallback values when the cookie or individual fields are missing.
* Kept the existing profile API route and response envelope unchanged.

### Why It Was Changed

* The Student Dashboard should show the logged-in student's details instead of mock profile data.
* Missing profile values should display a safe placeholder instead of blank text.

### Files Modified

* `src/services/studentPortal/studentPortal.service.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student Dashboard profile card.

### APIs Affected

* `GET /api/student/profile` now resolves profile data from the authenticated user-detail cookie.

### Any Breaking Changes

* None.

### Testing Considerations

* Login as a student and open `/student/dashboard`.
* Confirm name, username-derived roll number, and other available details come from `x_det`.
* Clear or remove fields from `x_det` and confirm `_` is displayed for missing values.

### Future Improvements

* Replace cookie-only grade, section, and roll number mapping with backend profile fields when the backend provides them.

## Static Student Dashboard Restore

### Feature Name

Static Student Dashboard

### What Was Changed

* Removed the dynamic Student Exam Check API route from the frontend.
* Removed the student exam check backend route configuration and service method.
* Removed the student exam status query key.
* Restored the Student Dashboard to a static "Ready For Examination" status.
* Restored Start Examination navigation from the Student Dashboard without calling the exam-check API.
* Restored the Student Examination page to load mock/static exam questions directly without exam-status gating.

### Why It Was Changed

* The dashboard needed to be static again before the next implementation step.
* Removing the dynamic API call prevents the dashboard from calling the backend exam-check endpoint for now.

### Files Modified

* `src/app/api/student/exam/check/route.ts`
* `src/config/apiRoutes.ts`
* `src/constants/serverSideRoutes.ts`
* `src/services/studentPortal/studentPortal.service.ts`
* `src/utils/queryKeys.ts`
* `src/features/studentPortal/components/StudentDashboardPage/index.tsx`
* `src/features/studentPortal/components/StudentDashboardPage/utils.ts`
* `src/features/studentPortal/hooks/useStudentDashboard.ts`
* `src/features/studentPortal/hooks/useStudentExamination.ts`
* `src/features/studentPortal/components/StudentExaminationPage/index.tsx`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student Dashboard.
* Student Examination page.

### APIs Affected

* Removed frontend route: `POST /api/student/exam/check`.
* Removed frontend service entry for backend route: `POST /api/v1/students/exam/check`.

### Any Breaking Changes

* The Student Dashboard no longer checks backend exam availability.
* The Start Examination flow is static and available after the student accepts the instructions.

### Testing Considerations

* Open `/student/dashboard` and confirm no `/api/student/exam/check` request is made.
* Accept the rules popup and confirm Start Examination navigates to `/student/examination`.
* Confirm the examination page loads static/mock questions.

### Future Improvements

* Reintroduce backend-driven availability only when the final API flow and payload are confirmed.

## Student Portal

### Authentication

* Added a mock Student Login API route for the student portal API surface.
* The existing login flow already redirects users with the Student role to `/student/dashboard`.

### Dashboard

* Added a student dashboard route at `/student/dashboard`.
* Added a no-sidebar student layout with a clean header and logout action.
* Added a mandatory Examination Instructions modal.
* Stored instruction acceptance in the browser so students cannot start the exam until they accept.
* Added a centered Student Information card with examination readiness status.

### Examination

* Added a student examination route at `/student/examination`.
* Added a single-choice MCQ question screen.
* Added previous, next, and direct question palette navigation.
* Added question palette states for not visited, visited, answered, and current question.
* Added a countdown timer with auto-submit behavior when time reaches zero.
* Added submit examination behavior using the existing mutation pattern.

### APIs

* Added mock Student Login API: `/api/student/login`.
* Added mock Student Profile API: `/api/student/profile`.
* Added mock Exam Instructions API: `/api/student/exam/instructions`.
* Added mock Exam Questions API: `/api/student/exam/questions`.
* Added mock Save Answer API: `/api/student/exam/save-answer`.
* Added mock Submit Exam API: `/api/student/exam/submit`.

### Query Keys

* Added `student-profile`.
* Added `exam-instructions`.
* Added `exam-questions`.
* Added mutation keys for `save-answer` and `submit-exam`.

### Mock Data

* Added temporary student profile data.
* Added reusable examination instruction data.
* Added realistic mock MCQ examination data with 15 questions.

### Files Modified

* `src/constants/serverSideRoutes.ts`
* `src/utils/queryKeys.ts`
* `src/lib/clientApi.ts`
* `src/lib/serverApi.ts`
* `src/components/ui/Input/Input.tsx`
* `src/features/auth/components/LoginPage/components/loginForm/utils.ts`
* `src/features/teacherManagement/components/TeacherManagementPage/constant.ts`
* `src/features/teacherManagement/components/TeacherManagementPage/index.tsx`
* `src/features/teacherManagement/components/TeacherManagementPage/utils.ts`
* `src/features/teacherManagement/components/TeacherManagementPage/components/DeleteTeacherModal/index.tsx`
* `src/features/teacherManagement/components/TeacherManagementPage/components/TeacherFormModal/index.tsx`
* `src/app/api/grade-group/[gradeGroupId]/grades/route.ts`

### Files Created

* `src/types/studentPortal.ts`
* `src/services/studentPortal/studentPortal.service.ts`
* `src/components/shared/StudentShell/index.tsx`
* `src/components/shared/StudentShell/styles.module.scss`
* `src/app/student/layout.tsx`
* `src/app/student/dashboard/page.tsx`
* `src/app/student/examination/page.tsx`
* `src/app/api/student/login/route.ts`
* `src/app/api/student/profile/route.ts`
* `src/app/api/student/exam/instructions/route.ts`
* `src/app/api/student/exam/questions/route.ts`
* `src/app/api/student/exam/save-answer/route.ts`
* `src/app/api/student/exam/submit/route.ts`
* `src/features/studentPortal/index.ts`
* `src/features/studentPortal/hooks/useStudentDashboard.ts`
* `src/features/studentPortal/hooks/useStudentExamination.ts`
* `src/features/studentPortal/components/StudentDashboardPage/index.tsx`
* `src/features/studentPortal/components/StudentDashboardPage/styles.module.scss`
* `src/features/studentPortal/components/StudentDashboardPage/constant.ts`
* `src/features/studentPortal/components/StudentDashboardPage/utils.ts`
* `src/features/studentPortal/components/StudentDashboardPage/components/ExamInstructionsModal/index.tsx`
* `src/features/studentPortal/components/StudentDashboardPage/components/ExamInstructionsModal/styles.module.scss`
* `src/features/studentPortal/components/StudentExaminationPage/index.tsx`
* `src/features/studentPortal/components/StudentExaminationPage/styles.module.scss`
* `src/features/studentPortal/components/StudentExaminationPage/constant.ts`
* `src/features/studentPortal/components/StudentExaminationPage/utils.ts`

### Components Affected

* Student portal now uses the existing `Button`, `Text`, `Modal`, `Radio`, `ShimmerUiContainer`, and `Toaster` UI components.
* Student portal reuses the existing logout modal.
* A student-specific shell was added because the student portal must not include a sidebar.

### Breaking Changes

* None.

### Testing Considerations

* Verify a Student role login redirects to `/student/dashboard`.
* Verify the instructions modal appears on first dashboard load.
* Verify Start Examination remains disabled until instructions are accepted.
* Verify question navigation, palette states, answer saving, timer countdown, and submit behavior.
* Verify the layout works on desktop, laptop, and tablet widths.
* Typecheck, lint, and production build pass after the student portal changes.

### Timer Formatting Fix

* Updated the examination timer formatter to safely handle the initial loading state before exam duration is available.
* Memoized the formatted timer value in the examination hook so the returned value is explicit and not recalculated inline in the hook return object.
* Removed stale commented timer code from the examination hook.

### Future Enhancements

* Add multiple question types.
* Add result screen.
* Add exam analytics.
* Add proctoring and suspicious activity handling.
* Replace mock API handlers with backend-backed service calls.

## Student Examination Module Enhancements

### Feature Name

Student Examination Experience Refinement

### What Was Changed

* Made the entire MCQ option row clickable, including the radio, option text, and empty space inside the option card.
* Improved selected and hover states for option cards using existing Sass color tokens.
* Expanded the mock examination response from 15 questions to 45 realistic questions.
* Added exam metadata to the mock response: title, duration, and total question count.
* Improved the examination header with assessment title, student name, and a stronger timer presentation.
* Added answered-question progress text and a progress bar.
* Refined the question card, navigation area, and question palette panel.
* Improved responsive behavior for desktop, tablet, and smaller viewports.
* Added stable callbacks and memoized derived values in the examination hook to reduce unnecessary recalculation.

### Why It Was Changed

* Students can now select answers with fewer precision clicks.
* The examination screen now feels closer to a professional assessment platform.
* The larger mock data set better tests palette scrolling, navigation, and progress behavior.

### Files Modified

* `src/types/studentPortal.ts`
* `src/services/studentPortal/studentPortal.service.ts`
* `src/components/ui/Radio/index.tsx`
* `src/features/studentPortal/hooks/useStudentExamination.ts`
* `src/features/studentPortal/components/StudentExaminationPage/index.tsx`
* `src/features/studentPortal/components/StudentExaminationPage/styles.module.scss`
* `src/features/studentPortal/components/StudentExaminationPage/constant.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student Examination Page
* Radio UI component
* Student examination mock API service

### APIs Affected

* `/api/student/exam/questions` now returns 45 mock questions with `title` and `totalQuestions`.
* `/api/student/exam/save-answer` behavior is unchanged.
* `/api/student/exam/submit` behavior is unchanged.

### Breaking Changes

* None. Existing routes, query architecture, and API route names are unchanged.

### Testing Considerations

* Click the radio, option text, and empty space in an option row to confirm all select the answer.
* Confirm selected option row, selected border, selected background, and radio state update together.
* Confirm the question palette displays questions 1 through 45.
* Confirm answered, visited, current, and not visited states still update correctly.
* Confirm the progress indicator updates as answers are selected.
* Confirm desktop, tablet, and mobile layouts keep the palette usable.

### Future Improvements

* Add backend-driven student name and assessment metadata.
* Add section-wise question grouping.
* Add review screen before final submit.
* Add support for non-MCQ question types.

## Image-Based Assessment Questions

### Feature Name

Reusable Image Option Question

### What Was Changed

* Extended the student examination question schema to support image-based option questions.
* Added an `image-option` question type with options containing `id`, `label`, `imageUrl`, and `isCorrect`.
* Added a reusable `ImageOptionQuestion` component for image-based assessment questions.
* Added local shape image assets for cone, cube, sphere, and rectangle/cuboid options.
* Updated the first mock exam question to use image options for a visual reasoning question.
* Integrated image-option rendering into the existing examination page without changing routes or query architecture.
* Added correct and incorrect visual feedback after examination submission.
* Kept text MCQ rendering working with the existing selected-answer flow.

### Why It Was Changed

* Some assessment questions require visual reasoning, where students must compare and understand images before choosing an answer.
* The reusable component allows future image-based questions to be added through data rather than custom UI code.

### Files Modified

* `src/types/studentPortal.ts`
* `src/services/studentPortal/studentPortal.service.ts`
* `src/features/studentPortal/hooks/useStudentExamination.ts`
* `src/features/studentPortal/components/StudentExaminationPage/index.tsx`
* `src/features/studentPortal/components/StudentExaminationPage/styles.module.scss`
* `src/features/studentPortal/components/StudentExaminationPage/constant.ts`
* `docs/CHANGE_LOG.md`

### Files Created

* `src/features/studentPortal/components/StudentExaminationPage/components/ImageOptionQuestion/index.tsx`
* `src/features/studentPortal/components/StudentExaminationPage/components/ImageOptionQuestion/styles.module.scss`
* `public/images/shapes/cone.png`
* `public/images/shapes/cube.png`
* `public/images/shapes/sphere.png`
* `public/images/shapes/rectangle.png`

### Components Affected

* Student Examination Page
* Student examination mock API service
* Reusable Image Option Question component

### APIs Affected

* `/api/student/exam/questions` now includes one `image-option` visual reasoning question in the mock response.
* Save answer and submit exam APIs continue using the existing selected-answer string value.

### Breaking Changes

* None. Existing text MCQ questions continue to work.

### Testing Considerations

* Verify the visual reasoning question displays four image options in a responsive grid.
* Verify selecting any image option saves its option id.
* Verify keyboard navigation can focus and select image options.
* Verify submitted state highlights the correct image option and marks an incorrect selected answer.
* Verify text MCQ questions still render and submit normally.

### Future Improvements

* Add backend-provided image metadata such as dimensions and alt text.
* Add support for multi-image prompts and diagram-based questions.
* Add result review screens for all submitted answers.

## Student Examination Guardrails

### Feature Name

Examination Session Protection

### What Was Changed

* Hid the student profile/logout menu on `/student/examination`.
* Added an examination-in-progress status in the student header during the exam.
* Persisted examination progress in browser storage during an active attempt.
* Restored attempted answers, visited questions, current question, and remaining timer after refresh.
* Added a browser refresh warning for active examination attempts.
* Added an in-app toast after refresh to notify the student that refreshing is not allowed and progress was restored.
* Cleared stored examination progress after successful submission.

### Why It Was Changed

* Students should not be able to logout from the examination screen before submitting.
* A refresh should not erase attempted answer state during an active examination.
* Students need a clear warning that refreshing during the exam is not allowed.

### Files Modified

* `src/components/shared/StudentShell/index.tsx`
* `src/components/shared/StudentShell/styles.module.scss`
* `src/features/studentPortal/hooks/useStudentExamination.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student shell header
* Student examination page state hook

### APIs Affected

* None.

### Breaking Changes

* None. Routes and API contracts are unchanged.

### Testing Considerations

* Verify the logout menu is visible on `/student/dashboard`.
* Verify the logout menu is hidden on `/student/examination`.
* Answer a few questions, refresh, and confirm answers and palette states are restored.
* Confirm a browser refresh warning appears during an active exam.
* Confirm an in-app toast appears after the page reloads.
* Submit the exam and confirm stored progress is cleared.

## Student Exam Submit Redirect

### Feature Name

Submit and Return to Dashboard

### What Was Changed

* Redirected students to `/student/dashboard` immediately after the submit exam API succeeds.
* Cleared persisted exam progress before dashboard redirection.
* Removed student-facing post-submit answer review behavior from the active examination page.

### Why It Was Changed

* Students should only submit the exam and return to the dashboard.
* Answer checking/review is reserved for the teacher flow, not the student submission screen.

### Files Modified

* `src/features/studentPortal/hooks/useStudentExamination.ts`
* `src/features/studentPortal/components/StudentExaminationPage/index.tsx`
* `docs/CHANGE_LOG.md`

### APIs Affected

* `/api/student/exam/submit` is still called before redirecting.

### Breaking Changes

* None.

### Testing Considerations

* Submit an exam and confirm the submit API succeeds before redirect.
* Confirm the student lands on `/student/dashboard`.
* Confirm no correct/incorrect answer review is shown to the student after submission.

## Student Exam Timer Restore Fix

### Feature Name

Timer Persistence Guard

### What Was Changed

* Prevented exam progress from being stored before the timer has a valid value.
* Ignored and cleared invalid stored progress where `remainingSeconds` is missing, null, or not positive.
* Ensured the exam timer falls back to the mock exam duration when stored timer progress is invalid.

### Why It Was Changed

* A refresh could restore `remainingSeconds: null`, which caused the countdown effect to stop and display `00:00:00`.

### Files Modified

* `src/features/studentPortal/hooks/useStudentExamination.ts`
* `docs/CHANGE_LOG.md`

### Testing Considerations

* Open `/student/examination` and confirm the timer starts from the exam duration.
* Refresh the exam page and confirm the timer continues from the stored value.
* Clear or corrupt stored exam progress and confirm the timer starts normally from the exam duration.

## Student Shell Repair

### Feature Name

Student Header Markup Fix

### What Was Changed

* Repaired malformed JSX in the student shell header.
* Removed stray text and duplicated closing tags.
* Kept the dashboard profile/logout menu behavior.
* Kept logout hidden during `/student/examination`.

### Why It Was Changed

* The student shell file had invalid JSX that could break compilation.

### Files Modified

* `src/components/shared/StudentShell/index.tsx`
* `docs/CHANGE_LOG.md`

### Testing Considerations

* Confirm `/student/dashboard` shows the profile menu.
* Confirm `/student/examination` shows the examination-in-progress status instead of logout.

## Student Dashboard Rules Modal Access

### Feature Name

Examination Rules Visibility

### What Was Changed

* Added a `View Examination Rules` button on the student dashboard.
* Kept the first-time instructions modal mandatory until the student accepts it.
* Allowed the modal to be reopened after acceptance for review.

### Why It Was Changed

* The modal is hidden after acceptance because the accepted state is stored in browser local storage.
* Students still need a clear way to review the rules again from the dashboard.

### Files Modified

* `src/features/studentPortal/hooks/useStudentDashboard.ts`
* `src/features/studentPortal/components/StudentDashboardPage/index.tsx`
* `src/features/studentPortal/components/StudentDashboardPage/constant.ts`
* `src/features/studentPortal/components/StudentDashboardPage/components/ExamInstructionsModal/index.tsx`
* `docs/CHANGE_LOG.md`

### Testing Considerations

* Clear `lat_exam_instructions_accepted` in local storage and confirm the modal opens automatically.
* Accept the rules and confirm Start Examination becomes enabled.
* Click `View Examination Rules` and confirm the modal opens again.

## Student Dashboard Rules Auto Open

### Feature Name

Rules Modal After Login

### What Was Changed

* The examination rules modal now auto-opens the first time a student reaches the dashboard in a browser session.
* The `View Examination Rules` button remains available on the dashboard.
* Students who have not accepted the rules still cannot dismiss the modal without accepting.
* Students who already accepted can review or close the auto-opened modal.

### Why It Was Changed

* The student should see the rules immediately after login, while still being able to reopen them manually later.

### Files Modified

* `src/features/studentPortal/hooks/useStudentDashboard.ts`
* `src/features/studentPortal/components/StudentDashboardPage/constant.ts`
* `docs/CHANGE_LOG.md`

### Testing Considerations

* Start a fresh browser session and open `/student/dashboard`; the modal should open automatically.
* Accept the modal; the Start Examination button should remain enabled.
* Return to the dashboard in the same session; the modal should not keep reopening automatically.
* Click `View Examination Rules`; the modal should open manually.

## Logout Session Cleanup

### Feature Name

Full Logout Data Cleanup

### What Was Changed

* Updated the logout API to expire all server-visible cookies, including existing auth cookies.
* Updated the client logout flow to clear all client-visible cookies.
* Added browser storage cleanup for `localStorage` and `sessionStorage`.
* Replaced the logout modal cleanup call with a single client session cleanup helper.

### Why It Was Changed

* Logout should remove all server and client session data so the next user does not inherit stale auth, exam, or dashboard state.

### Files Modified

* `src/app/api/logout/route.ts`
* `src/assets/Modals/LogoutModal/index.tsx`
* `src/utils/cookieManager.ts`
* `docs/CHANGE_LOG.md`

### Testing Considerations

* Login, accept rules, start an exam, then logout from an allowed page.
* Confirm auth cookies are cleared.
* Confirm client cookies are cleared.
* Confirm `localStorage` and `sessionStorage` are cleared.
* Confirm the user is redirected to `/`.

## Admin Teachers Layout Fix

### Feature Name

Teacher Management Toolbar and Shell Scroll Fix

### What Was Changed

* Updated the shared admin shell so the sidebar stays at `100vh`.
* Moved vertical scrolling to the main content area instead of the whole page.
* Fixed the Teacher Management toolbar grid so action buttons no longer overlap or get clipped.
* Added minimum widths for Clear, Add Teacher, and Upload Teachers buttons.
* Improved responsive toolbar columns for tablet and desktop widths.

### Why It Was Changed

* The toolbar was using overly narrow fixed grid columns, which caused the Add Teacher and Upload Teachers buttons to collide.
* The admin sidebar should remain fixed to the viewport while the content area scrolls independently.

### Files Modified

* `src/components/shared/AdminShell/styles.module.scss`
* `src/features/teacherManagement/components/TeacherManagementPage/styles.module.scss`
* `src/services/dashboard/dashboard.service.ts`
* `docs/CHANGE_LOG.md`

### Testing Considerations

* Verify `/admin/teachers` toolbar buttons do not overlap at desktop, laptop, and tablet widths.
* Verify the sidebar remains full-height.
* Verify only the content area scrolls vertically.
* Verify typecheck passes after removing the invalid dashboard service `result.error` access.

## Role-Based Route Protection

### Feature Name

Strong Login and Role Access Middleware

### What Was Changed

* Added a Next.js `src/proxy.ts` guard that runs before protected requests.
* Blocked access to application pages when the user does not have a valid login token and server-side user role cookie.
* Redirected logged-in users away from the login page to their correct dashboard.
* Prevented Admin, Teacher, and Student users from opening each other's route areas.
* Added JSON `401` and `403` responses for protected API requests instead of redirecting API calls to the login page.
* Moved auth cookie names and role route constants into a shared auth session constants file.

### Why It Was Changed

* Users should not be able to open internal pages without logging in first.
* Each role should only access its own portal so Admin, Teacher, and Student areas remain separated.
* The route protection should happen before the page renders, not only inside client components.

### Files Modified

* `src/proxy.ts`
* `src/constants/authSession.ts`
* `src/utils/cookieManager.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Login page redirect behavior.
* Admin portal routes under `/admin`.
* Teacher portal routes under `/teacher`.
* Student portal routes under `/student`.

### APIs Affected

* Protected Admin APIs under `/api/admin`.
* Protected Teacher APIs under `/api/teacher`.
* Protected Student APIs under `/api/student`, except the public student login mock.
* Public auth/session APIs remain accessible for login, cookie storage, and logout.

### Any Breaking Changes

* Directly opening Admin, Teacher, or Student routes without login now redirects to `/`.
* Logged-in users with an unknown or missing role are treated as unauthenticated by the guard.

### Testing Considerations

* Open `/admin/dashboard`, `/teacher/dashboard`, or `/student/dashboard` without login and confirm redirect to `/`.
* Login as Admin and confirm `/admin/*` works while `/teacher/*` and `/student/*` redirect to `/admin/dashboard`.
* Login as Teacher and confirm `/teacher/*` works while `/admin/*` and `/student/*` redirect to `/teacher/dashboard`.
* Login as Student and confirm `/student/*` works while `/admin/*` and `/teacher/*` redirect to `/student/dashboard`.
* Confirm protected API routes return `401` without login and `403` for the wrong role.

### Future Improvements

* Replace role checks from the user detail cookie with a signed server-side session when backend session validation is available.
* Add server-side authorization inside sensitive route handlers as a second layer of protection.

## Student Exam Availability Check

### Feature Name

Student Examination Start Status Guard

### What Was Changed

* Added a student exam status check before the dashboard enables the Start Examination button.
* Added a local API route at `/api/student/exam/check` that posts the required student, term, and subject payload to the backend exam check API.
* Added typed support for the three exam statuses: `NOT_STARTED`, `COMPLETED`, and `NOT_UNDER_SCHEDULED`.
* Disabled the Start Examination button unless the backend returns `NOT_STARTED`.
* Added a visible exam status message on the student dashboard.
* Added an examination page guard so direct navigation to `/student/examination` is blocked when the exam is completed or not scheduled.
* Invalidated the exam status query after successful exam submission so returning to the dashboard checks the latest status again.
* Trimmed `NEXT_PUBLIC_APP_URL` before building backend URLs so accidental spaces in `.env.local` do not break API requests.
* Tightened the proxy role detector so `/api/admin`, `/api/teacher`, and `/api/student` routes are checked against the logged-in user's role.

### Why It Was Changed

* Students should only be able to start an exam when the backend says the attempt has not started.
* Completed exams and exams outside the active schedule must not be attempted again.
* A dashboard-only disabled button is not enough because students could directly open the examination URL.

### Files Modified

* `src/app/api/student/exam/check/route.ts`
* `src/config/apiRoutes.ts`
* `src/constants/serverSideRoutes.ts`
* `src/features/studentPortal/hooks/useStudentDashboard.ts`
* `src/features/studentPortal/hooks/useStudentExamination.ts`
* `src/features/studentPortal/components/StudentDashboardPage/index.tsx`
* `src/features/studentPortal/components/StudentDashboardPage/styles.module.scss`
* `src/features/studentPortal/components/StudentDashboardPage/constant.ts`
* `src/features/studentPortal/components/StudentDashboardPage/utils.ts`
* `src/proxy.ts`
* `src/services/studentPortal/studentPortal.service.ts`
* `src/types/studentPortal.ts`
* `src/utils/queryKeys.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student dashboard.
* Student examination page.
* Student exam API integration.
* Route proxy role authorization.

### APIs Affected

* Added local API route: `POST /api/student/exam/check`.
* Backend API used by the local route: `POST /api/v1/students/exam/check`.
* Existing submit API behavior remains unchanged, but successful submit now refreshes the exam status query.

### Any Breaking Changes

* Students can no longer open the examination page unless the exam check status is `NOT_STARTED`.
* Student exam API routes now require a Student role session through the proxy.

### Testing Considerations

* Login as a Student and open `/student/dashboard`; verify the exam status API is called.
* When status is `NOT_STARTED`, verify Start Examination is enabled after rules are accepted.
* When status is `COMPLETED`, verify Start Examination is disabled.
* When status is `NOT_UNDER_SCHEDULED`, verify Start Examination is disabled.
* Directly open `/student/examination` with `COMPLETED` or `NOT_UNDER_SCHEDULED`; verify redirect to dashboard.
* Submit an exam successfully; verify redirect to dashboard and status query runs again.

### Future Improvements

* Replace the temporary default check payload with backend-provided student, term, and subject identifiers when those values are available from the profile or exam assignment API.

## Login Username Validation Update

### Feature Name

Email or Student ID Login Validation

### What Was Changed

* Added a username validation regex that accepts either an email address or a student ID.
* Removed the strict login password pattern check from the client-side form.
* Updated the username validation message to mention student ID instead of phone number.

### Why It Was Changed

* Students log in with student IDs, so the previous email-or-phone validation blocked valid student users.
* Password rules should not prevent login before the backend validates the credentials.

### Files Modified

* `src/utils/regex.ts`
* `src/features/auth/components/LoginPage/components/loginForm/utils.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Login form validation.

### APIs Affected

* No API contract changed. The login request still sends `username` and `password`.

### Any Breaking Changes

* Phone-number-only login values are no longer accepted by the client-side username regex unless they match the student ID format.

### Testing Considerations

* Verify an email can still be entered as username.
* Verify a student ID can be entered as username.
* Verify blank username and blank password are still blocked.
* Verify backend login errors still display normally for invalid credentials.

### Future Improvements

* Replace the generic student ID regex with the official backend student ID format when it is finalized.

## Dynamic Student Exam Check Payload

### Feature Name

Cookie-Based Student ID for Exam Status Check

### What Was Changed

* Removed the static student exam check payload from the student dashboard client code.
* Updated `/api/student/exam/check` to read the logged-in user from the server-side user detail cookie.
* The backend exam check payload now uses the logged-in student's cookie ID for `studentId`.
* The browser still calls the local Next.js API route, while the local route calls the backend IP server-side.

### Why It Was Changed

* The student ID must come from the authenticated user session, not a hardcoded value.
* Keeping the backend call inside the local API route protects the bearer token and keeps API integration consistent.

### Files Modified

* `src/app/api/student/exam/check/route.ts`
* `src/features/studentPortal/components/StudentDashboardPage/constant.ts`
* `src/features/studentPortal/components/StudentDashboardPage/utils.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student dashboard exam status check.
* Student examination access guard.

### APIs Affected

* Local API route: `POST /api/student/exam/check`.
* Backend API payload now receives dynamic `studentId` from the logged-in user cookie.

### Any Breaking Changes

* The exam check route now returns `401` if the logged-in student ID cannot be read from cookies.

### Testing Considerations

* Login as a student and verify the `x_det` cookie contains the user ID.
* Open the student dashboard and confirm the backend receives the logged-in student's ID.
* Confirm the dashboard keeps Start Examination disabled if the user cookie is missing or invalid.

### Future Improvements

* Replace the temporary default `termId` and `subjectId` values with dynamic exam assignment values when the backend provides them.

## Backend URL Configuration Cleanup

### Feature Name

Backend API Base URL Formatting

### What Was Changed

* Removed the leading space from `NEXT_PUBLIC_APP_URL` in `.env.local`.

### Why It Was Changed

* The local Next.js API route forwards exam status checks to the backend IP.
* Keeping the backend URL clean avoids malformed server-side fetch URLs.

### Files Modified

* `.env.local`
* `docs/CHANGE_LOG.md`

### Components Affected

* Server-side API forwarding through local Next.js route handlers.

### APIs Affected

* Backend calls using `NEXT_PUBLIC_APP_URL`, including `/api/v1/students/exam/check`.

### Any Breaking Changes

* None.

### Testing Considerations

* Restart the dev server after changing `.env.local`.
* Confirm local API routes forward to `http://192.168.0.233:3001`.

### Future Improvements

* Use a server-only environment variable name for backend URLs if this value should not be exposed to the browser bundle.

## Dynamic Exam Check Authorization Token

### Feature Name

Cookie-Based Backend Authorization for Exam Check

### What Was Changed

* Updated `/api/student/exam/check` to read the `x_tok` auth token from cookies.
* Passed the cookie token explicitly as the backend Bearer token for `/api/v1/students/exam/check`.
* Added a `401` response when the auth token is missing from cookies.

### Why It Was Changed

* The exam check API must use the logged-in student's real session token.
* Hardcoded bearer tokens are unsafe and would break for different students.

### Files Modified

* `src/app/api/student/exam/check/route.ts`
* `src/services/studentPortal/studentPortal.service.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student dashboard exam status check.
* Student examination access guard.

### APIs Affected

* Local route `POST /api/student/exam/check` now forwards the dynamic cookie token to the backend.

### Any Breaking Changes

* Requests without `x_tok` now return `401`.

### Testing Considerations

* Login as a student and confirm `x_tok` exists.
* Open the student dashboard and confirm the backend receives `Authorization: Bearer <cookie token>`.
* Remove `x_tok` and confirm the local route returns `401`.

### Future Improvements

* Move all authenticated backend calls to this explicit token-forwarding pattern for easier auditing.

## Admin Question Generator

### Feature Name

Question Generator Admin Module

### What Was Changed

* Added a new Admin page at `/admin/questions`.
* Added a Question Generator sidebar entry in the Admin portal.
* Built a professional admin UI for generating, searching, viewing, adding, editing, and deleting questions.
* Added mock-backed API routes for question list, create, update, delete, and generation workflows.
* Added typed question records, options, filters, form values, and generate payloads.
* Added responsive table and mobile card layouts.
* Added Add/Edit Question modal with validation.
* Added Question Preview modal.
* Added Delete Question confirmation modal.
* Added status badges and image thumbnail handling.

### Why It Was Changed

* Admin users need a dedicated interface to manage assessment question content.
* The module should be ready for backend integration while remaining usable with mock data during development.

### Files Modified

* `src/app/admin/questions/page.tsx`
* `src/app/api/admin/questions/route.ts`
* `src/app/api/admin/questions/[questionId]/route.ts`
* `src/app/api/admin/questions/generate/route.ts`
* `src/components/shared/Sidebar/constant.tsx`
* `src/constants/serverSideRoutes.ts`
* `src/features/questionGenerator/index.ts`
* `src/features/questionGenerator/hooks/useQuestionGenerator.ts`
* `src/features/questionGenerator/components/QuestionGeneratorPage/index.tsx`
* `src/features/questionGenerator/components/QuestionGeneratorPage/styles.module.scss`
* `src/features/questionGenerator/components/QuestionGeneratorPage/constant.ts`
* `src/features/questionGenerator/components/QuestionGeneratorPage/utils.ts`
* `src/features/questionGenerator/components/QuestionGeneratorPage/components/QuestionFormModal/index.tsx`
* `src/features/questionGenerator/components/QuestionGeneratorPage/components/QuestionFormModal/styles.module.scss`
* `src/features/questionGenerator/components/QuestionGeneratorPage/components/QuestionPreviewModal/index.tsx`
* `src/features/questionGenerator/components/QuestionGeneratorPage/components/QuestionPreviewModal/styles.module.scss`
* `src/features/questionGenerator/components/QuestionGeneratorPage/components/DeleteQuestionModal/index.tsx`
* `src/features/questionGenerator/components/QuestionGeneratorPage/components/DeleteQuestionModal/styles.module.scss`
* `src/services/questionGenerator/questionGenerator.service.ts`
* `src/types/questionGenerator.ts`
* `src/utils/queryKeys.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Admin sidebar.
* Admin question generator page.
* Question table, filters, generation panel, and modals.

### APIs Affected

* Added `GET /api/admin/questions`.
* Added `POST /api/admin/questions`.
* Added `PUT /api/admin/questions/:questionId`.
* Added `DELETE /api/admin/questions/:questionId`.
* Added `POST /api/admin/questions/generate`.

### Any Breaking Changes

* None. The page is additive and does not change existing admin, teacher, or student flows.

### Testing Considerations

* Open `/admin/questions` as an Admin user.
* Generate draft questions from the top panel.
* Search by question ID or text.
* Filter by grade, subject, competency, and status.
* Add a question manually and verify it appears in the list.
* Preview a question and verify options/correct answer are displayed.
* Edit a question and verify updates persist in the mock list.
* Delete a question and verify it is removed from the mock list.
* Check desktop and mobile layouts.

### Future Improvements

* Replace mock API services with backend question-bank APIs when available.
* Add bulk import/export when backend question templates are finalized.
* Add image upload support instead of manual image URL entry.

## Admin Question Generator Refinements

### Feature Name

Question Generator Review and HTML Editing Enhancements

### What Was Changed

* Replaced the single competency selector in the generate panel with a searchable multi-select checklist.
* Added Select All support for the competency list.
* Removed Add Question buttons from the Question Generator screen.
* Updated question text rendering so stored HTML displays as formatted content in the table and mobile cards.
* Added a small sanitizer before rendering table HTML.
* Changed the image column action to show `Change` when an image exists and `Add` when no image exists.
* Updated the View flow to open an editor-style review modal.
* The review modal shows competency in read-only mode.
* The review modal allows editing instruction, question HTML, all four options, option relation keys, and image URL.
* Extended question mock data and types to include instruction and option relation keys.
* Updated generated mock questions to support multiple selected competencies.

### Why It Was Changed

* Admins need to generate questions for multiple competencies in one action.
* Backend question text can contain HTML, so the list must render it correctly instead of showing raw tags.
* Reviewers need to edit the full question payload from the View flow before publishing or saving changes.

### Files Modified

* `src/types/questionGenerator.ts`
* `src/services/questionGenerator/questionGenerator.service.ts`
* `src/features/questionGenerator/hooks/useQuestionGenerator.ts`
* `src/features/questionGenerator/components/QuestionGeneratorPage/index.tsx`
* `src/features/questionGenerator/components/QuestionGeneratorPage/styles.module.scss`
* `src/features/questionGenerator/components/QuestionGeneratorPage/constant.ts`
* `src/features/questionGenerator/components/QuestionGeneratorPage/components/CompetencyMultiSelect/index.tsx`
* `src/features/questionGenerator/components/QuestionGeneratorPage/components/CompetencyMultiSelect/styles.module.scss`
* `src/features/questionGenerator/components/QuestionGeneratorPage/components/QuestionFormModal/index.tsx`
* `src/features/questionGenerator/components/QuestionGeneratorPage/components/QuestionFormModal/styles.module.scss`
* `src/features/questionGenerator/components/QuestionGeneratorPage/components/QuestionPreviewModal/index.tsx`
* `src/features/questionGenerator/components/QuestionGeneratorPage/components/QuestionPreviewModal/styles.module.scss`
* `docs/CHANGE_LOG.md`

### Components Affected

* Question generation panel.
* Question list table.
* Question mobile cards.
* View/review editor modal.
* Add/edit question modal.

### APIs Affected

* Mock question create/update/generate payloads now include `instruction` and option `relationKey` values.
* Generate payload now supports multiple competency IDs.

### Any Breaking Changes

* Manual Add Question buttons were removed from the screen as requested.
* Existing mock question payload shape changed to include instruction and option relation keys.

### Testing Considerations

* Open `/admin/questions`.
* Search competencies in the generate panel.
* Select individual competencies and Select All.
* Generate questions and verify competencies rotate through generated records.
* Verify HTML question text renders formatted in the table.
* Verify image column shows `Change` when an image exists and `Add` when it does not.
* Click View and edit instruction, question text, options, relation keys, and image URL.
* Save from the review modal and confirm the table updates.

### Future Improvements

* Replace the lightweight content-editable editor with the approved rich text editor package when dependencies are finalized.
* Add backend-provided competency IDs and option relation IDs when the real question API is available.

## Student Exam Check Backend Reimplementation

### Feature Name

Direct Backend Exam Check Route

### What Was Changed

* Removed the student exam check call from the mock student portal service layer.
* Reimplemented `/api/student/exam/check` to directly POST to the backend endpoint.
* The route now calls `http://192.168.0.233:3001/api/v1/students/exam/check` through the configured backend base URL.
* The route reads `studentId` from the logged-in user's `x_det` cookie.
* The route reads the bearer token from the `x_tok` cookie.
* The backend payload is sent as `{ studentId, termId, subjectId }`, with `termId` and `subjectId` still defaulting to `1` until assignment data is available.
* Removed the unused `studentExamCheck` API route constant from `apiRoutes.ts`.

### Why It Was Changed

* The exam status check should be handled by the real backend API, not the mock student service.
* The student ID and token must come from the authenticated session cookies.

### Files Modified

* `src/app/api/student/exam/check/route.ts`
* `src/services/studentPortal/studentPortal.service.ts`
* `src/config/apiRoutes.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student dashboard exam availability check.
* Student examination access guard.

### APIs Affected

* Local BFF route: `POST /api/student/exam/check`.
* Backend route: `POST /api/v1/students/exam/check`.

### Any Breaking Changes

* The local route no longer uses mock fallback logic.
* The route returns `401` if `x_tok` or a valid student ID is missing.

### Testing Considerations

* Login as a student and verify `x_tok` and `x_det` cookies exist.
* Open `/student/dashboard` and confirm the local route calls the backend with the cookie token.
* Confirm the backend receives the dynamic student ID from cookies.

### Future Improvements

* Replace default `termId` and `subjectId` with dynamic values from the backend exam assignment API.

## Student Dashboard Exam Status Request Fix

### Feature Name

Authenticated Exam Status Check

### What Was Changed

* Updated the student dashboard exam status utility to call the local Next.js route again.
* The dashboard now sends only exam context values: `termId` and `subjectId`.
* The server route remains responsible for adding the dynamic `studentId` from cookies and the bearer token from the httpOnly auth cookie.

### Why It Was Changed

* Direct browser calls to `http://192.168.0.233:3001/api/v1/students/exam/check` were returning unauthorized because the browser cannot read the httpOnly token cookie and backend-domain requests do not receive localhost app cookies.

### Files Modified

* `src/features/studentPortal/components/StudentDashboardPage/utils.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student dashboard exam start button status.

### APIs Affected

* Frontend BFF route: `POST /api/student/exam/check`.
* Backend route still receives: `POST /api/v1/students/exam/check`.

### Any Breaking Changes

* None.

### Testing Considerations

* Login as a student and open `/student/dashboard`.
* Confirm the browser calls `/api/student/exam/check`.
* Confirm the backend receives `Authorization: Bearer <token>` and payload `{ studentId, termId, subjectId }`.

### Future Improvements

* Replace the default term and subject values with backend-provided assigned exam values.

## Backend Driven Student Exam Availability

### Feature Name

Student Dashboard Exam Availability

### What Was Changed

* Restored the student exam status API function in the dashboard utility layer.
* Wired the React Query option to call the exam status API instead of using a missing or mock query function.
* Updated the dashboard hook so the Start Examination button is enabled only when the backend returns `NOT_STARTED`.
* Added backend-driven exam status text for available, completed, unavailable, loading, and error states.
* Updated the retry action to refetch profile, instructions, and exam status together.

### Why It Was Changed

* The backend exam check response must be the single source of truth for whether a student can start the examination.
* Direct frontend conditions and mock/local availability checks could allow the wrong button state.

### Files Modified

* `src/features/studentPortal/components/StudentDashboardPage/utils.ts`
* `src/features/studentPortal/hooks/useStudentDashboard.ts`
* `src/features/studentPortal/components/StudentDashboardPage/index.tsx`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student Dashboard.
* Start Examination button.
* Exam status message card.

### APIs Affected

* Frontend BFF route: `POST /api/student/exam/check`.
* Backend route: `POST /api/v1/students/exam/check`.

### Any Breaking Changes

* None.

### Testing Considerations

* Login as a student and open `/student/dashboard`.
* Verify `NOT_STARTED` enables the Start Examination button.
* Verify `COMPLETED` disables the Start Examination button.
* Verify `NOT_UNDER_SCHEDULED` disables the Start Examination button.
* Verify API error or loading state keeps the button disabled.

### Future Improvements

* Replace the default term and subject IDs with values from the assigned exam record when that backend API is available.

## Student Exam Check Contract Alignment

### Feature Name

Complete Student Exam Check Payload

### What Was Changed

* Added the backend student exam check endpoint to the central API route configuration.
* Added a real student exam check service method that uses the existing server API helper.
* Updated the student dashboard API utility to send the complete payload: `studentId`, `termId`, and `subjectId`.
* The `studentId` is read from the logged-in student's existing client user details, not hardcoded.
* Updated the proxy route to validate the incoming `studentId` against the authenticated server cookie before forwarding.
* The proxy now forwards the complete validated payload to the backend without dropping required fields.

### Why It Was Changed

* The backend API contract requires `studentId`, `termId`, and `subjectId`.
* The browser request to the local proxy and the backend-forwarded request should both match that contract.
* The authenticated cookie remains the server-side guard so one student cannot submit another student's ID.

### Files Modified

* `src/config/apiRoutes.ts`
* `src/services/studentPortal/studentPortal.service.ts`
* `src/app/api/student/exam/check/route.ts`
* `src/features/studentPortal/components/StudentDashboardPage/utils.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student Dashboard.
* Start Examination button availability check.

### APIs Affected

* Frontend BFF route: `POST /api/student/exam/check`
* Backend route: `POST /api/v1/students/exam/check`

### Any Breaking Changes

* The local proxy route now rejects exam-check requests that do not include a valid `studentId`, `termId`, and `subjectId`.
* The local proxy route rejects requests when the submitted `studentId` does not match the authenticated student's cookie.

### Testing Considerations

* In the browser Network tab, confirm `/api/student/exam/check` receives `{ studentId, termId, subjectId }`.
* Confirm the backend request includes `Authorization: Bearer <token>`, `Content-Type: application/json`, `accept: application/json`, and the same complete payload.
* Verify `NOT_STARTED`, `COMPLETED`, and `NOT_UNDER_SCHEDULED` still drive the Start Examination button state.

### Future Improvements

* Replace the default term and subject IDs with values from the assigned exam record when that backend API is available.

## Student Exam Check Unauthorized Fix

### Feature Name

Proxy-Based Authenticated Exam Check

### What Was Changed

* Removed the direct browser call to `http://192.168.0.233:3001/api/v1/students/exam/check`.
* Restored the Student Dashboard exam check call to the internal route: `/api/student/exam/check`.
* Kept the complete payload with dynamic `studentId`, `termId`, and `subjectId`.
* The internal Next.js route continues to forward the request through the existing `serverApi()` authentication flow.

### Why It Was Changed

* Client-side `callApi()` does not read the HttpOnly JWT cookie and does not automatically attach the `Authorization` header.
* The backend was returning `401 Unauthorized` because the direct browser request reached `JwtAuthGuard` without a valid bearer token.

### Files Modified

* `src/features/studentPortal/components/StudentDashboardPage/utils.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Student Dashboard.
* Start Examination button availability check.

### APIs Affected

* Browser route: `POST /api/student/exam/check`
* Backend route: `POST /api/v1/students/exam/check`

### Any Breaking Changes

* None.

### Testing Considerations

* In the browser Network tab, confirm the request goes to `/api/student/exam/check`, not `192.168.0.233`.
* Confirm the request payload includes `studentId`, `termId`, and `subjectId`.
* Confirm the backend no longer returns `401 Unauthorized` when the logged-in token is valid.

### Future Improvements

* Replace the default term and subject IDs with dynamic assigned exam data when the backend provides it.

## Teacher Student Typecheck Stabilization

### Feature Name

Teacher Student Payload Compatibility

### What Was Changed

* Added the missing student status service import in the teacher student update route.
* Preserved extended student fields when the add/edit student form submits.
* Added required extended fields to mock/fallback student records.

### Why It Was Changed

* Full TypeScript verification was failing because strict student types require these fields wherever a student record or form payload is created.

### Files Modified

* `src/app/api/teacher/students/[studentId]/route.ts`
* `src/app/api/teacher/students/[studentId]/status/route.ts`
* `src/features/teacherPortal/components/StudentManagementPage/components/StudentFormModal/index.tsx`
* `src/features/teacherPortal/components/StudentManagementPage/utils.ts`
* `docs/CHANGE_LOG.md`

### Components Affected

* Teacher student add/edit modal.
* Teacher student fallback list.

### APIs Affected

* Teacher student update route now calls the existing status update service correctly.
* Dynamic teacher student routes now use the Next.js 16 async route params shape.

### Any Breaking Changes

* None.

### Testing Considerations

* Re-run TypeScript checks after the student exam backend reimplementation.
* Verify adding/editing a teacher student still keeps all form fields.

### Future Improvements

* Align the status dropdown value type with the shared `StudentStatus` type so numeric dropdown values are no longer needed.
