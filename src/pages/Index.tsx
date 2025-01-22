import { Link } from 'react-router-dom';
import { Award, Users, ClipboardCheck } from 'lucide-react';

const Index = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Activity Points Tracker
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Track, manage, and verify student activity points all in one place.
        </p>
      </div>

      <div className="mt-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Students</h3>
                <p className="mt-5 text-base text-gray-500">
                  Track your activities, upload certificates, and monitor your progress.
                </p>
                <div className="mt-6">
                  <Link
                    to="/student-login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
                  >
                    Student Login
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                  <ClipboardCheck className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Counselors</h3>
                <p className="mt-5 text-base text-gray-500">
                  Verify student activities and manage your assigned students.
                </p>
                <div className="mt-6">
                  <Link
                    to="/counselor-login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
                  >
                    Counselor Login
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Clubs</h3>
                <p className="mt-5 text-base text-gray-500">
                  Create activities and manage participation records.
                </p>
                <div className="mt-6">
                  <Link
                    to="/club-login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
                  >
                    Club Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;