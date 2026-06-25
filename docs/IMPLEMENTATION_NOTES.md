## Teacher Management Module

### Overview

The Admin Teacher Management module was added so Admin users can view, search, add, edit, and delete teachers. Each teacher currently has a Teacher Name and School Name.

The module is available at `/admin/teachers`.

### Sidebar Changes

The existing sidebar configuration was reused. A new Admin menu item named `Teacher Management` was added and points to `/admin/teachers`.

No new sidebar was created, and no existing sidebar behavior was changed.

An Admin route shell was added to wrap `/admin/*` pages with the existing desktop sidebar, mobile header, and mobile sidebar components.

### Pages Added

* `/admin/teachers` renders the Teacher Management page.
* `/api/admin/teachers` provides mock list and create APIs.
* `/api/admin/teachers/[teacherId]` provides mock update and delete APIs.

### Components Reused

* `DataTable` for the teacher listing.
* `Input` for search, teacher name, and school name fields.
* `Button` for primary, secondary, pagination, retry, and delete actions.
* `Modal` for Add/Edit Teacher and Delete Teacher confirmation.
* `Text` for consistent typography.
* `ShimmerUiContainer` for loading placeholders.
* `Toaster` for success and error messages.
* `DesktopSidebar`, `MobileSidebar`, and `MobileHeader` for Admin navigation.

### Components Created

* `TeacherManagementPage` for the complete admin teacher workflow.
* `TeacherFormModal` for both Add Teacher and Edit Teacher.
* `DeleteTeacherModal` for delete confirmation.
* `useTeacherManagement` for search, pagination, modal state, and mutations.
* `AdminShell` to compose the existing sidebar and mobile header around Admin pages.

### Mock APIs Added

Mock APIs were added in `src/services/teacher/teacher.service.ts`.

The mock Teacher List returns:

* John Doe - ABC School
* Sarah Smith - XYZ School

The mock Create Teacher API returns:

* `success: true`
* `message: "Teacher created successfully"`

The mock Update Teacher API returns:

* `success: true`
* `message: "Teacher updated successfully"`

The mock Delete Teacher API returns:

* `success: true`
* `message: "Teacher deleted successfully"`

These APIs are connected through local Next.js route handlers, so the UI behaves like it is using real APIs.

### Future Backend Integration Notes

When backend APIs are ready, replace the mock service implementation in `src/services/teacher/teacher.service.ts` with real backend calls or reconnect the route handlers to `serverApi`.

The UI should not need major changes because it already calls `/api/admin/teachers` and `/api/admin/teachers/[teacherId]`.

Expected backend endpoints:

* `GET /admin/teachers`
* `POST /admin/teachers`
* `PUT /admin/teachers/:teacherId`
* `DELETE /admin/teachers/:teacherId`

### Testing Instructions

1. Open `/admin/teachers`.
2. Confirm the table shows John Doe and Sarah Smith.
3. Search by teacher name or school name.
4. Click Add Teacher, enter Teacher Name and School Name, and submit.
5. Confirm the new teacher appears in the table.
6. Click Edit, update the teacher details, and submit.
7. Confirm the row updates.
8. Click Delete, confirm the delete modal, and verify the teacher is removed.
9. Confirm loading, empty, and error states remain styled consistently with the rest of the app.
