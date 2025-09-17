import { useState } from 'react';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { 
  Heart, 
  Star, 
  Trash2, 
  Edit, 
  Plus, 
  Download,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info,
  X
} from 'lucide-react';

export default function ComponentTestPage() {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleToastTest = (type: 'success' | 'error' | 'info' | 'warning') => {
    const messages = {
      success: 'Operation completed successfully!',
      error: 'Something went wrong. Please try again.',
      info: 'Here is some useful information.',
      warning: 'Please be careful with this action.'
    };
    
    addToast(messages[type], type);
  };

  const handleConfirmAction = () => {
    addToast('Action confirmed!', 'success');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Component Test Page
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Testing all the new UI components from Phase 3
        </p>
      </div>

      {/* Button Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Button Component</CardTitle>
          <CardDescription>Testing all button variants and sizes with Adviso brand colors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Variants */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-[var(--color-text-primary)]">Variants</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Default</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </div>
          
          {/* Status Variants */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-[var(--color-text-primary)]">Status Variants</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="info">Info</Button>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Sizes</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* With Icons */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">With Icons</h3>
            <div className="flex flex-wrap gap-3">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* Disabled State */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Disabled State</h3>
            <div className="flex flex-wrap gap-3">
              <Button disabled>Disabled Default</Button>
              <Button variant="outline" disabled>Disabled Outline</Button>
              <Button variant="destructive" disabled>Disabled Destructive</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Simple Card</CardTitle>
            <CardDescription>
              A basic card with header and content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              This is the main content area of the card. It can contain any type of content.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Featured Card
            </CardTitle>
            <CardDescription>
              Card with icon in title
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              This card demonstrates how to include icons in the title area.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Learn More</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Action Card</CardTitle>
            <CardDescription>
              Card with footer actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              This card shows how to use the CardFooter component for actions.
            </p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Toast Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Toast Notifications</CardTitle>
          <CardDescription>
            Test the global toast notification system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              onClick={() => handleToastTest('success')}
              className="text-green-600 border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-600 dark:hover:bg-green-900/20"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Success
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleToastTest('error')}
              className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
            >
              <X className="h-4 w-4 mr-2" />
              Error
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleToastTest('info')}
              className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-900/20"
            >
              <Info className="h-4 w-4 mr-2" />
              Info
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleToastTest('warning')}
              className="text-yellow-600 border-yellow-300 hover:bg-yellow-50 dark:text-yellow-400 dark:border-yellow-600 dark:hover:bg-yellow-900/20"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Warning
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal Components */}
      <Card>
        <CardHeader>
          <CardTitle>Modal Components</CardTitle>
          <CardDescription>
            Test modal and confirmation modal components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={() => setIsModalOpen(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Open Modal
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setIsConfirmModalOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Item
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Theme Information */}
      <Card>
        <CardHeader>
          <CardTitle>Theme System</CardTitle>
          <CardDescription>
            The theme toggle in the header cycles through: Light → Dark → System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Light Mode</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-900 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Dark Mode</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-white to-gray-900 border border-gray-300 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">System (follows OS preference)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Test Modal"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            This is a test modal to demonstrate the Modal component functionality.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Features tested:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
            <li>Escape key to close</li>
            <li>Click backdrop to close</li>
            <li>Focus trapping</li>
            <li>Body scroll prevention</li>
            <li>Accessibility attributes</li>
          </ul>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              addToast('Modal action completed!', 'success');
              setIsModalOpen(false);
            }}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmAction}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
