import { Heading, Tab, TabList, TabPanel, Tabs } from 'react-aria-components';

import Navbar from '../components/layout/Navbar';
import { useAuth } from '../contexts/AuthContext';
import CreateInvitationDialog from '../components/invitation/dialogs/CreateInvitationDialog';
import InvitationGivenTable from '../components/invitation/InvitationGivenTable';
import InvitationReceivedTable from '../components/invitation/InvitationReceivedTable';

const Dashboard = () => {
  const { session } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar email={session?.email} />

      <main
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6"
        aria-label="Permission Management Dashboard"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold">
            Permission Management
          </h1>
          <CreateInvitationDialog owner={session?.email ?? ''} />
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="mb-6">
              <Heading level={2} className="text-xl font-semibold mb-1">
                Manage Permissions
              </Heading>
              <p className="text-sm text-gray-500">
                View and manage user permissions
              </p>
            </div>

            <Tabs defaultSelectedKey="invitations-given" className="space-y-6">
              <TabList
                aria-label="Permissions sections"
                className="flex border-b border-gray-200 justify-between"
              >
                <Tab
                  id="invitations-given"
                  className={({ isSelected }) =>
                    `sm:px-4 sm:py-2 py-1 text-center focus:outline-none px-2 sm:-mb-px w-full text-sm font-medium cursor-pointer border-b-2 transition-colors ${
                      isSelected
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`
                  }
                >
                  Invitations Given
                </Tab>
                <Tab
                  id="invitations-received"
                  className={({ isSelected }) =>
                    `sm:px-4 sm:py-2 py-1 px-2 sm:-mb-px text-sm focus:outline-none text-center w-full font-medium cursor-pointer border-b-2 transition-colors ${
                      isSelected
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`
                  }
                >
                  Invitations Received
                </Tab>
              </TabList>

              <TabPanel id="invitations-given">
                <InvitationGivenTable email={session?.email ?? ''} />
              </TabPanel>

              <TabPanel id="invitations-received">
                <InvitationReceivedTable email={session?.email ?? ''} />
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
