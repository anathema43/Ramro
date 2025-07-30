import React, { useState } from 'react';
import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function DevelopmentRoadmap() {
  const [activeTab, setActiveTab] = useState('critical');

  const criticalFeatures = [
    {
      id: 1,
      title: "Payment Processing Backend",
      description: "Firebase Functions for Razorpay API endpoints",
      priority: "CRITICAL",
      timeEstimate: "4-6 hours",
      status: "pending",
      blocksProduction: true,
      requirements: [
        "Create order creation endpoint",
        "Implement payment verification",
        "Set up webhook handlers",
        "Add refund processing"
      ]
    },
    {
      id: 2,
      title: "Email Notification System",
      description: "Order confirmations and status updates",
      priority: "HIGH",
      timeEstimate: "3-4 hours",
      status: "pending",
      blocksProduction: false,
      requirements: [
        "Set up Firebase Functions for email",
        "Integrate SendGrid/Mailgun",
        "Create email templates",
        "Implement status notifications"
      ]
    },
    {
      id: 3,
      title: "Production Deployment",
      description: "Live website with custom domain",
      priority: "HIGH",
      timeEstimate: "2-3 hours",
      status: "ready",
      blocksProduction: false,
      requirements: [
        "Deploy to Netlify/Vercel",
        "Configure custom domain",
        "Set up SSL certificates",
        "Configure monitoring"
      ]
    }
  ];

  const implementedFeatures = [
    {
      id: 1,
      title: "Enterprise Security Architecture",
      description: "Server-side role verification and secure file uploads",
      completedDate: "Current",
      testCoverage: "95%",
      features: [
        "Server-side admin role verification",
        "Secure file upload pipeline",
        "Input sanitization and XSS prevention",
        "Resource ownership protection"
      ]
    },
    {
      id: 2,
      title: "Real-time Cart Synchronization",
      description: "Cross-tab cart updates with Firebase",
      completedDate: "Current",
      testCoverage: "90%",
      features: [
        "onSnapshot real-time updates",
        "Cross-browser tab synchronization",
        "Offline/online state handling",
        "Cart conflict resolution"
      ]
    },
    {
      id: 3,
      title: "Comprehensive Form Validation",
      description: "React Hook Form with accessibility",
      completedDate: "Current",
      testCoverage: "95%",
      features: [
        "React Hook Form integration",
        "Comprehensive validation rules",
        "Accessibility compliance",
        "Security input sanitization"
      ]
    },
    {
      id: 4,
      title: "Image Optimization System",
      description: "Responsive images with size optimization",
      completedDate: "Current",
      testCoverage: "85%",
      features: [
        "Responsive image URLs",
        "Size-based optimization",
        "Lazy loading implementation",
        "Performance optimization",
        "Multi-device size selection",
        "Automatic CDN optimization",
        "Error handling and fallbacks"
      ]
    }
  ];

  const futureFeatures = [
    {
      id: 1,
      title: "Advanced Search & Discovery",
      description: "Algolia integration with autocomplete",
      priority: "HIGH",
      timeEstimate: "8-12 hours",
      phase: "Month 1"
    },
    {
      id: 2,
      title: "Enhanced Product Experience",
      description: "Image galleries, reviews, comparisons",
      priority: "HIGH",
      timeEstimate: "6-8 hours",
      phase: "Month 1"
    },
    {
      id: 3,
      title: "Mobile App Development",
      description: "React Native mobile application",
      priority: "LOW",
      timeEstimate: "40-60 hours",
      phase: "Month 3-6"
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-600 bg-red-100';
      case 'HIGH': return 'text-orange-600 bg-orange-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
      case 'ready':
        return <ExclamationTriangleIcon className="w-5 h-5 text-blue-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-organic-background py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-organic-text mb-4">
            🚀 Development Roadmap
          </h1>
          <p className="text-xl text-organic-text opacity-75 max-w-3xl mx-auto">
            Track our journey to create a world-class Himalayan e-commerce experience
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
            <div className="text-sm text-organic-text">Core Features Complete</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
            <div className="text-sm text-organic-text">Critical Items Remaining</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-organic-primary mb-2">0</div>
            <div className="text-sm text-organic-text">Security Vulnerabilities</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-3xl font-bold text-organic-highlight mb-2">85%</div>
            <div className="text-sm text-organic-text">Test Coverage</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('critical')}
            className={`px-6 py-3 font-medium rounded-lg transition-all ${
              activeTab === 'critical'
                ? 'bg-red-600 text-white'
                : 'bg-white text-organic-text hover:bg-organic-background'
            }`}
          >
            Critical (3)
          </button>
          <button
            onClick={() => setActiveTab('implemented')}
            className={`px-6 py-3 font-medium rounded-lg transition-all ${
              activeTab === 'implemented'
                ? 'bg-green-600 text-white'
                : 'bg-white text-organic-text hover:bg-organic-background'
            }`}
          >
            Implemented (15+)
          </button>
          <button
            onClick={() => setActiveTab('future')}
            className={`px-6 py-3 font-medium rounded-lg transition-all ${
              activeTab === 'future'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-organic-text hover:bg-organic-background'
            }`}
          >
            Future Features
          </button>
        </div>

        {/* Critical Features */}
        {activeTab === 'critical' && (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-red-800 mb-2">
                🔴 Critical Requirements - Must Implement Next
              </h2>
              <p className="text-red-700">
                These features are required for production launch and optimal user experience.
              </p>
            </div>

            {criticalFeatures.map((feature) => (
              <div key={feature.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(feature.status)}
                    <h3 className="text-xl font-bold text-organic-text">
                      {feature.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(feature.priority)}`}>
                      {feature.priority}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-organic-text opacity-75">Estimate</div>
                    <div className="font-semibold text-organic-text">{feature.timeEstimate}</div>
                  </div>
                </div>

                <p className="text-organic-text mb-4">{feature.description}</p>

                {feature.blocksProduction && (
                  <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                      <span className="text-red-800 font-medium">Blocks Production Launch</span>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-organic-text mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {feature.requirements.map((req, index) => (
                      <li key={index} className="text-organic-text opacity-75">{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Implemented Features */}
        {activeTab === 'implemented' && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-green-800 mb-2">
                ✅ Successfully Implemented Features
              </h2>
              <p className="text-green-700">
                These features have been completed, tested, and are ready for production use.
              </p>
            </div>

            {implementedFeatures.map((feature) => (
              <div key={feature.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-bold text-organic-text">
                      {feature.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-organic-text opacity-75">Test Coverage</div>
                    <div className="font-semibold text-green-600">{feature.testCoverage}</div>
                  </div>
                </div>

                <p className="text-organic-text mb-4">{feature.description}</p>

                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <div className="text-sm text-green-800">
                    <strong>Completed:</strong> {feature.completedDate}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-organic-text mb-2">Implemented Features:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {feature.features.map((feat, index) => (
                      <li key={index} className="text-organic-text opacity-75">{feat}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-800 mb-2">Additional Implemented Features</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Core E-commerce:</h4>
                  <ul className="text-blue-700 space-y-1 text-sm">
                    <li>✅ Product catalog with search</li>
                    <li>✅ Shopping cart persistence</li>
                    <li>✅ User authentication</li>
                    <li>✅ Order management</li>
                    <li>✅ Wishlist functionality</li>
                    <li>✅ Admin dashboard</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Technical Features:</h4>
                  <ul className="text-blue-700 space-y-1 text-sm">
                    <li>✅ Responsive design</li>
                    <li>✅ Accessibility compliance</li>
                    <li>✅ Performance optimization</li>
                    <li>✅ Security hardening</li>
                    <li>✅ Testing framework</li>
                    <li>✅ Error handling</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Future Features */}
        {activeTab === 'future' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-blue-800 mb-2">
                🔮 Future Development Pipeline
              </h2>
              <p className="text-blue-700">
                Planned features to enhance the platform and provide world-class user experience.
              </p>
            </div>

            {futureFeatures.map((feature) => (
              <div key={feature.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <ClockIcon className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-organic-text">
                      {feature.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(feature.priority)}`}>
                      {feature.priority}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-organic-text opacity-75">Timeline</div>
                    <div className="font-semibold text-organic-text">{feature.phase}</div>
                  </div>
                </div>

                <p className="text-organic-text mb-4">{feature.description}</p>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-organic-text opacity-75">
                    Estimated effort: {feature.timeEstimate}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    Planned for {feature.phase}
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-organic-text mb-4">Development Phases</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-organic-text mb-2">Phase 1: Foundation</h4>
                  <p className="text-sm text-organic-text opacity-75 mb-2">Solidifying the Platform</p>
                  <ul className="text-sm text-organic-text space-y-1">
                    <li>• Comprehensive testing strategy</li>
                    <li>• CI/CD pipeline establishment</li>
                    <li>• Component library & design system</li>
                    <li>• Advanced security hardening</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-organic-text mb-2">Phase 2: E-commerce</h4>
                  <p className="text-sm text-organic-text opacity-75 mb-2">Core Business Capabilities</p>
                  <ul className="text-sm text-organic-text space-y-1">
                    <li>• Advanced search and discovery</li>
                    <li>• Comprehensive order management</li>
                    <li>• User-generated content features</li>
                    <li>• Enhanced product experiences</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-organic-text mb-2">Phase 3: Scaling</h4>
                  <p className="text-sm text-organic-text opacity-75 mb-2">Intelligence & Performance</p>
                  <ul className="text-sm text-organic-text space-y-1">
                    <li>• Scalable frontend framework</li>
                    <li>• Analytics & business intelligence</li>
                    <li>• Personalization engine</li>
                    <li>• Performance optimization</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Items */}
        <div className="mt-12 bg-organic-primary text-white rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">🎯 Next Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">This Week</h3>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Implement Razorpay backend APIs</li>
                <li>• Set up email notification system</li>
                <li>• Deploy to production environment</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Next Month</h3>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Advanced search implementation</li>
                <li>• Enhanced product experience</li>
                <li>• SEO and marketing optimization</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Long Term</h3>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Mobile app development</li>
                <li>• AI-powered features</li>
                <li>• International expansion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}