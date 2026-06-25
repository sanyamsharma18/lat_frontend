# Change Log

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
