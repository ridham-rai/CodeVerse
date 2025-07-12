import React from 'react';
import Logo from './Logo';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const features = [
    { icon: '🚀', title: 'Unlimited Projects', description: 'Create as many projects as you want' },
    { icon: '👥', title: 'Advanced Collaboration', description: 'Real-time collaboration with up to 10 users' },
    { icon: '🔒', title: 'Private Projects', description: 'Keep your code private and secure' },
    { icon: '📊', title: 'Advanced Analytics', description: 'Detailed insights into your coding habits' },
    { icon: '🌐', title: 'Custom Domains', description: 'Host your projects on custom domains' },
    { icon: '⚡', title: 'Priority Support', description: '24/7 priority customer support' },
    { icon: '🎨', title: 'Custom Themes', description: 'Access to premium editor themes' },
    { icon: '📦', title: 'Advanced Integrations', description: 'GitHub, GitLab, and more integrations' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden border border-gray-600">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Logo size="md" showText={true} />
              <div className="text-white">
                <h2 className="text-2xl font-bold">Upgrade to Pro</h2>
                <p className="text-blue-100">Unlock the full potential of CodeVerse</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Free Plan */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <h3 className="text-white font-bold text-xl mb-2">Free</h3>
              <div className="text-3xl font-bold text-white mb-4">$0<span className="text-lg text-gray-400">/month</span></div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✅ 3 Projects</li>
                <li>✅ Basic Editor</li>
                <li>✅ Community Support</li>
                <li>❌ Collaboration</li>
                <li>❌ Private Projects</li>
              </ul>
              <button className="w-full mt-4 bg-gray-600 text-white py-2 rounded-lg cursor-not-allowed">
                Current Plan
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 border-2 border-blue-400 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                  MOST POPULAR
                </span>
              </div>
              <h3 className="text-white font-bold text-xl mb-2">Pro</h3>
              <div className="text-3xl font-bold text-white mb-4">$9<span className="text-lg text-blue-100">/month</span></div>
              <ul className="space-y-2 text-blue-100 text-sm">
                <li>✅ Unlimited Projects</li>
                <li>✅ Advanced Editor</li>
                <li>✅ Real-time Collaboration</li>
                <li>✅ Private Projects</li>
                <li>✅ Priority Support</li>
              </ul>
              <button className="w-full mt-4 bg-white text-blue-600 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                Upgrade Now
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <h3 className="text-white font-bold text-xl mb-2">Enterprise</h3>
              <div className="text-3xl font-bold text-white mb-4">$29<span className="text-lg text-gray-400">/month</span></div>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✅ Everything in Pro</li>
                <li>✅ Team Management</li>
                <li>✅ Advanced Analytics</li>
                <li>✅ Custom Integrations</li>
                <li>✅ Dedicated Support</li>
              </ul>
              <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-bold transition-colors">
                Contact Sales
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div>
            <h3 className="text-white font-bold text-xl mb-6 text-center">Pro Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6">
            <h3 className="text-white font-bold text-xl mb-2">Ready to upgrade?</h3>
            <p className="text-blue-100 mb-4">Join thousands of developers who have upgraded to Pro</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                Start Free Trial
              </button>
              <button className="border border-white text-white px-6 py-2 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
