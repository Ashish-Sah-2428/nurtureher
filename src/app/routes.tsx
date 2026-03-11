import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LandingPage } from "./pages/LandingPage";
import { HomePage } from "./pages/HomePage";
import { MoodTrackerPage } from "./pages/MoodTrackerPage";
import { JournalPage } from "./pages/JournalPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { CommunityPage } from "./pages/CommunityPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AuthPage } from "./pages/AuthPage";
import { BulletinBoardPage } from "./pages/BulletinBoardPage";
import { UpdatesPage } from "./pages/UpdatesPage";
import { CategorySelectionPage } from "./pages/CategorySelectionPage";
import { AssessmentPage } from "./pages/AssessmentPage";
import { PrescriptionUploadPage } from "./pages/PrescriptionUploadPage";
import { PrescriptionsPage } from "./pages/PrescriptionsPage";
import { DoctorDashboardPage } from "./pages/DoctorDashboardPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { CareJourneyPage } from "./pages/CareJourneyPage";
import { UploadReportsPage } from "./pages/UploadReportsPage";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-[#fdf0ec] to-blue-50">
      <div className="text-center p-8">
        <h1 className="text-6xl mb-4">404</h1>
        <p className="text-gray-600 mb-6">Page not found</p>
        <a href="/" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors inline-block">
          Go Home
        </a>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "auth",
        element: <AuthPage />,
      },
      {
        path: "category-selection",
        element: (
          <ProtectedRoute>
            <CategorySelectionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "assessment",
        element: (
          <ProtectedRoute>
            <AssessmentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "care-journey",
        element: (
          <ProtectedRoute>
            <CareJourneyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "mood",
        element: (
          <ProtectedRoute>
            <MoodTrackerPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "journal",
        element: (
          <ProtectedRoute>
            <JournalPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "resources",
        element: (
          <ProtectedRoute>
            <ResourcesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "community",
        element: (
          <ProtectedRoute>
            <CommunityPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "bulletin-board",
        element: <BulletinBoardPage />,
      },
      {
        path: "updates",
        element: <UpdatesPage />,
      },
      {
        path: "prescriptions",
        element: (
          <ProtectedRoute>
            <PrescriptionUploadPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "prescriptions-list",
        element: (
          <ProtectedRoute>
            <PrescriptionsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "doctor-dashboard",
        element: (
          <ProtectedRoute>
            <DoctorDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/dashboard",
        element: (
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "upload-reports",
        element: (
          <ProtectedRoute>
            <UploadReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);